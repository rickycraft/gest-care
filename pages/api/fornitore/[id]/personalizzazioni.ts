import { NextApiRequest, NextApiResponse } from 'next'
import { personalizzazione } from 'interfaces/personalizzazione'
import { getPersonalizzazioni } from 'scripts/fornitore'

export default async (req: NextApiRequest, res: NextApiResponse<personalizzazione[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const personalizzazioni = await getPersonalizzazioni(id)
  res.status(200).json(personalizzazioni)
}