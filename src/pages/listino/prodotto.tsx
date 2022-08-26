import Head from 'next/head'
import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import TableRow from 'components/listino/TableRow'
import ModalListino from 'components/listino/ModalListino'
import ProdSubmitRow from 'components/listino/ProdSubmitRow'
import ErrorMessage from 'components/utils/ErrorMessage'

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
    if (prodottoDelete.isSuccess || prodottoUpdate.isSuccess) prodQuery.refetch()
  }, [prodottoDelete.isSuccess, prodottoUpdate.isSuccess])

  const updateProdotto = async (idProdotto: number, prezzo: number) => {
    if (prodottoUpdate.isLoading) return
    prodottoUpdate.mutate({
      id: idProdotto,
      prezzo: prezzo,
    })
  }
  const deleteProdotto = async (idProdotto: number) => {
    if (prodottoDelete.isLoading) return
    prodottoDelete.mutate({ id: idProdotto })
  }

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess) return <Spinner animation="border" variant="primary" />

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
            <ProdSubmitRow
              listino={listino}
              updateList={() => prodQuery.refetch()}
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

