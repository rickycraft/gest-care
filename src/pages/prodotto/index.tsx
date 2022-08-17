import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark, FcCancel, FcSupport } from "react-icons/fc"
import Alert from 'react-bootstrap/Alert'


export default function Prodotto() {

  const [errorMsg, setErrorMsg] = useState('')

  const [isSendingEdit, setIsSendingEdit] = useState(false)
  const [inputTextValues, setInputTextValues] = useState({ nome: '', prezzo: '' })
  const [fornitore, setFornitore] = useState(0)
  // trpc
  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore }])
  const fornitoreTrpc = trpc.useQuery(['fornitore.list'])
  const querySaveProdotto = trpc.useMutation(['prodotto.upsert'])
  const queryDeleteProdotto = trpc.useMutation(['prodotto.delete'])


  const sendSaveRequest = async () => {
    if (querySaveProdotto.isLoading) return
    querySaveProdotto.mutate({
      id: null,
      nome: inputTextValues.nome,
      prezzo: Number(inputTextValues.prezzo),
      fornitore: fornitore,
    })
    setInputTextValues({ nome: '', prezzo: '' })
  }

  const sendEditRequest = async () => {
    if (isSendingEdit) return
    setIsSendingEdit(true)
    console.log('edit')
    return
    /*
    querySaveProdotto.mutate({ ...newProdotto, id: Number(newProdotto.id) })
    if (!querySaveProdotto.isSuccess) {
      if (querySaveProdotto.isError) {
        console.log(querySaveProdotto.error)
        setErrorMsg('Non è stato possibile modificare il prodotto specificato')
      }
    }
    */
    setIsSendingEdit(false)
  }

  const sendDeleteRequest = async (idProdotto: number) => {
    if (queryDeleteProdotto.isLoading) return
    queryDeleteProdotto.mutate({ id: idProdotto })
  }

  useEffect(() => {
    if (querySaveProdotto.isSuccess || queryDeleteProdotto.isSuccess) {
      prodTrpc.refetch()
    }
  }, [querySaveProdotto.isLoading, queryDeleteProdotto.isLoading])

  if (!prodTrpc.isSuccess || !fornitoreTrpc.isSuccess) {
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
        <h1>Prodotti</h1>
        <p className="lead">Seleziona un fornitore e visualizza i prodotti</p>
        {/* Selezionare il fornitore */}
        <Form.Group className="mb-4" >
          <Form.Select
            value={fornitore}
            onChange={(event) => { setFornitore(Number(event.currentTarget.value)) }}
          >
            <option value='0'>Seleziona un fornitore</option>
            {fornitoreTrpc.data.map(element => (
              <option key={element.id} value={element.id}>{element.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*Table which shows all products by fornitore*/}
        <Table   striped hover hidden={fornitore == 0}  >
          <thead>
            <tr>
              <th>Id prodotto</th>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prodTrpc.data.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nome}</td>
                <td>{prod.prezzo.toString()}</td>
                <td>
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="outline-warning"
                      disabled={querySaveProdotto.isLoading}
                      onClick={() => sendEditRequest()}
                    >
                      Edit
                      {(!querySaveProdotto.isLoading) && <FcSupport />}
                      {(querySaveProdotto.isLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>
                    <Button variant="outline-danger" name="deleteButton"
                      disabled={queryDeleteProdotto.isLoading}
                      onClick={() => sendDeleteRequest(prod.id)}>
                      Delete
                      {(!queryDeleteProdotto.isLoading) && <FcCancel />}
                      {(queryDeleteProdotto.isLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td><Form.Control value={inputTextValues.nome}
                onChange={(event) => {
                  setInputTextValues({
                    ...inputTextValues,
                    nome: event.target.value,
                  })
                }}
                placeholder="New nome prodotto"
              /></td>
              <td><Form.Control value={inputTextValues.prezzo}
                onChange={
                  (event) => setInputTextValues({
                    ...inputTextValues,
                    prezzo: event.target.value
                  })}
                placeholder="New prezzo prodotto"
              /></td>
              <td><ButtonGroup>
                <Button variant="outline-success" name="saveButton"
                  disabled={querySaveProdotto.isLoading}
                  onClick={() => sendSaveRequest()}>
                  Save
                  {!querySaveProdotto.isLoading && <FcCheckmark />}
                  {querySaveProdotto.isLoading && <Spinner as="span" animation="border" size="sm" role="status" />}
                </Button>
                <Button variant="outline-primary" name="cleanButton"
                  onClick={() => setInputTextValues({ nome: '', prezzo: '' })}>
                  Clean<FcDeleteRow /></Button>
              </ButtonGroup></td>
            </tr>
          </tbody>

        </Table>
        <Alert variant='danger' hidden={errorMsg.length === 0}>
          {errorMsg}
        </Alert>
        {/* <div> Test:  {newProdotto.nome}, {newProdotto.prezzo}, {newProdotto.fornitore}</div> */}
      </main>
    </div >
  )
}

