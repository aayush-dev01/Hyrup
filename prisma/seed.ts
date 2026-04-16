/* Purpose: Seed coherent Clario data for local development + demos. */

import { PrismaClient, Prisma } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function setTime(d: Date, h: number, m: number) {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
}

async function main() {
  // Clean slate (idempotent-ish)
  await db.notification.deleteMany();
  await db.message.deleteMany();
  await db.actionItem.deleteMany();
  await db.sessionSummary.deleteMany();
  await db.session.deleteMany();
  await db.payment.deleteMany();
  await db.feedback.deleteMany();
  await db.booking.deleteMany();
  await db.teacherAvailability.deleteMany();
  await db.teacherProfile.deleteMany();
  await db.learnerProfile.deleteMany();
  await db.topic.deleteMany();
  await db.user.deleteMany();

  const mayaUserId = "seed_teacher_maya";
  const learnerIds = [
    { id: "seed_learner_aayush", firstName: "Aayush", lastName: "Bharti", email: "aayush@clario.app" },
    { id: "seed_learner_sneha", firstName: "Sneha", lastName: "Kapoor", email: "sneha@clario.app" },
    { id: "seed_learner_ravi", firstName: "Ravi", lastName: "Shankar", email: "ravi@clario.app" },
    { id: "seed_learner_priya", firstName: "Priya", lastName: "Mehta", email: "priya@clario.app" },
  ];

  const maya = await db.user.create({
    data: {
      id: mayaUserId,
      email: "maya@clario.app",
      firstName: "Maya",
      lastName: "Krishnan",
      role: "TEACHER",
      imageUrl: null,
    },
  });

  const topics = await Promise.all(
    ["UX Research", "Usability Testing", "Design Systems"].map((name) =>
      db.topic.create({ data: { name } })
    )
  );

  const mayaProfile = await db.teacherProfile.create({
    data: {
      userId: maya.id,
      username: "maya-krishnan",
      bio:
        "I help learners build confident UX research instincts—turning messy questions into clean studies, and findings into decisions. Calm sessions, clear frameworks, real momentum.",
      hourlyRate: new Prisma.Decimal(1200),
      isAccepting: true,
      topics: { connect: topics.map((t) => ({ id: t.id })) },
      availability: {
        create: [
          { dayOfWeek: 1, startMin: 10 * 60, endMin: 17 * 60, slotMin: 60 },
          { dayOfWeek: 2, startMin: 10 * 60, endMin: 17 * 60, slotMin: 60 },
          { dayOfWeek: 3, startMin: 10 * 60, endMin: 17 * 60, slotMin: 60 },
          { dayOfWeek: 4, startMin: 10 * 60, endMin: 17 * 60, slotMin: 60 },
          { dayOfWeek: 5, startMin: 10 * 60, endMin: 17 * 60, slotMin: 60 },
        ],
      },
    },
  });

  const learners = await Promise.all(
    learnerIds.map(async (l) => {
      const u = await db.user.create({
        data: {
          id: l.id,
          email: l.email,
          firstName: l.firstName,
          lastName: l.lastName,
          role: "LEARNER",
          imageUrl: null,
        },
      });
      const lp = await db.learnerProfile.create({
        data: {
          userId: u.id,
          goals: "Become confident with UX research planning, interview scripts, and synthesis.",
        },
      });
      return { user: u, profile: lp };
    })
  );

  const now = new Date();
  const upcomingBase = addDays(now, 3);

  // Two per learner: one completed, one upcoming
  for (let i = 0; i < learners.length; i++) {
    const learner = learners[i];

    // Completed
    const completedStart = setTime(addDays(now, -(10 + i * 2)), 15, 0);
    const completedEnd = new Date(completedStart);
    completedEnd.setMinutes(completedEnd.getMinutes() + 60);

    const completedRoom = crypto.randomUUID();
    const completedBooking = await db.booking.create({
      data: {
        teacherId: mayaProfile.id,
        learnerId: learner.profile.id,
        startTime: completedStart,
        endTime: completedEnd,
        status: "COMPLETED",
        notes: "Focus: research question framing + interview plan.",
        session: {
          create: {
            roomIdentifier: completedRoom,
            startedAt: completedStart,
            endedAt: completedEnd,
          },
        },
        payment: {
          create: {
            stripePaymentIntentId: `pi_${crypto.randomUUID()}`,
            amount: new Prisma.Decimal(1200),
            platformFee: new Prisma.Decimal(0),
            status: "PAID_OUT",
          },
        },
        feedback: {
          create: {
            teacherId: mayaProfile.id,
            learnerId: learner.profile.id,
            rating: 5,
            comments:
              "Maya made research feel simple. In one session we turned my vague idea into a tight plan and a script I could actually use.",
          },
        },
      },
      include: { session: true },
    });

    const summary = await db.sessionSummary.create({
      data: {
        sessionId: completedBooking.session!.id,
        aiGeneratedNotes:
          "We clarified the core research question, identified the riskiest assumptions, designed a lightweight study, and drafted a 7-question interview script. We also defined a synthesis method (affinity notes → themes → decisions) and a 48-hour next-step plan.",
        actionItems: {
          create: [
            { task: "Write a one-sentence research question and 3 assumptions to test." },
            { task: "Draft an interview screener (5 questions) and recruit 3 participants." },
            { task: "Run one pilot interview and refine the script." },
            { task: "Prepare an affinity template for synthesis (themes + evidence)." },
          ],
        },
      },
    });
    void summary;

    // Upcoming (auto-confirmed per spec)
    const upcomingStart = setTime(addDays(upcomingBase, i), 16, 0);
    const upcomingEnd = new Date(upcomingStart);
    upcomingEnd.setMinutes(upcomingEnd.getMinutes() + 60);

    await db.booking.create({
      data: {
        teacherId: mayaProfile.id,
        learnerId: learner.profile.id,
        startTime: upcomingStart,
        endTime: upcomingEnd,
        status: "CONFIRMED",
        notes: "Next: usability test plan + task design.",
        session: {
          create: {
            roomIdentifier: crypto.randomUUID(),
          },
        },
        payment: {
          create: {
            stripePaymentIntentId: `pi_${crypto.randomUUID()}`,
            amount: new Prisma.Decimal(1200),
            platformFee: new Prisma.Decimal(0),
            status: "UNPAID",
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

