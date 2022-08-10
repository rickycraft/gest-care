import { createRouter } from '../createRouter'
import superjson from 'superjson'
import { userRouter } from './user'
import { prodRouter } from './prodotto'
import { fornitoreRouter } from './fornitore'

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!'
    },
  })
  .merge('user.', userRouter)
  .merge('prodotto.', prodRouter)
  .merge('fornitore.', fornitoreRouter)
export type AppRouter = typeof appRouter
