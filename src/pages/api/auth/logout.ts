import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "server/iron";

export default withSessionRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy();
    res.send({ ok: true });
  },
);