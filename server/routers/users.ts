import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const usersRouter = router({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.userId },
      include: { learnerProfile: true, teacherProfile: true },
    });
  }),
  completeOnboarding: protectedProcedure
    .input(z.object({ role: z.enum(['LEARNER', 'TEACHER']) }))
    .mutation(async ({ ctx, input }) => {
      const { role } = input;
      const user = await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { role },
      });
      if (role === 'TEACHER') {
        const username = `teacher_${ctx.userId.slice(-6)}`;
        await ctx.db.teacherProfile.create({
          data: {
            userId: ctx.userId,
            username,
            bio: '',
            hourlyRate: 0,
          }
        });
      }
      return user;
    }),
});
