import { NextApiRequest, NextApiResponse } from "next"
import { updateUser } from "scripts/user"
import { user } from 'interfaces/user'

export default async (req: NextApiRequest, res: NextApiResponse<user>) => {
  const username = req.query["username"]
  const password = req.query["password"]
  const userId = Number(req.query["userId"])
  if (username === undefined || typeof username !== "string"
    || password === undefined || typeof password !== "string"
    || Number.isNaN(userId)) {
    res.status(400).end()
    return
  }

  const user = await updateUser({ id: userId, username, password })
  if (user === undefined) res.status(404).end()
  else res.status(200).json(user)
}