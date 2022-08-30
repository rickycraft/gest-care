import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'server/prisma'

export default async function Prisma(req: NextApiRequest, res: NextApiResponse) {
  const metrics = await prisma.$metrics.prometheus()
  res.end(metrics)
}
