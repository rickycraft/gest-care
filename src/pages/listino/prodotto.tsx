import InsertRow from 'components/listino/InsertRow'
import ModalListino from 'components/listino/ModalListino'
import TableRow from 'components/listino/TableRow'
import ErrorMessage from 'components/utils/ErrorMessage'
import { useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listino, setListino] = useState(INVALID_ID)

  // trpc
  const trpcCallback = {
    onSuccess() { prodQuery.refetch() },
    onError() { setErrorMsg('Errore nella modifica del prodotto') }
  }
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const prodottoInsert = trpc.useMutation('prodotto.insert', trpcCallback)
  const prodottoUpdate = trpc.useMutation('prodotto.update', trpcCallback)
  const prodottoDelete = trpc.useMutation('prodotto.delete', trpcCallback)

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess) return <Spinner animation="border" variant="primary" />

  return (
    <div className="container">
      {/* form dropdown per selezionare il listino */}
      <div className='d-flex mb-2'>
        <Form.Group className='me-2'>
          <Form.Select value={listino} onChange={(event) => { setListino(Number(event.currentTarget.value)) }}>
            <option value={INVALID_ID}>Seleziona un listino</option>
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
      <Table bordered hover hidden={listino == INVALID_ID} responsive className='bg-white'>
        <thead>
          <tr>
            <th>Nome prodotto</th>
            <th style={{ minWidth: "6rem" }}>Prezzo</th>
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
              onClickDelete={prodottoDelete.mutate}
              onClickEdit={prodottoUpdate.mutate}
            />
          ))}
          {/* riga per inserire un nuovo prodotto */}
          <InsertRow listino={listino} addRow={prodottoInsert.mutate} />
        </tbody>
      </Table>
      <ErrorMessage message={errorMsg} />
    </div >
  )
}

