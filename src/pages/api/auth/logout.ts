import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "server/iron";
import { User } from "../user"; //aggiunto per check sulla res



export default withSessionRoute(
  async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy();
    res.json({logout: 'ok'});
  },
);