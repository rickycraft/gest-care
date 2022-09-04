import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { prisma } from 'server/prisma'

const invalidProps = {
  props: { idPreventivo: -1 }
}
type Row = {
  prod: string,
  prodPrice: number,
  pers: string,
  persPrice: number,
  provvSC: number,
  provvComm: number,
  provvRappre: number,
  tot: number,
}

const excelSchema = [
  { column: 'Prod', type: String, value: (row: Row) => row.prod },
  { column: 'Costo', type: Number, format: '0.00', value: (row: Row) => row.prodPrice },
  { column: 'Perso', type: String, value: (row: Row) => row.pers },
  { column: 'Costo', type: Number, format: '0.00', value: (row: Row) => row.persPrice },
  { column: 'SC', type: Number, format: '0.00', value: (row: Row) => row.provvSC },
  { column: 'Comm', type: Number, format: '0.00', value: (row: Row) => row.provvComm },
  { column: 'Rappre', type: Number, format: '0.00', value: (row: Row) => row.provvRappre },
  { column: 'Tot', type: Number, format: '0.00', value: (row: Row) => row.tot },
]

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const idPreventivo = Number(id)
  if (isNaN(idPreventivo)) return invalidProps

  const preventivo = await prisma.preventivo.findFirst({
    where: { id: idPreventivo },
    select: { nome: true, scuola: true }
  })
  if (!preventivo) return invalidProps

  const _rows = await prisma.preventivoRow.findMany({
    where: { preventivoId: idPreventivo },
    select: {
      id: true,
      prodotto: true,
      personalizzazione: true,
      provvigioneSC: true,
      provvigioneComm: true,
      provvigioneRappre: true,
    }
  })
  const rows: Row[] = _rows.map(r => ({
    prod: r.prodotto.nome,
    prodPrice: r.prodotto.prezzo.toNumber(),
    pers: r.personalizzazione.nome,
    persPrice: r.personalizzazione.prezzo.toNumber(),
    provvSC: r.provvigioneSC.toNumber(),
    provvComm: r.provvigioneComm.toNumber(),
    provvRappre: r.provvigioneRappre.toNumber(),
    tot: r.prodotto.prezzo.add(r.personalizzazione.prezzo).add(r.provvigioneComm).add(r.provvigioneRappre).add(r.provvigioneSC).toNumber(),
  }))

  return {
    props: {
      idPreventivo,
      preventivo,
      rows,
    }
  }
}

export default function Excel(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  useEffect(() => {
    if (props.idPreventivo === -1) return
    import('write-excel-file').then(xls => {
      xls.default(props.rows, {
        schema: excelSchema,
        fileName: `${props.preventivo.nome}_${props.preventivo.scuola}.xlsx`
      }).then(() => router.push('/preventivo/' + props.idPreventivo))
    })
  }, [])

  if (props.idPreventivo === -1) return <div>Invalid id</div>

  return <Spinner animation='border' />
}
