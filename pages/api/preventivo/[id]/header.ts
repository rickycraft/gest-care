import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { mapPreventivo, preventivo } from 'interfaces/preventivo'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse<preventivo>) => {
  const id = Number(req.query.id)
  if (Number.isNaN(id)) {
    res.status(400).end()
    return
  }

  const preventivo = await prisma.preventivo.findFirst({
    where: {
      id: id,
    }
  })

  if (preventivo === null) {
    res.status(404).end()
  } else {
    res.status(200).json(mapPreventivo(preventivo))
  }
}