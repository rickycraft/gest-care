import { mapPersonalizzazione } from 'interfaces/personalizzazione'
import { mapProdotto } from 'interfaces/prodotto'
import { prisma } from 'prisma/client'

export async function getPersonalizzazioni(id: number) {
  const pers = await prisma.personalizzazione.findMany({
    where: {
      fornitoreId: id,
    }
  })
  return pers.map(mapPersonalizzazione)
}

export async function getProdotti(id: number) {
  const pers = await prisma.prodotto.findMany({
    where: {
      fornitoreId: id,
    }
  })
  return pers.map(mapProdotto)
}