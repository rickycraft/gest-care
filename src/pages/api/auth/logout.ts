import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "server/iron"


export default withSessionRoute(
  async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()
    res.send({ username: '', id: -1, role: '', isLoggedIn: false })

  },
)