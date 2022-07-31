import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapPreventivoRow } from '../../../../scripts/preventivo'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }

  const preventivo = await prisma.preventivo.findFirst({
    where: {
      id: id,
    },
    include: {
      rows: true,
    }
  })

  if (preventivo === null) {
    res.status(404).json({ error: 'Preventivo not found' })
  } else {
    const preventivoRows = preventivo.rows.map(mapPreventivoRow)
    res.status(200).json(preventivoRows)
  }
}