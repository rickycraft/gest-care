import { createRouter } from '../createRouter';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
//.merge('post.', postRouter);
export type AppRouter = typeof appRouter;
