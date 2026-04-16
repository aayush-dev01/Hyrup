/* Purpose: Socket.io signaling + realtime notifications server for Clario (runs separately from Next.js). */

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import * as Sentry from "@sentry/node";
import * as NTypes from "../../lib/notification-types";
import { logger } from "../../lib/logger";
const NotificationTypes = NTypes.NotificationTypes || (NTypes as any).default?.NotificationTypes || NTypes;

type JoinRoomPayload = { roomId: string; userId: string; role: "LEARNER" | "TEACHER" | "ADMIN" | string };
type OfferPayload = { roomId: string; offer: unknown; targetSocketId: string };
type AnswerPayload = { roomId: string; answer: unknown; targetSocketId: string };
type IcePayload = { roomId: string; candidate: unknown; targetSocketId: string };
type LeaveRoomPayload = { roomId: string };
type ChatPayload = { roomId: string; message: string; senderId: string; senderName: string; sessionId?: string };
type RegisterPayload = { userId: string };
type SessionEndPayload = {
  roomId: string;
  sessionId: string;
  teacherUserId?: string;
  learnerUserId?: string;
};

type NotifyBody = { userId: string; notification: unknown };

const PORT = Number(process.env.PORT ?? 4000);
const NEXT_INTERNAL_TRPC_URL =
  process.env.NEXT_INTERNAL_TRPC_URL ?? "http://localhost:3000/api/trpc";
const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV });
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// roomId -> set of socketIds
const roomMap = new Map<string, Set<string>>();
// userId -> socketId (latest connection)
const userSocketMap = new Map<string, string>();
const metrics = {
  connectionsCurrent: 0,
  connectionsTotal: 0,
  sessionJoinsTotal: 0,
  sessionJoinSuccess: 0,
  callDropsTotal: 0,
};

function upsertRoomMember(roomId: string, socketId: string) {
  const set = roomMap.get(roomId) ?? new Set<string>();
  set.add(socketId);
  roomMap.set(roomId, set);
}

function removeRoomMember(roomId: string, socketId: string) {
  const set = roomMap.get(roomId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) roomMap.delete(roomId);
}

function getOtherSocketId(roomId: string, socketId: string) {
  const set = roomMap.get(roomId);
  if (!set) return null;
  for (const id of Array.from(set.values())) {
    if (id !== socketId) return id;
  }
  return null;
}

async function persistChatMessage(payload: ChatPayload) {
  // Spec: make an HTTP call to Next.js tRPC endpoint to persist the message.
  // We call a tRPC procedure `messages.create` we will implement in Next.
  const body = {
    json: {
      roomId: payload.roomId,
      senderId: payload.senderId,
      content: payload.message,
    },
  };

  // tRPC v11 httpBatchLink usually uses /api/trpc/<path>, but direct POST to path works in Next adapter.
  const url = `${NEXT_INTERNAL_TRPC_URL}/messages.create`;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
}

// HTTP endpoint for server-to-server notification delivery
app.post("/notify", (req, res) => {
  const { userId, notification } = req.body as NotifyBody;
  if (!userId) return res.status(400).json({ ok: false, error: "userId required" });
  const socketId = userSocketMap.get(userId);
  if (!socketId) return res.json({ ok: true, delivered: false });
  io.to(socketId).emit("notification", notification);
  return res.json({ ok: true, delivered: true });
});

app.get("/metrics", (_req, res) => {
  res.json({
    socketConnectionsCurrent: metrics.connectionsCurrent,
    socketConnectionsTotal: metrics.connectionsTotal,
    sessionJoinsTotal: metrics.sessionJoinsTotal,
    sessionJoinSuccessRate:
      metrics.sessionJoinsTotal === 0
        ? 0
        : Number((metrics.sessionJoinSuccess / metrics.sessionJoinsTotal).toFixed(4)),
    callDropRate:
      metrics.sessionJoinsTotal === 0
        ? 0
        : Number((metrics.callDropsTotal / metrics.sessionJoinsTotal).toFixed(4)),
    callDropsTotal: metrics.callDropsTotal,
  });
});

