import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapPreventivo } from '../../../../scripts/preventivo'

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
    }
  })

  if (preventivo === null) {
    res.status(404).json({ error: 'Preventivo not found' })
  } else {
    res.status(200).json(mapPreventivo(preventivo))
  }
}