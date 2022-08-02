import { NextApiRequest, NextApiResponse } from 'next'
import { prodotto } from 'interfaces/prodotto'
import { getProdotti } from 'scripts/fornitore'

export default async (req: NextApiRequest, res: NextApiResponse<prodotto[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const prodotti = await getProdotti(id)
  res.status(200).json(prodotti)
}