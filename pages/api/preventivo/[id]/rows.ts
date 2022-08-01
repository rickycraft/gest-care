import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapPreventivoRow, preventivo_row } from 'interfaces/preventivo'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse<preventivo_row[]>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
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
    res.status(404).end()
  } else {
    const preventivoRows = preventivo.rows.map(mapPreventivoRow)
    res.status(200).json(preventivoRows)
  }
}