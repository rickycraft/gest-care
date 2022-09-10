import InsertRow from 'components/listino/InsertRow'
import ModalListino from 'components/listino/ModalListino'
import TableRow from 'components/listino/TableRow'
import ErrorMessage from 'components/utils/ErrorMessage'
import { useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function Pers() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [listino, setListino] = useState(INVALID_ID)

  // trpc
  const trpcCallback = {
    onSuccess() { persQuery.refetch() },
    onError() { setErrorMsg('Errore nella modifica della personalizzazione') }
  }
  const listinoQuery = trpc.useQuery(['listino.list'])
  const persQuery = trpc.useQuery(['pers.list', { listino }])
  const persInsert = trpc.useMutation('pers.insert', trpcCallback)
  const persUpdate = trpc.useMutation('pers.update', trpcCallback)
  const persDelete = trpc.useMutation('pers.delete', trpcCallback)

  const updatePers = (idPers: number, prezzo: number) => {
    if (persUpdate.isLoading) return
    persUpdate.mutate({
      id: idPers,
      prezzo: prezzo,
    })
  }
  const deletePers = (idPers: number) => {
    if (persDelete.isLoading) return
    persDelete.mutate({ id: idPers })
  }

  if (!persQuery.isSuccess || !listinoQuery.isSuccess) return <Spinner animation="border" variant="primary" />

  return (
    <div className="container">
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
      {/*Tabella che mostra i persotti del listino selezionato*/}
      <Table bordered hover hidden={listino == INVALID_ID} responsive className='bg-white'>
        <thead>
          <tr>
            <th>Nome Personalizzazione</th>
            <th style={{ minWidth: "6rem" }}>Prezzo</th>
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
          <InsertRow listino={listino} addRow={persInsert.mutate} />
        </tbody>
      </Table>
      <ErrorMessage message={errorMsg} />
    </div >
  )
}
