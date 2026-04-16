import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const usersRouter = router({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const email =
      ctx.clerkUser.emailAddresses[0]?.emailAddress ??
      `temp-${ctx.userId}@example.com`;
    const firstName = ctx.clerkUser.firstName ?? "";
    const lastName = ctx.clerkUser.lastName ?? "";
    const imageUrl = ctx.clerkUser.imageUrl ?? null;

    // Keep DB profile in sync with Clerk on every request (real-time feel).
    await ctx.db.user.upsert({
      where: { id: ctx.userId },
      create: {
        id: ctx.userId,
        email,
        firstName,
        lastName,
        imageUrl,
      },
      update: {
        email,
        firstName,
        lastName,
        imageUrl,
      },
    });

    return ctx.db.user.findUnique({
      where: { id: ctx.userId },
      include: { learnerProfile: true, teacherProfile: true },
    });
  }),
  completeOnboarding: protectedProcedure
    .input(z.object({ role: z.enum(['LEARNER', 'TEACHER']) }))
    .mutation(async ({ ctx, input }) => {
      const { role } = input;
      const email = ctx.clerkUser.emailAddresses[0]?.emailAddress ?? `temp-${ctx.userId}@example.com`;
      const firstName = ctx.clerkUser.firstName ?? '';
      const lastName = ctx.clerkUser.lastName ?? '';
      const imageUrl = ctx.clerkUser.imageUrl ?? null;

      const user = await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: {
          id: ctx.userId,
          email,
          firstName,
          lastName,
          imageUrl,
          role,
        },
        update: {
          role,
          email,
          firstName,
          lastName,
          imageUrl,
        },
      });
      if (role === 'TEACHER') {
        const username = `teacher_${ctx.userId.slice(-6)}`;
        await ctx.db.teacherProfile.upsert({
          where: { userId: ctx.userId },
          create: {
            userId: ctx.userId,
            username,
            bio: '',
            hourlyRate: 0,
          },
          update: {},
        });
      }
      if (role === 'LEARNER') {
        await ctx.db.learnerProfile.upsert({
          where: { userId: ctx.userId },
          create: {
            userId: ctx.userId,
            goals: '',
          },
          update: {},
        });
      }
      
      const redirectTo = role === 'LEARNER' ? '/onboarding/learner-setup' : '/onboarding/teacher-setup';
      return { success: true, redirectTo, user };
    }),
  teacherSetupProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      topics: z.string(),
      hourlyRate: z.number().min(0),
      bio: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const parts = input.name.trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const imageUrl = ctx.clerkUser.imageUrl ?? null;

      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { firstName, lastName, imageUrl }
      });

      const topicNames = input.topics.split(',').map((t: string) => t.trim()).filter(Boolean);

      return ctx.db.teacherProfile.update({
        where: { userId: ctx.userId },
        data: {
          bio: input.bio,
          hourlyRate: input.hourlyRate,
          topics: {
            connectOrCreate: topicNames.map((name: string) => ({
              where: { name },
              create: { name }
            }))
          }
        }
      });
    }),
  learnerSetupProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      goals: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const parts = input.name.trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const imageUrl = ctx.clerkUser.imageUrl ?? null;

      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { firstName, lastName, imageUrl }
      });

      return ctx.db.learnerProfile.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          goals: input.goals,
        },
        update: {
          goals: input.goals,
        }
      });
    }),
});
