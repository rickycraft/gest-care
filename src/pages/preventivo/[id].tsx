import Head from 'next/head'
import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useEffect, useMemo, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import TableRowPrev from 'components/preventivo/TableRowPrev'
import { Prisma } from '@prisma/client'
import { useRouter } from 'next/router'
import ErrorMessage from 'components/utils/ErrorMessage'

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
      context.invalidateQueries(['preventivo.byId', { id: idPreventivo }])
      context.invalidateQueries(['preventivo.row.list', { prevId: idPreventivo }])
    },
    enabled: idPreventivo != invalidId,
  }
  const preventiviQuery = trpc.useQuery(['preventivo.byId', { id: idPreventivo }], {
    enabled: idPreventivo != invalidId,
  })
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId: idPreventivo }], {
    enabled: idPreventivo != invalidId,
  })
  const preventivoRowInsert = trpc.useMutation('preventivo.row.insert', preventivoRowCallback)
  const preventivoRowUpdate = trpc.useMutation('preventivo.row.update', preventivoRowCallback)
  const preventivoRowDelete = trpc.useMutation('preventivo.row.delete', preventivoRowCallback)
  const prodottiQuery = trpc.useQuery(['prodotto.list', { listino: listinoId }], {
    enabled: listinoId !== invalidId,
  })
  const persQuery = trpc.useQuery(['pers.list', { listino: listinoId }], {
    enabled: listinoId !== invalidId,
  })

  useEffect(() => {
    if (!preventiviQuery.isSuccess) return
    if (!preventiviQuery.data) {
      router.push('/preventivo/list')
      return
    }
    setListinoId(preventiviQuery.data.listinoId)
    prodottiQuery.refetch()
    persQuery.refetch()
  }, [preventiviQuery.status])

  if (!preventivoRowQuery.isSuccess || !preventiviQuery.isSuccess || !prodottiQuery.isSuccess || !persQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <div>
      <Head>
        <title>Righe Preventivo</title>
      </Head>
      <main>
        <h1>
          Righe Preventivo &nbsp;
        </h1>
        <p>ultima modifica alle {preventiviQuery.data?.editedAt.toLocaleString()}</p>
        {/*Tabella che mostra i prodotti del preventivo selezionato*/}
        <Table bordered hover >
          <thead>
            <tr>
              <th>Prodotto</th>
              <th></th>
              <th>Pers</th>
              <th></th>
              <th>School-Care</th>
              <th>Commericiale</th>
              <th>Rappresentanti</th>
              <th>TOT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {preventivoRowQuery.data.map((prevRow) => (
              <TableRowPrev
                key={prevRow.id}
                row={prevRow}
                prodList={prodottiQuery.data}
                persList={persQuery.data}
                onClickInsert={() => { }}
                onClickDelete={(row_id) => preventivoRowDelete.mutate({ id: row_id })}
                onClickEdit={(row) => preventivoRowUpdate.mutate(row)} />
            ))}
            {/* Empty row */}
            <TableRowPrev
              key={invalidId}
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
              onClickEdit={() => { }} />
          </tbody>
        </Table>

        {/* alert per mostrare i messaggi di errore */}
        <ErrorMessage message={errorMsg} />
      </main>
    </div >
  )
}
