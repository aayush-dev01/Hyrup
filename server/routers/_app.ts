import { router, publicProcedure } from '../trpc';
import { usersRouter } from './users';
import { actionItemsRouter } from './actionItems';

const searchRouter = router({
  ping: publicProcedure.query(() => ({ ok: true })),
});

const bookingsRouter = router({
  ping: publicProcedure.query(() => ({ ok: true })),
});

const sessionsRouter = router({
  ping: publicProcedure.query(() => ({ ok: true })),
});

const aiRouter = router({
  ping: publicProcedure.query(() => ({ ok: true })),
});

export const appRouter = router({
  users: usersRouter,
  actionItems: actionItemsRouter,
  search: searchRouter,
  bookings: bookingsRouter,
  sessions: sessionsRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
