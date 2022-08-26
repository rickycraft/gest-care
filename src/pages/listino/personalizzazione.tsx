import Head from 'next/head'
import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import TableRow from 'components/listino/TableRow'
import ModalListino from 'components/listino/ModalListino'
import PersSubmitRow from 'components/listino/PersSubmitRow'
import ErrorMessage from 'components/utils/ErrorMessage'

const invalidListino = -1

export default function Pers() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listino, setListino] = useState(-1)

  // trpc
  const listinoQuery = trpc.useQuery(['listino.list'])
  const persQuery = trpc.useQuery(['pers.list', { listino }])
  const persUpdate = trpc.useMutation('pers.update', {
    onError() {
      setErrorMsg('Errore nel aggiornare una personalizzazione')
    }
  })
  const persDelete = trpc.useMutation('pers.delete', {
    onError() {
      setErrorMsg('Errore nell eliminare la personalizzazione selezionata')
    }
  })

  useEffect(() => {
    if (!persQuery.isSuccess) return
    if (persDelete.isSuccess || persUpdate.isSuccess) persQuery.refetch()
  }, [persDelete.isSuccess, persUpdate.isSuccess])

  const updatePers = async (idPers: number, prezzo: number) => {
    if (persUpdate.isLoading) return
    persUpdate.mutate({
      id: idPers,
      prezzo: prezzo,
    })
  }
  const deletePers = async (idPers: number) => {
    if (persDelete.isLoading) return
    persDelete.mutate({ id: idPers })
  }

  if (!persQuery.isSuccess || !listinoQuery.isSuccess) return <Spinner animation="border" variant="primary" />

  return (
    <div className="container">
      <Head>
        <title>Personalizzazioni</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Listino &nbsp;
          <ModalListino listinoId={listino} />
        </h1>

        {/* form dropdown per selezionare il listino */}
        <Form.Group className='mb-2'>
          <Form.Select
            value={listino}
            onChange={(event) => { setListino(Number(event.currentTarget.value)) }}
          >
            <option value={invalidListino}>Seleziona un listino</option>
            {listinoQuery.data.map(element => (
              <option key={element.id} value={element.id}>
                {element.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*Tabella che mostra i persotti del listino selezionato*/}
        <Table bordered hover hidden={listino == -1}>
          <thead>
            <tr>
              <th>Nome Personalizzazione</th>
              <th>Prezzo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {persQuery.data.map(pers => (
              <TableRow
                key={pers.id}
                rowId={pers.id}
                rowName={pers.nome}
                rowPrice={pers.prezzo}
                onClickDelete={deletePers}
                onClickEdit={updatePers}
              />
            ))}
            {/* riga per inserire un nuovo Pers */}
            <PersSubmitRow
              listino={listino}
              updateList={() => persQuery.refetch()}
              updateErrorMessage={(msg) => setErrorMsg(msg)}
            />
          </tbody>
        </Table>

        {/* alert per mostrare i messaggi di errore */}
        <ErrorMessage message={errorMsg} />
      </main>
    </div >
  )
}
