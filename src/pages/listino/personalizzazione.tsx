import { trpc } from 'utils/trpc'
import Table from 'react-bootstrap/Table'
import { useState } from 'react'
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
  const persInsert = trpc.useMutation('pers.insert', {
    onSuccess() { persQuery.refetch() },
    onError() { setErrorMsg('Errore nell inserire la personalizzazione selezionato') }
  })
  const persUpdate = trpc.useMutation('pers.update', {
    onSuccess() { persQuery.refetch() },
    onError() { setErrorMsg('Errore nel aggiornare una personalizzazione') }
  })
  const persDelete = trpc.useMutation('pers.delete', {
    onSuccess() { persQuery.refetch() },
    onError() { setErrorMsg('Errore nell eliminare la personalizzazione selezionata') }
  })

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
      {/*Tabella che mostra i persotti del listino selezionato*/}
      <Table bordered hover hidden={listino == -1} responsive className='bg-white'>
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
          <PersSubmitRow listino={listino} insertPers={persInsert.mutate} />
        </tbody>
      </Table>
      <ErrorMessage message={errorMsg} />
    </div >
  )
}
