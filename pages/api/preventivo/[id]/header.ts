import { NextApiRequest, NextApiResponse } from 'next'
import { preventivo } from 'interfaces/preventivo'
import { getPreventivo } from 'scripts/preventivo'

export default async (req: NextApiRequest, res: NextApiResponse<preventivo>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const preventivo = await getPreventivo(id)
  if (preventivo === undefined) {
    res.status(404).end()
  } else {
    res.status(200).json(preventivo)
  }
}