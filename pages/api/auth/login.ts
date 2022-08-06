import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "server/iron";
import { prisma } from "prisma/client";
import { z } from "zod"


const credSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default withSessionRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const cred = credSchema.parse(req.query);
    const user = await prisma.user.findFirst({
      where: {
        username: cred.username,
        password: cred.password,
      },
      select: {
        id: true,
        username: true,
      },
    })
    if (!user) {
      res.send({ ok: false })
      return
    }
    req.session.user = user;
    await req.session.save();
    res.send({ ok: true });
  },
);