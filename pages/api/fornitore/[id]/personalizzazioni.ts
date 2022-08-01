import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapPersonalizzazione, personalizzazione } from 'interfaces/personalizzazione'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse<personalizzazione[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const personalizzazioni = await prisma.personalizzazione.findMany({
    where: {
      fornitoreId: id,
    }
  })
  console.log(personalizzazioni)

  res.status(200).json(personalizzazioni.map(mapPersonalizzazione))
}