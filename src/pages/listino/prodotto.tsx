import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import TableRow from 'components/listino/TableRow'
import ModalListino from 'components/listino/ModalListino'
import SubmitRow from 'components/listino/SubmitRow'

const invalidListino = -1

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listino, setListino] = useState(-1)

  // trpc
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const prodottoUpdate = trpc.useMutation('prodotto.update', {
    onError() {
      setErrorMsg('Errore nel aggiornare un prodotto')
    }
  })
  const prodottoDelete = trpc.useMutation('prodotto.delete', {
    onError() {
      setErrorMsg('Errore nell eliminare il prodotto selezionato')
    }
  })

  useEffect(() => {
    if (!prodQuery.isSuccess) return
    if (prodottoDelete.isSuccess || prodottoUpdate.isSuccess) {
      setErrorMsg('')
      prodQuery.refetch()
    }
  }, [prodottoDelete.isSuccess, prodottoUpdate.isSuccess])
  //TODO: LASCIARE IL WARNING SOPRA ALTRIMENTI ESPLODE IL BROWSER DI CHIAMATE TRPC (prodQuery)

  const updateProdotto = async (idProdotto: number, prezzo: number) => {
    if (prodottoUpdate.isLoading) return
    prodottoUpdate.mutate({
      id: idProdotto,
      prezzo: prezzo,
    })
  }

  const deleteProdotto = async (idProdotto: number) => {
    if (prodottoDelete.isLoading) return
    prodottoDelete.mutate({
      id: idProdotto
    })

  }

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess) {
    return (
      <div>Not ready</div>
    )
  }

  return (
    <div className="container">
      <Head>
        <title>Prodotti</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Listino &nbsp;
          <ModalListino listinoId={listino} updateListinoList={() => listinoQuery.refetch()} />
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
        {/*Tabella che mostra i prodotti del listino selezionato*/}
        <Table bordered hover hidden={listino == -1}>
          <thead>
            <tr>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prodQuery.data.map(prod => (
              <TableRow
                key={prod.id}
                rowId={prod.id}
                rowName={prod.nome}
                rowPrice={prod.prezzo}
                onClickDelete={deleteProdotto}
                onClickEdit={updateProdotto}
              />
            ))}
            {/* riga per inserire un nuovo prodotto */}
            <SubmitRow
              listino={listino}
              updateProdList={() => prodQuery.refetch()}
              updateErrorMessage={(msg) => setErrorMsg(msg)}
            />
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

