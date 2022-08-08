import { Context } from './context';
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return trpc
    .router<Context>()
    .middleware(async ({ ctx, next }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return next({
        ctx: {
          ...ctx,
          user: ctx.user,
        }
      })
    });
}