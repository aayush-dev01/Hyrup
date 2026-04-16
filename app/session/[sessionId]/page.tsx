/* Live Session Room — WebRTC + Socket.io session. */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

type VerifyAccessResult = {
  authorized: boolean;
  session: { id: string; roomIdentifier: string } | null;
  booking: {
    teacher: { userId: string; user: { firstName: string; lastName: string; imageUrl: string | null } };
    learner: { userId: string; user: { firstName: string; lastName: string; imageUrl: string | null } };
  } | null;
};

type ChatMessage = { roomId: string; message: string; senderId: string; senderName: string; createdAt?: string };

export default function SessionRoom({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { userId } = useAuth();
  const sessionId = params.sessionId;

  const verifyQ = trpc.sessions.verifyAccess.useQuery({ roomId: sessionId }, { enabled: !!userId });
  const startM = trpc.sessions.start.useMutation();
  const endM = trpc.sessions.end.useMutation();

  const [connectionStatus, setConnectionStatus] = useState<"waiting" | "connected" | "disconnected">("waiting");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const targetSocketIdRef = useRef<string | null>(null);

  // WebRTC Setup — write this logic exactly:
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const turnUrl = process.env.NEXT_PUBLIC_TURN_SERVER_URL;
  const ICE_SERVERS: RTCConfiguration = useMemo(
    () => ({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        ...(turnUrl
          ? [
              {
                urls: turnUrl,
                username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
                credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
              } satisfies RTCIceServer,
            ]
          : []),
      ],
    }),
    [turnUrl]
  );

  const v = verifyQ.data as VerifyAccessResult | undefined;
  const authorized = v?.authorized;
  const booking = v?.booking ?? null;
  const session = v?.session ?? null;

  const role =
    userId && booking?.teacher?.userId === userId ? "TEACHER" : "LEARNER";

  const myName =
    role === "TEACHER"
      ? `${booking?.teacher?.user?.firstName ?? ""} ${booking?.teacher?.user?.lastName ?? ""}`.trim()
      : `${booking?.learner?.user?.firstName ?? ""} ${booking?.learner?.user?.lastName ?? ""}`.trim();

  const otherName =
    role === "TEACHER"
      ? `${booking?.learner?.user?.firstName ?? ""} ${booking?.learner?.user?.lastName ?? ""}`.trim()
      : `${booking?.teacher?.user?.firstName ?? ""} ${booking?.teacher?.user?.lastName ?? ""}`.trim();

  useEffect(() => {
    if (authorized === false) router.replace("/dashboard");
  }, [authorized, router]);

  useEffect(() => {
    if (!authorized) return;
    if (!session?.id) return;
    startM.mutate({ sessionId: session.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, session?.id]);

  useEffect(() => {
    if (!authorized) return;
    if (!userId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    socketRef.current = socket;
    const localEl = localVideoRef.current;

    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setMediaError(null);
        if (localEl) {
          localEl.srcObject = stream;
        }
        setIsMicOn(stream.getAudioTracks()[0]?.enabled ?? false);
        setIsVideoOn(stream.getVideoTracks()[0]?.enabled ?? false);

        // Create peer connection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // Add local tracks
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && targetSocketIdRef.current) {
            socket.emit('ice-candidate', {
              roomId: sessionId,
              candidate: event.candidate,
              targetSocketId: targetSocketIdRef.current,
            });
          }
        };

        // Join room
        socket.emit('join-room', { roomId: sessionId, userId, role });
      })
      .catch(() => {
        setMediaError("Could not access camera/microphone. Please allow permissions and refresh.");
      });

    // Socket event handlers
    socket.on('peer-joined', async ({ socketId }) => {
      targetSocketIdRef.current = socketId;
      const pc = peerConnectionRef.current;
      if (!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId: sessionId, offer, targetSocketId: socketId });
      setConnectionStatus("connected");
    });

    socket.on('offer', async ({ offer, from }) => {
      targetSocketIdRef.current = from;
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId: sessionId, answer, targetSocketId: from });
      setConnectionStatus("connected");
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      await peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on('peer-left', () => {
      setConnectionStatus('disconnected');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    return () => {
      peerConnectionRef.current?.close();
      socket.disconnect();
      const stream = (localEl?.srcObject ?? null) as MediaStream | null;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [sessionId, userId, authorized, role, ICE_SERVERS]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (verifyQ.isLoading) return <div className="min-h-screen bg-warm-white" />;
  if (!authorized) return <div className="min-h-screen bg-warm-white" />;

  // Mute button toggles localStream.getAudioTracks()[0].enabled.
  const onToggleMic = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    const track = stream?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMicOn(track.enabled);
  };

  // Camera button toggles localStream.getVideoTracks()[0].enabled.
  const onToggleCam = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    const track = stream?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsVideoOn(track.enabled);
  };

  // End session button calls trpc.sessions.end.useMutation(), emits session-end to socket, then redirects.
  const onEnd = async () => {
    if (!session?.id) return;
    setIsEnding(true);
    try {
      await endM.mutateAsync({ sessionId: session.id });
      socketRef.current?.emit("session-end", {
        roomId: sessionId,
        sessionId: session.id,
        teacherUserId: verifyQ.data?.booking?.teacher?.userId,
        learnerUserId: verifyQ.data?.booking?.learner?.userId,
      });
      router.push(`/summary/${session.id}`);
    } finally {
      setIsEnding(false);
    }
  };

  // Chat send button emits chat-message to socket with the current input value and clears the input.
  const onSend = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    socketRef.current?.emit('chat-message', { roomId: sessionId, message: msg, senderId: userId, senderName: myName || "You" });
    setChatInput("");
  };

  return (
    <div className="flex w-full h-screen bg-warm-white overflow-hidden font-sans text-ink">
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 p-6 flex gap-4">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-ink/[0.04]">
            <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            {connectionStatus !== "connected" && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                <div>
                  <div className="font-hand text-[28px] text-ink" style={{ transform: "rotate(-1deg)" }}>
                    {connectionStatus === "waiting" ? `Waiting for ${otherName || "peer"}...` : "Reconnecting..."}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-ink-muted text-[13px]">
                    <span className="w-2 h-2 rounded-full bg-ink/40 animate-pulse" />
                    Live room
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-[260px] shrink-0">
            <div className="relative rounded-2xl overflow-hidden bg-ink border border-ink/10 aspect-[4/3]">
              <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-95" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <ProfileAvatar seed={myName || "You"} size={28} className="opacity-90" />
                <span className="text-[12px] text-warm-white/80 font-medium">{myName || "You"}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onToggleMic}
                disabled={!!mediaError}
                className={`flex-1 h-10 rounded-2xl text-[13px] font-semibold ${isMicOn ? "bg-ink/[0.06] text-ink" : "bg-red-500/10 text-red-600 border border-red-500/20"} ${mediaError ? "opacity-50 pointer-events-none" : ""}`}
              >
                {isMicOn ? "Mic on" : "Mic off"}
              </button>
              <button
                onClick={onToggleCam}
                disabled={!!mediaError}
                className={`flex-1 h-10 rounded-2xl text-[13px] font-semibold ${isVideoOn ? "bg-ink/[0.06] text-ink" : "bg-red-500/10 text-red-600 border border-red-500/20"} ${mediaError ? "opacity-50 pointer-events-none" : ""}`}
              >
                {isVideoOn ? "Cam on" : "Cam off"}
              </button>
            </div>

            <button
              onClick={onEnd}
              disabled={isEnding}
              className={`mt-3 w-full h-11 rounded-2xl bg-red-500 text-warm-white font-semibold hover:bg-red-600 transition-colors ${isEnding ? "opacity-70 pointer-events-none" : ""}`}
            >
              {isEnding ? "Ending..." : "End session"}
            </button>
            {mediaError ? (
              <p className="mt-2 text-[12px] text-red-600">{mediaError}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-[320px] lg:w-[380px] h-full border-l border-ink/[0.06] flex flex-col bg-warm-white shrink-0">
        <div className="p-4 border-b border-ink/[0.06] flex items-center justify-between">
          <div className="text-[14px] font-bold text-ink">Chat</div>
          <div className="text-[12px] text-ink/40">{connectionStatus}</div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {chatMessages.map((m, i) => (
            <div key={i} className="text-[13px]">
              <span className="font-bold text-ink">{m.senderName ?? "User"}:</span>{" "}
              <span className="text-ink-muted">{m.message ?? ""}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          className="p-4 border-t border-ink/[0.06] flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border border-ink/[0.10] rounded-2xl px-4 py-2 text-[13px] outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button type="submit" className="px-4 py-2 rounded-2xl bg-ink text-warm-white text-[13px] font-semibold">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

