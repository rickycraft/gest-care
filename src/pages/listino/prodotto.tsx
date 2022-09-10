import InsertRow from 'components/listino/InsertRow'
import ModalListino from 'components/listino/ModalListino'
import TableRow from 'components/listino/TableRow'
import ErrorMessage from 'components/utils/ErrorMessage'
import { useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listinoId, setListinoId] = useState(INVALID_ID)

  // trpc
  const trpcCallback = {
    onSuccess() { prodQuery.refetch() },
    onError() { setErrorMsg('Errore nella modifica del prodotto') }
  }
  const prodQuery = trpc.useQuery(['prodotto.list', { listino: listinoId }])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const prodottoInsert = trpc.useMutation('prodotto.insert', trpcCallback)
  const prodottoUpdate = trpc.useMutation('prodotto.update', trpcCallback)
  const prodottoDelete = trpc.useMutation('prodotto.delete', trpcCallback)

  const listino = useMemo(() => listinoQuery.data?.find(el => el.id == listinoId), [listinoQuery.data, listinoId])
  const updateIdListino = (id: number) => setListinoId(id)

  return (
    <div className="container">
      {/* form dropdown per selezionare il listino */}
      <div className='d-flex mb-2'>
        <Form.Group className='me-2'>
          <Form.Select value={listinoId} onChange={(event) => { setListinoId(Number(event.currentTarget.value)) }}>
            <option value={INVALID_ID}>Seleziona un listino</option>
            {listinoQuery.data?.map(element => (
              <option key={element.id} value={element.id}>
                {element.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <ModalListino listino={listino} updateIdListino={updateIdListino} />
      </div>

      {/*Tabella che mostra i prodotti del listino selezionato*/}
      <Table bordered hover hidden={listinoId == INVALID_ID} responsive className='bg-white'>
        <thead>
          <tr>
            <th>Nome prodotto</th>
            <th style={{ minWidth: "6rem" }}>Prezzo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prodQuery.data?.map(prod => (
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
          <InsertRow listino={listinoId} addRow={prodottoInsert.mutate} />
        </tbody>
      </Table>
      <ErrorMessage message={errorMsg} />
    </div >
  )
}

