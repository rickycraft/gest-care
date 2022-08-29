import TableRow from 'components/ordine/TableRow'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Card, Spinner, Table } from 'react-bootstrap'
import { trpc } from 'utils/trpc'

const invalidId = -1
const parseId = (id: any) => {
  if (id == undefined || Array.isArray(id)) return null
  const numId = Number(id)
  if (isNaN(numId)) return null
  return numId
}

export default function Index() {
  // handle query
  const router = useRouter()
  const idOrdine = useMemo(() => parseId(router.query.id) ?? invalidId, [router.query])
  const ordineQuery = trpc.useQuery(['ordine.byId', { id: idOrdine }])

  if (!ordineQuery.isSuccess) return <Spinner animation="border" />

  return (
    <Card body>
      <Card.Title>{ordineQuery.data.preventivo.nome}</Card.Title>
      <Table bordered responsive>
        <thead>
          <th>Prodotto</th>
          <th>Pezzi</th>
          <th>Costo</th>
          <th>SC</th>
          <th>Comm.</th>
          <th>Rappr.</th>
          <th>TOT</th>
        </thead>
        <tbody>
          {
            ordineQuery.data.OrdineRow.map(row => (
              <TableRow key={row.id}
                _quantity={row.quantity}
                prod={row.prevRow.prodotto}
                pers={row.prevRow.personalizzazione}
                provvSC={Number(row.prevRow.provvigioneSC)}
                provvComm={Number(row.prevRow.provvigioneComm)}
                provvRappre={Number(row.prevRow.provvigioneRappre)}
              />
            ))
          }
        </tbody>
      </Table>
    </Card>
  )
}