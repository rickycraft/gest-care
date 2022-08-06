import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { IronSessionOptions } from "iron-session"

export const sessionOptions: IronSessionOptions = {
  password: process.env.IRON_TOKEN || "complex_password_at_least_32_characters_long",
  cookieName: "iron-cookie",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      username: string;
    };
  }
}