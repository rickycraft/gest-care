import { NextApiRequest, NextApiResponse } from 'next'
import { mapPreventivoRow, preventivo_row } from 'interfaces/preventivo'
import { getPreventivoRows } from 'scripts/preventivo'

export default async (req: NextApiRequest, res: NextApiResponse<preventivo_row[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const rows = await getPreventivoRows(id)
  if (rows === undefined) {
    res.status(404).end()
  } else {
    res.status(200).json(rows)
  }
}