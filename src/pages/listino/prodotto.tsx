import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import TableRow from 'components/listino/TableRow'
import ModalListino from 'components/listino/ModalListino'
import ProdSubmitRow from 'components/listino/ProdSubmitRow'
import ErrorMessage from 'components/utils/ErrorMessage'

const invalidListino = -1

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listino, setListino] = useState(invalidListino)

  // trpc
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const prodottoInsert = trpc.useMutation('prodotto.insert', {
    onSuccess() { prodQuery.refetch() },
    onError() { setErrorMsg('Errore nell inserire il prodotto selezionato') }
  })
  const prodottoUpdate = trpc.useMutation('prodotto.update', {
    onSuccess() { prodQuery.refetch() },
    onError() { setErrorMsg('Errore nel aggiornare un prodotto') }
  })
  const prodottoDelete = trpc.useMutation('prodotto.delete', {
    onSuccess() { prodQuery.refetch() },
    onError() { setErrorMsg('Errore nell eliminare il prodotto selezionato') }
  })

  const updateProdotto = (idProdotto: number, prezzo: number) => {
    if (prodottoUpdate.isLoading) return
    prodottoUpdate.mutate({
      id: idProdotto,
      prezzo: prezzo,
    })
  }
  const deleteProdotto = (idProdotto: number) => {
    if (prodottoDelete.isLoading) return
    prodottoDelete.mutate({ id: idProdotto })
  }

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess) return <Spinner animation="border" variant="primary" />

  return (
    <div className="container">
      {/* form dropdown per selezionare il listino */}
      <div className='d-flex mb-2'>
        <Form.Group className='me-2'>
          <Form.Select value={listino} onChange={(event) => { setListino(Number(event.currentTarget.value)) }}>
            <option value={invalidListino}>Seleziona un listino</option>
            {listinoQuery.data.map(element => (
              <option key={element.id} value={element.id}>
                {element.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <ModalListino listinoId={listino} />
      </div>

      {/*Tabella che mostra i prodotti del listino selezionato*/}
      <Table bordered hover hidden={listino == -1} responsive className='bg-white'>
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
          <ProdSubmitRow listino={listino} insertProdotto={prodottoInsert.mutate} />
        </tbody>
      </Table>
      <ErrorMessage message={errorMsg} />
    </div >
  )
}

