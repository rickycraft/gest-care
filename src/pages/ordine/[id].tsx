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
            ordineQuery.data.rows.map(row => (
              <tr key={row.id}>
                <td>{row.prevRow.prodotto.nome}</td>
                <td>Pezzi</td>
                <td>{Number(row.prevRow.prodotto.prezzo)}</td>
                <td>{Number(row.prevRow.provvigioneSC)}</td>
                <td>{Number(row.prevRow.provvigioneComm)}</td>
                <td>{Number(row.prevRow.provvigioneRappre)}</td>
                <td>Totale</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </Card>
  )
}