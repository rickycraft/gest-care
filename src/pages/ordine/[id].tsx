import TableRow from 'components/ordine/TableRow'
import TotReale from 'components/ordine/TotReale'
import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useRouter } from 'next/router'
import { Button, Card, Spinner, Table } from 'react-bootstrap'
import { MdGridOn, MdReplyAll } from 'react-icons/md'
import { trpc } from 'utils/trpc'
// server side
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { createSSG } from 'server/context'

const parseId = (id: any) => {
  if (id == undefined || Array.isArray(id)) return null
  const numId = Number(id)
  return (isNaN(numId)) ? null : numId
}

const redirect = {
  redirect: {
    destination: '/ordine/list', permanent: false,
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseId(context.query.id)
  if (id == null) return redirect

  const ssg = await createSSG(context.req.cookies)
  try {
    await ssg.fetchQuery('ordine.byId', { id })
    return {
      props: {
        idOrdine: id,
        trpcState: ssg.dehydrate(),
      }
    }
  } catch {
    return redirect
  }
}

export default function Index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  // handle query
  const router = useRouter()
  const idOrdine = props.idOrdine as number

  const ordineQuery = trpc.useQuery(['ordine.byId', { id: idOrdine }])
  const totalsQuery = trpc.useQuery(['ordine.totals', { id: idOrdine }])
  const ordineEdit = trpc.useMutation(['ordine.editRow'], {
    onSuccess: () => {
      ordineQuery.refetch()
      totalsQuery.refetch()
    },
  })

  if (!ordineQuery.isSuccess) return <Spinner animation="border" />

  return (
    <Card body>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2>{ordineQuery.data.preventivo.nome.toUpperCase()}</h2>
        <span className='d-flex'>
          <ButtonTooltip tooltip="exporta in excel">
            <Button variant='success' className='me-2 p-2 p-lg-3 rounded-circle'
              onClick={
                () => router.push({
                  pathname: '/ordine/excel',
                  query: { id: ordineQuery.data.id },
                })}
            ><MdGridOn />
            </Button>
          </ButtonTooltip>
          <ButtonTooltip tooltip="apri preventivo">
            <Button variant='primary' className='me-2 p-2 p-lg-3 rounded-circle'
              onClick={() => router.push(`/preventivo/${ordineQuery.data.preventivo.id}`)}
            ><MdReplyAll style={{ transform: "scaleX(-1)" }} />
            </Button>
          </ButtonTooltip>
        </span>
      </div>
      <style type="text/css">{`
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
        tfoot {
          background-color: white;
          position: sticky;
          bottom: 0;
        }
        .t-number {
          width: 8%;
          min-width: 5em;
        }
        .t-string {
          min-width: 8em;
        }
        .btn {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            margin-left: auto;
            margin-right: auto;
        }
        `}</style>
      <Table bordered responsive className='w-100'>
        <thead>
          <tr>
            <th className='t-string'>Prodotto</th>
            <th className='t-number'>Pezzi</th>
            <th className='t-number'>Costo</th>
            <th className='t-number'>SC</th>
            <th className='t-number'>Comm.</th>
            <th className='t-number'>Rappr.</th>
            <th className='t-number'>TOT</th>
            <th style={{ width: "16%" }}></th>
          </tr>
        </thead>
        <tbody>
          {ordineQuery.data.OrdineRow.map(row => (
            <TableRow key={row.id}
              id={row.id}
              prod={row.prod}
              _quantity={row.quantity}
              costo={row.costo}
              sc={row.sc}
              comm={row.comm}
              rappre={row.rappre}
              onChange={ordineEdit.mutate}
            />
          ))}
        </tbody>
        {totalsQuery.isSuccess && <tfoot>
          <tr>
            <td>Tot Calcolato</td>
            <td>{totalsQuery.data.qt}</td>
            <td>{totalsQuery.data.costo}</td>
            <td>{totalsQuery.data.sc}</td>
            <td>{totalsQuery.data.comm}</td>
            <td>{totalsQuery.data.rappre}</td>
            <td>{totalsQuery.data.tot}</td>
            <td></td>
          </tr>
          <TotReale
            ordineId={ordineQuery.data.id}
            costo={totalsQuery.data.costo}
            _sc={totalsQuery.data.sc}
            _comm={totalsQuery.data.comm}
            _rappre={totalsQuery.data.rappre}
            sc={Number(ordineQuery.data.totSC)}
            comm={Number(ordineQuery.data.totComm)}
            rappre={Number(ordineQuery.data.totRappre)}
          />
        </tfoot>}
      </Table>
    </Card>
  )
}