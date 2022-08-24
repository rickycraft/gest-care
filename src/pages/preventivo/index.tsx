import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import { SetStateAction, useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import TableRowPrev from 'components/preventivo/TableRowPrev'
import PrevRowSubmitRow from 'components/preventivo/PrevRowSubmitRow'
import { updatePrevRow } from 'server/routers/preventivo_row'

const invalidId = -1
const idPreventivo = 1

export default function Index() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listinoId, setListinoId] = useState(invalidId)

  const preventiviQuery = trpc.useQuery(['preventivo.byId', { id: idPreventivo }])
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId: idPreventivo }])
  const preventivoRowUpdate = trpc.useMutation('preventivo.row.update', {
    onError() {
      setErrorMsg('Errore aggiornamento riga preventivo')
    },
    onSuccess() {
      trpc.useContext().invalidateQueries(['preventivo.row.list', { prevId: idPreventivo }])
    }
  })
  const preventivoRowDelete = trpc.useMutation('preventivo.row.delete', {
    onError() {
      setErrorMsg('Errore eliminazione riga preventivo')
    },
    onSuccess() {
      trpc.useContext().invalidateQueries(['preventivo.row.list', { prevId: idPreventivo }])
    }
  })
  const prodottiQuery = trpc.useQuery(['prodotto.list', { listino: listinoId }], {
    enabled: listinoId !== invalidId,
  })
  const persQuery = trpc.useQuery(['pers.list', { listino: listinoId }], {
    enabled: listinoId !== invalidId,
  })

  const updatePreventivoRow = (row: updatePrevRow) => {
    if (preventivoRowUpdate.isLoading) return
    preventivoRowUpdate.mutate(row)
  }
  const deletePreventivoRow = (rowId: number) => {
    if (preventivoRowDelete.isLoading) return
    preventivoRowDelete.mutate({ id: rowId })
  }

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
                onClickDelete={(row_id) => deletePreventivoRow(row_id)}
                onClickEdit={(row) => updatePreventivoRow(row)} />
            ))}
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
