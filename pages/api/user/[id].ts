import { user } from 'interfaces/user'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from 'scripts/user'
import { getIdFromReq } from 'scripts/utils'

export default async (req: NextApiRequest, res: NextApiResponse<user>) => {
  const id = getIdFromReq(req, res)
  if (id === null) return

  const user = await getUser(id)
  if (user === undefined) res.status(404).end()
  else res.status(200).json(user)
}