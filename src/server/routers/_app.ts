import { createRouter } from '../createRouter'
import superjson from 'superjson'
import { userRouter } from './user'
import { prodRouter } from './prodotto'
import { fornitoreRouter } from './fornitore'
import { authRouter } from './auth'
import { listinoRouter } from './listino'
import { persRouter } from './personalizzazione'
import { prevRouter } from './preventivo'
import { scuolaRouter } from './scuola'

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!'
    },
  })
  .merge('auth.', authRouter)
  .merge('user.', userRouter)
  .merge('prodotto.', prodRouter)
  .merge('fornitore.', fornitoreRouter)
  .merge('listino.', listinoRouter)
  .merge('pers.', persRouter)
  .merge('preventivo.', prevRouter)
  .merge('scuola.', scuolaRouter)
export type AppRouter = typeof appRouter
