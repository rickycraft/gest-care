import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import TableRowPrev from 'components/preventivo/TableRowPrev'
import { Prisma } from '@prisma/client'

const invalidId = -1
const idPreventivo = 1

export default function Index() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listinoId, setListinoId] = useState(invalidId)

  const preventivoRowCallback = {
    onError() {
      setErrorMsg('Errore riga preventivo')
    },
    onSuccess() {
      trpc.useContext().invalidateQueries(['preventivo.row.list', { prevId: idPreventivo }])
    }
  }
  const preventiviQuery = trpc.useQuery(['preventivo.byId', { id: idPreventivo }])
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId: idPreventivo }])
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
    if (!preventiviQuery.data) return
    setListinoId(preventiviQuery.data.listinoId)
    prodottiQuery.refetch()
    persQuery.refetch()
  }, [preventiviQuery.status])


  if (!preventivoRowQuery.isSuccess || !preventiviQuery.isSuccess || !prodottiQuery.isSuccess || !persQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <div className="container">
      <Head>
        <title>Righe Preventivo</title>
      </Head>
      <main>
        <h1>
          Righe Preventivo &nbsp;
        </h1>
        {/*Tabella che mostra i prodotti del preventivo selezionato*/}
        <Table bordered hover >
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Prezzo Prodotto</th>
              <th>Personalizzazione</th>
              <th>Prezzo Personalizzazione</th>
              <th>Provvigione School-Care</th>
              <th>Provvigione Rappresentanti</th>
              <th>Provvigione Fornitori</th>
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
            {/* riga per inserire un nuovo prodotto*/}
            {/*
            <PrevRowSubmitRow
              preventivo={idPreventivo}
              updateList={() => preventivoRowQuery.refetch}
              updateErrorMessage={(msg) => setErrorMsg(msg)} />
            */}
          </tbody>
        </Table>

        {/* alert per mostrare i messaggi di errore */}
        <Alert variant='danger' hidden={errorMsg.length === 0}>
          {errorMsg}
        </Alert>
      </main>
    </div >
  )
}
