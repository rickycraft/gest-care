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
  const ordineQuery = trpc.useQuery(['ordine.byId', { id: idOrdine }], {
    enabled: idOrdine !== invalidId,
  })
  const totalsQuery = trpc.useQuery(['ordine.totals', { id: idOrdine }], {
    enabled: idOrdine !== invalidId,
  })
  const ordineEdit = trpc.useMutation(['ordine.editRow'], {
    onSuccess: () => {
      ordineQuery.refetch()
      totalsQuery.refetch()
    },
  })

  const editRow = (id: number, quantity: number) => {
    ordineEdit.mutate({ rowId: id, quantity })
  }

  if (!ordineQuery.isSuccess || !totalsQuery.isSuccess) return <Spinner animation="border" />

  return (
    <Card body>
      <Card.Title>{ordineQuery.data.preventivo.nome}</Card.Title>
      <style type="text/css">
        {`
            .table:not(thead){
              display: block;
              max-height: 60vh;
              overflow-y: auto;
            }
            .table thead tr{
              position: sticky;
              top: 0;
              background-color: white;
              border: solid; border-width: 1px 1px;
              border-color: #dee2e6;
             }
             .table thead tr th{
              border: solid; border-width: 0 1px;
              border-color: #dee2e6;
             }
            tbody tr:last-child{
              background-color: white;
              position: sticky;
              bottom: 0;
            }
          }
          ` }
      </style>
      <Table bordered responsive className='w-100'>
        <style type="text/css"> {`
          .t-input-number {
            width: 8%;
            min-width: 5em;
          }
          .t-number {
            width: 5%;
            min-width: 4em;
          }
          .t-string {
            min-width: 5em;
          }
          .btn {
              display: flex;
              align-items: center;
              flex-wrap: nowrap;
              margin-left: auto;
              margin-right: auto;
          }
        `} </style>
        <thead>
        <tr>
          <th className='t-string'>Prodotto</th>
          <th className='t-input-number'>Pezzi</th>
          <th className='t-number'>Costo</th>
          <th className='t-number'>SC</th>
          <th className='t-number'>Comm.</th>
          <th className='t-number'>Rappr.</th>
          <th className='t-number'>TOT</th>
          <th style={{ width: "16%" }}></th>
          </tr>
        </thead>
     
        <tbody>
          {
            ordineQuery.data.OrdineRow.map(row => (
              <TableRow key={row.id}
                id={row.id}
                _quantity={row.quantity}
                prod={row.prevRow.prodotto}
                pers={row.prevRow.personalizzazione}
                provvSC={Number(row.prevRow.provvigioneSC)}
                provvComm={Number(row.prevRow.provvigioneComm)}
                provvRappre={Number(row.prevRow.provvigioneRappre)}
                onChange={editRow}
              />
            ))
          }
          <tr>
            <td></td>
            <td>{totalsQuery.data.qt}</td>
            <td>{totalsQuery.data.costo}</td>
            <td>{totalsQuery.data.sc}</td>
            <td>{totalsQuery.data.comm}</td>
            <td>{totalsQuery.data.rappre}</td>
            <td>{totalsQuery.data.tot}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </Card>
  )
}