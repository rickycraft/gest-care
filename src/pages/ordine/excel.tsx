import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { ordineById, ordineTotal } from 'server/routers/ordine'

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
}

const excelSchema = [
  { column: 'Prod', type: String, value: (row: Row) => row.prod },
  { column: 'Pezzi', type: Number, format: '0', value: (row: Row) => row.quantity },
  { column: 'Costo', type: Number, format: '0.00', value: (row: Row) => row.costo },
  { column: 'SC', type: Number, format: '0.00', value: (row: Row) => row.sc },
  { column: 'Comm', type: Number, format: '0.00', value: (row: Row) => row.comm },
  { column: 'Rappre', type: Number, format: '0.00', value: (row: Row) => row.rappre },
  { column: 'Tot', type: Number, format: '0.00', value: (row: Row) => (row.costo + row.sc + row.comm + row.rappre) },
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
          costo: row.costo.mul(row.quantity).toNumber(),
          sc: row.sc.mul(row.quantity).toNumber(),
          comm: row.comm.mul(row.quantity).toNumber(),
          rappre: row.rappre.mul(row.quantity).toNumber(),
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
  console.log(props.totals)
  var rows = props.rows as Row[]
  rows.push({
    id: -1,
    prod: 'Tot Calcolato',
    quantity: props.totals.qt,
    costo: props.totals.costo,
    sc: props.totals.sc,
    comm: props.totals.comm,
    rappre: props.totals.rappre,
  })
  rows.push({
    id: -1,
    prod: 'Diff',
    quantity: 0,
    costo: 0,
    sc: props.totSC - props.totals.sc,
    comm: props.totComm - props.totals.comm,
    rappre: props.totRappre - props.totals.rappre,
  })
  rows.push({
    id: -1,
    prod: 'Tot Reale',
    quantity: props.totals.qt,
    costo: props.totals.costo,
    sc: props.totSC,
    comm: props.totComm,
    rappre: props.totRappre,
  })

  useEffect(() => {
    if (props.idOrdine === -1) return
    import('write-excel-file').then(xls => {
      xls.default(rows, {
        schema: excelSchema,
        fileName: `ordine_${props.nome}.xlsx`
      }).then(() => router.push('/ordine/' + props.idOrdine))
    })
  }, [])

  if (props.idOrdine === -1) return <div>Invalid id</div>

  return <Spinner animation='border' />
}
