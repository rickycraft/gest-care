import { z } from "zod"

export const IRON_COOKIE = "iron-cookie"

export const ironSessionOptions = {
  password: process.env.IRON_TOKEN!,
  cookieName: IRON_COOKIE,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  }
}

export const sessionSchema = z.object({
  user: z.object({
    id: z.number(),
    username: z.string(),
    role: z.string(),
  })
})