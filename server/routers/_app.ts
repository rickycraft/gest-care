import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { userRouter } from './user';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('user.', userRouter);
export type AppRouter = typeof appRouter;
