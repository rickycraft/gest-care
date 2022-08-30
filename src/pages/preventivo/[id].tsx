import Head from 'next/head'
import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import TableRowPrev from 'components/preventivo/TableRowPrev'
import { Prisma } from '@prisma/client'
import { useRouter } from 'next/router'
import ErrorMessage from 'components/utils/ErrorMessage'
import ModalOptions from 'components/preventivo/ModalOptionsPreventivo'
import { MdContentCopy, MdDownload, MdGridOn } from 'react-icons/md'


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
  const idPreventivo = useMemo(() => parseId(router.query.id) ?? invalidId, [router.query])
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listinoId, setListinoId] = useState(invalidId)
  const context = trpc.useContext()

  const preventivoRowCallback = {
    onError() {
      setErrorMsg('Errore riga preventivo')
    },
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      preventivoQuery.refetch()
      preventivoRowQuery.refetch()
    },
    enabled: idPreventivo != invalidId,
  }
  const preventivoQuery = trpc.useQuery(['preventivo.byId', { id: idPreventivo }], { enabled: idPreventivo != invalidId })
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId: idPreventivo }], { enabled: idPreventivo != invalidId })
  const preventivoRowInsert = trpc.useMutation('preventivo.row.insert', preventivoRowCallback)
  const preventivoRowUpdate = trpc.useMutation('preventivo.row.update', preventivoRowCallback)
  const preventivoRowDelete = trpc.useMutation('preventivo.row.delete', preventivoRowCallback)
  const preventivoDuplicate = trpc.useMutation('preventivo.duplicate', {
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      router.push('/preventivo/list')
    }
  })
  const prodottiQuery = trpc.useQuery(['prodotto.list', { listino: listinoId }], { enabled: listinoId !== invalidId })
  const persQuery = trpc.useQuery(['pers.list', { listino: listinoId }], { enabled: listinoId !== invalidId })

  useEffect(() => {
    if (!preventivoQuery.isSuccess) return
    if (!preventivoQuery.data) {
      router.push('/preventivo/list')
      return
    }
    setListinoId(preventivoQuery.data.listinoId)
    prodottiQuery.refetch()
    persQuery.refetch()
  }, [preventivoQuery.status])
  const locked = useMemo(() => {
    if (!preventivoQuery.data) return true
    return preventivoQuery.data.locked
  }, [preventivoQuery.data])

  if (!preventivoRowQuery.isSuccess || !preventivoQuery.isSuccess || !prodottiQuery.isSuccess || !persQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <Card body>
      <div className='d-flex align-items-center justify-content-between'>
        <h1>{preventivoQuery.data?.nome.toUpperCase()}</h1>
        <span className='d-flex'>
          <Button variant='success' className='me-2 p-2 p-lg-3 rounded-circle'
            onClick={
              () => router.push({
                pathname: '/preventivo/excel',
                query: { id: preventivoQuery.data?.id },
              })}
          ><MdGridOn /></Button>
          <Button variant='primary' className='me-2 p-2 p-lg-3 rounded-circle'
            onClick={
              () => router.push({
                pathname: '/preventivo/pdf',
                query: { id: preventivoQuery.data?.id },
              })}
          ><MdDownload /></Button>
          <Button variant='primary' className='me-2 p-2 p-lg-3 rounded-circle'
            onClick={() => {
              if (preventivoQuery.data == null) return
              preventivoDuplicate.mutate({ id: preventivoQuery.data.id })
            }}
          ><MdContentCopy /></Button>
        </span>
      </div>
      <p>ultima modifica alle {preventivoQuery.data?.editedAt.toLocaleString()}</p>
      {/*Tabella che mostra i prodotti del preventivo selezionato*/}
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
        `} </style>
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
          {preventivoRowQuery.data.map((prevRow) => (
            <TableRowPrev
              locked={locked}
              key={prevRow.id}
              row={prevRow}
              prodList={prodottiQuery.data}
              persList={persQuery.data}
              onClickInsert={() => { }}
              onClickDelete={(row_id) => preventivoRowDelete.mutate({ id: row_id })}
              onClickEdit={(row) => preventivoRowUpdate.mutate(row)} />
          ))}
          {/* Empty row */}
          {!locked && <TableRowPrev
            key={invalidId}
            locked={false}
            row={{
              id: invalidId,
              prodottoId: invalidId,
              personalizzazioneId: invalidId,
              preventivoId: idPreventivo,
              provvigioneComm: new Prisma.Decimal(0),
              provvigioneRappre: new Prisma.Decimal(0),
              provvigioneSC: new Prisma.Decimal(0),
            }}
            prodList={prodottiQuery.data}
            persList={persQuery.data}
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
