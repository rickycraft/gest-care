import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapProdotto, prodotto } from 'interfaces/prodotto'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse<prodotto[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const prodotti = await prisma.prodotto.findMany({
    where: {
      fornitoreId: id,
    }
  })

  res.status(200).json(prodotti.map(mapProdotto))
}