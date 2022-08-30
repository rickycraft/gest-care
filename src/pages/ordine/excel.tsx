import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { prisma } from 'server/prisma'
import { ordineById, ordineTotal } from 'server/routers/ordine'
import writeXlsxFile from 'write-excel-file'

const invalidProps = {
  props: { idOrdine: -1 }
}

type Row = {
  id: number,
  prod: string,
  quantity: number,
  costo: number,
  sc: number,
  comm: number,
  rappre: number,
  tot: number,
}

const excelSchema = [
  { column: 'Prod', type: String, value: (row: Row) => row.prod },
  { column: 'Pezzi', type: Number, format: '0', value: (row: Row) => row.quantity },
  { column: 'Costo', type: Number, format: '0.00', value: (row: Row) => row.costo },
  { column: 'SC', type: Number, format: '0.00', value: (row: Row) => row.sc },
  { column: 'Comm', type: Number, format: '0.00', value: (row: Row) => row.comm },
  { column: 'Rappre', type: Number, format: '0.00', value: (row: Row) => row.rappre },
  {
    column: 'Tot', type: Number, format: '0.00', value: (row: Row) => (
      row.quantity * (row.costo + row.sc + row.comm + row.rappre)
    )
  },
]

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const idOrdine = Number(id)
  if (isNaN(idOrdine)) return invalidProps

  try {
    const ordine = await ordineById(idOrdine)
    if (!ordine) return invalidProps
    const totals = await ordineTotal(idOrdine)

    return {
      props: {
        idOrdine,
        nome: ordine.preventivo.nome,
        totSC: ordine.totSC.toNumber(),
        totComm: ordine.totComm.toNumber(),
        totRappre: ordine.totRappre.toNumber(),
        rows: ordine.OrdineRow.map(row => ({
          ...row,
          costo: row.costo.toNumber(),
          sc: row.sc.toNumber(),
          comm: row.comm.toNumber(),
          rappre: row.comm.toNumber(),
        })),
        totals
      }
    }
  } catch {
    return invalidProps
  }
}

export default function Excel(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  console.log(props.rows)

  useEffect(() => {
    if (props.idOrdine === -1) return
    writeXlsxFile(props.rows, {
      schema: excelSchema,
      fileName: `ordine_${props.nome}.xlsx`
    })
      .then(() => router.push('/ordine/' + props.idOrdine))
  }, [])

  if (props.idOrdine === -1) return <div>Invalid id</div>

  return <Spinner animation='border' />
}
