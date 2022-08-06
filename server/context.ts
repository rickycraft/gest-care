/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import { unsealData } from "iron-session";
import * as trpcNext from '@trpc/server/adapters/next';
import { sessionOptions } from "./iron"
import { z } from "zod"

const sessionSchema = z.object({
  user: z.object({
    id: z.number(),
    username: z.string(),
  })
});

export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  const cookie = req.cookies["iron-cookie"];
  if (!cookie) {
    console.error("No cookie found");
    return {};
  }
  //console.log("session: ", cookie)
  const unsealed = await unsealData(cookie, sessionOptions)
  //console.log("unsealed: ", unsealed)
  const result = sessionSchema.safeParse(unsealed)
  if (!result.success) {
    console.error("Invalid session data: ", result.error);
    console.error(cookie);
    return {};
  }
  console.log("user: ", result.data.user)
  return {
    user: result.data.user,
  };
}
type Context = inferAsyncReturnType<typeof createContext>;

