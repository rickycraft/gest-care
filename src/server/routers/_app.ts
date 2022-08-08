import { createRouter } from '../createRouter'
import superjson from 'superjson'
import { userRouter } from './user'
import { prodRouter } from './prodotto'

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!'
    },
  })
  .merge('user.', userRouter)
  .merge('prodotto.', prodRouter)
export type AppRouter = typeof appRouter
