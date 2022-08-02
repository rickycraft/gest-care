import { mapPreventivo, mapPreventivoRow } from 'interfaces/preventivo'
import { prisma } from 'prisma/client'

export async function getPreventivo(id: number) {
  const preventivo = await prisma.preventivo.findFirst({
    where: {
      id: id,
    }
  })
  if (preventivo == undefined) return undefined;
  else return mapPreventivo(preventivo)
}

export async function getPreventivoRows(id: number) {
  const preventivo = await prisma.preventivo.findFirst({
    where: {
      id: id,
    },
    include: {
      rows: true,
    },
  })
  if (preventivo == undefined) return undefined;
  else return preventivo.rows.map(mapPreventivoRow)
}