io.on("connection", (socket) => {
  metrics.connectionsCurrent += 1;
  metrics.connectionsTotal += 1;
  logger.info("socket.connected", { socketId: socket.id, connectionsCurrent: metrics.connectionsCurrent });
  socket.on("register", (payload: RegisterPayload) => {
    if (!payload?.userId) return;
    userSocketMap.set(payload.userId, socket.id);
  });

  socket.on("join-room", (payload: JoinRoomPayload) => {
    if (!payload?.roomId) return;
    metrics.sessionJoinsTotal += 1;
    socket.join(payload.roomId);
    upsertRoomMember(payload.roomId, socket.id);

    const set = roomMap.get(payload.roomId);
    if (set && set.size >= 2) {
      const other = getOtherSocketId(payload.roomId, socket.id);
      if (other) {
        metrics.sessionJoinSuccess += 1;
        socket.emit("peer-joined", { socketId: other });
        socket.to(other).emit("peer-joined", { socketId: socket.id });
      }
    }
  });

  socket.on("offer", (payload: OfferPayload) => {
    if (!payload?.targetSocketId) return;
    io.to(payload.targetSocketId).emit("offer", { offer: payload.offer, from: socket.id });
  });

  socket.on("answer", (payload: AnswerPayload) => {
    if (!payload?.targetSocketId) return;
    io.to(payload.targetSocketId).emit("answer", { answer: payload.answer, from: socket.id });
  });

  socket.on("ice-candidate", (payload: IcePayload) => {
    if (!payload?.targetSocketId) return;
    io.to(payload.targetSocketId).emit("ice-candidate", { candidate: payload.candidate, from: socket.id });
  });

  socket.on("leave-room", (payload: LeaveRoomPayload) => {
    if (!payload?.roomId) return;
    socket.leave(payload.roomId);
    removeRoomMember(payload.roomId, socket.id);
    socket.to(payload.roomId).emit("peer-left", { socketId: socket.id });
  });

  socket.on("chat-message", async (payload: ChatPayload) => {
    if (!payload?.roomId || !payload?.message) return;
    io.to(payload.roomId).emit("chat-message", {
      roomId: payload.roomId,
      message: payload.message,
      senderId: payload.senderId,
      senderName: payload.senderName,
      createdAt: new Date().toISOString(),
    });
    await persistChatMessage(payload);
  });

  socket.on("session-end", ({ roomId, sessionId, teacherUserId, learnerUserId }: SessionEndPayload) => {
    if (!roomId) return;
    io.to(roomId).emit("session-ended", { roomId, sessionId });
    const notification = {
      type: NotificationTypes.SESSION_COMPLETE,
      title: "Session complete",
      message: "This session ended successfully.",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    if (teacherUserId && userSocketMap.get(teacherUserId)) {
      io.to(userSocketMap.get(teacherUserId) as string).emit("notification", notification);
    }
    if (learnerUserId && userSocketMap.get(learnerUserId)) {
      io.to(userSocketMap.get(learnerUserId) as string).emit("notification", notification);
    }
    roomMap.delete(roomId);
  });

  socket.on("disconnect", () => {
    metrics.connectionsCurrent = Math.max(0, metrics.connectionsCurrent - 1);
    // cleanup userSocketMap entries pointing to this socket
    for (const [userId, sockId] of Array.from(userSocketMap.entries())) {
      if (sockId === socket.id) userSocketMap.delete(userId);
    }
    // best-effort cleanup of rooms
    for (const [roomId, set] of Array.from(roomMap.entries())) {
      if (set.has(socket.id)) {
        set.delete(socket.id);
        metrics.callDropsTotal += 1;
        socket.to(roomId).emit("peer-left", { socketId: socket.id });
        if (set.size === 0) roomMap.delete(roomId);
      }
    }
    logger.info("socket.disconnected", { socketId: socket.id, connectionsCurrent: metrics.connectionsCurrent });
  });
});

server.listen(PORT, () => {
  logger.info("socket.server.started", { port: PORT });
});

