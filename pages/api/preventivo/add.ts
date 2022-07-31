import { NextApiRequest, NextApiResponse } from 'next'
import { Preventivo, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const preventivo = req.body

}