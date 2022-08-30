import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'server/prisma'

export default async function OptionsFix(req: NextApiRequest, res: NextApiResponse) {
  try {
    const opts = await prisma.preventivoDefaultOpt.findMany()
    const preventivi = await prisma.preventivo.findMany({
      select: {
        id: true,
        _count: { select: { options: true } }
      }
    })
    var counter = 0
    preventivi.forEach(async (preventivo) => {
      if (preventivo._count.options != 0) return
      console.log('adding to id', preventivo.id)
      await prisma.preventivoOption.createMany({
        data: opts.map(opt => ({
          prevId: preventivo.id,
          prevDefaultOptId: opt.id,
          selected: opt.selected,
        })),
      })
      counter += 1
    })
    res.send({ count: counter })
  } catch {
    res.status(500).end()
  }
}