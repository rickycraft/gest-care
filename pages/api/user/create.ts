import { NextApiRequest, NextApiResponse } from "next"
import { createUser } from "scripts/user"
import { user } from 'interfaces/user'

export default async (req: NextApiRequest, res: NextApiResponse<user>) => {
  const username = req.query["username"]
  const password = req.query["password"]
  if (username === undefined || password === undefined || typeof username !== "string" || typeof password !== "string") {
    res.status(400).end()
    return
  }

  const user = await createUser(username, password)
  if (user === undefined) res.status(500).end()
  else res.status(200).json(user)
}