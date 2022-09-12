import ModalOptions from 'components/preventivo/ModalOptionsPreventivo'
import TableRowPrev from 'components/preventivo/TableRowPrev'
import ButtonTooltip from 'components/utils/ButtonTooltip'
import ErrorMessage from 'components/utils/ErrorMessage'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { MdContentCopy, MdDownload, MdGridOn } from 'react-icons/md'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

// server side
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { createSSG } from 'server/context'

const parseId = (id: any) => {
  if (id == undefined || Array.isArray(id)) return INVALID_ID
  const numId = Number(id)
  return (isNaN(numId)) ? null : numId
}

const redirect = {
  redirect: {
    destination: '/preventivo/list', permanent: false,
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseId(context.query.id)
  if (id == null) return redirect

  const ssg = await createSSG(context.req.cookies)
  const prev = await ssg.fetchQuery('preventivo.byId', { id })
  if (prev == null) return redirect

  return {
    props: {
      id,
      idListino: prev.listinoId,
      trpcState: ssg.dehydrate(),
    }
  }
}

export default function Index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  // handle query
  const router = useRouter()
  const idPreventivo = props.id as number
  const idListino = props.idListino as number

  //stati vari
  const [errorMsg, setErrorMsg] = useState('')

  const context = trpc.useContext()
  const preventivoRowCallback = {
    onError() {
      setErrorMsg('Errore modifica prodotto')
    },
    onSuccess() {
      preventivoRowQuery.refetch()
    },
  }
  const prodottiQuery = trpc.useQuery(['prodotto.list', { listino: idListino }])
  const persQuery = trpc.useQuery(['pers.list', { listino: idListino }])
  const preventivoQuery = trpc.useQuery(['preventivo.byId', { id: idPreventivo }])
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId: idPreventivo }])
  const preventivoRowInsert = trpc.useMutation('preventivo.row.insert', preventivoRowCallback)
  const preventivoRowUpdate = trpc.useMutation('preventivo.row.update', preventivoRowCallback)
  const preventivoRowDelete = trpc.useMutation('preventivo.row.delete', preventivoRowCallback)
  const preventivoDuplicate = trpc.useMutation('preventivo.duplicate', {
    onSuccess(data) {
      context.prefetchQuery(['preventivo.byId', { id: data.id }])
      context.invalidateQueries(['preventivo.list'])
      router.push(`/preventivo/${data.id}`)
    }
  })

  const locked = useMemo(() => preventivoQuery.data?.locked ?? true, [preventivoQuery.data])

  return (
    <Card body>
      <div className='d-flex align-items-center justify-content-between'>
        <h1>{preventivoQuery.data?.nome.toUpperCase()}</h1>
        <div className='d-flex'>
          <ButtonTooltip tooltip="exporta in excel">
            <Button variant='success' className='me-2 p-2 p-lg-3 rounded-circle'
              onClick={
                () => router.push({
                  pathname: '/preventivo/excel',
                  query: { id: preventivoQuery.data?.id },
                })}
            ><MdGridOn />
            </Button>
          </ButtonTooltip>
          <ButtonTooltip tooltip="esporta in pdf">
            <Button variant='primary' className='me-2 p-2 p-lg-3 rounded-circle'
              onClick={
                () => router.push({
                  pathname: '/preventivo/pdf',
                  query: { id: preventivoQuery.data?.id },
                })}
            ><MdDownload />
            </Button>
          </ButtonTooltip>
          <ButtonTooltip tooltip="duplica">
            <Button variant='primary' className='me-2 p-2 p-lg-3 rounded-circle'
              onClick={() => {
                if (preventivoQuery.data == null) return
                preventivoDuplicate.mutate({ id: preventivoQuery.data.id })
              }}
            ><MdContentCopy />
            </Button>
          </ButtonTooltip>
        </div>
      </div>
      <p>ultima modifica alle {preventivoQuery.data?.editedAt.toLocaleString()}</p>
      {/*Tabella che mostra i prodotti del preventivo selezionato*/}
      <style type="text/css">
        {`
        .table:not(thead) {
          display: block;
          max-height: 60vh;
          overflow-y: auto;
        }
        .table thead tr {
          position: sticky;
          top: 0;
          background-color: white;
          border: solid; border-width: 1px 1px;
          border-color: #dee2e6;
        }
        .table thead tr th {
          border: solid; border-width: 0 1px;
          border-color: #dee2e6;
        }
        tbody tr:last-child {
          background-color: white;
          position: sticky;
          bottom: 0;
        }
        .t-input-number {
          width: 8%;
          min-width: 5em;
        }
        .t-number {
          width: 5%;
          min-width: 4em;
        }
        .t-select {
          min-width: 10em;
        }
        .btn {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            margin-left: auto;
            margin-right: auto;
        }
        `}
      </style>
      <Table bordered responsive className='w-100'>
        <thead>
          <tr>
            <th className='t-select'>Prodotto</th>
            <th className='t-number'></th>
            <th className='t-select'>Pers</th>
            <th className='t-number'></th>
            <th className='t-input-number'>SC</th>
            <th className='t-input-number'>Comm.</th>
            <th className='t-input-number'>Rappr.</th>
            <th className='t-number'>TOT</th>
            <th style={{ width: "16%" }}></th>
          </tr>
        </thead>
        <tbody>
          {preventivoRowQuery.data?.map((prevRow) => (
            <TableRowPrev
              locked={locked}
              key={prevRow.id}
              row={prevRow}
              prodList={prodottiQuery.data ?? []}
              persList={persQuery.data ?? []}
              onClickInsert={() => { }}
              onClickDelete={(row_id) => preventivoRowDelete.mutate({ id: row_id })}
              onClickEdit={(row) => preventivoRowUpdate.mutate(row)} />
          ))}
          {/* Empty row */}
          {!locked && <TableRowPrev
            key={INVALID_ID}
            locked={false}
            row={{
              id: INVALID_ID,
              prevId: idPreventivo,
              prodId: INVALID_ID,
              persId: INVALID_ID,
              provComm: 0,
              provRappre: 0,
              provSc: 0,
            }}
            prodList={prodottiQuery.data ?? []}
            persList={persQuery.data ?? []}
            onClickInsert={(new_row) => preventivoRowInsert.mutate(new_row)}
            onClickDelete={() => { }}
            onClickEdit={() => { }} />}
        </tbody>
      </Table>
      <ModalOptions prevId={idPreventivo} />
      {/* alert per mostrare i messaggi di errore */}
      <ErrorMessage message={errorMsg} />
    </Card>
  )
}
