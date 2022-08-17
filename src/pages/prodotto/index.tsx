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
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [inputTextValues, setInputTextValues] = useState({ nome: '', prezzo: '' })
  const [fornitore, setFornitore] = useState(0)
  // trpc
  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore }])
  const fornitoreTrpc = trpc.useQuery(['fornitore.list'])
  const querySaveProdotto = trpc.useMutation(['prodotto.upsert'])
  const queryDeleteProdotto = trpc.useMutation(['prodotto.delete'])


  // sendSaveRequest: manda richiesta di aggiungere un nuovo prodotto o di modificarlo (upsert)
  const sendSaveRequest = async () => {
    if (querySaveProdotto.isLoading) return
    querySaveProdotto.mutate({
      id: null,
      nome: inputTextValues.nome,
      prezzo: Number(inputTextValues.prezzo),
      fornitore: fornitore,
    })
    setInputTextValues({ nome: '', prezzo: '' })
    if (querySaveProdotto.isError) {
      setErrorMsg('Errore nel salvare un nuovo prodotto: ' + querySaveProdotto.error)
    }
  }

  // sendSaveRequest: manda richiesta di eliminare prodotto specificato con il suo id
  const sendDeleteRequest = async (idProdotto: number) => {
    if (queryDeleteProdotto.isLoading) return
    queryDeleteProdotto.mutate({ id: idProdotto })
    if (querySaveProdotto.isError) {
      setErrorMsg('Errore nell eliminare il prodotto selezionato: ' + querySaveProdotto.error)
    }
  }

  //refetch della lista dei fornitori o prodotti ogni qwualvolta che 
  // querySaveProdotto o queryDeleteProdotto va a buon fine 
  useEffect(() => {
    if (querySaveProdotto.isSuccess || queryDeleteProdotto.isSuccess) {
      prodTrpc.refetch()
    }
  }, [querySaveProdotto.isSuccess, queryDeleteProdotto.isSuccess, prodTrpc])

  //ritorno uns pagina con un messaggio di caricamento se le fetch non hanno ancora aggiornato le liste
  if (!prodTrpc.isSuccess || !fornitoreTrpc.isSuccess) {
    return (
      <div>Not ready</div>
    )
  }

  //ritorno la pagina con i dati dei prodotti e dei fornitori
  return (
    <div className="container">
      <Head>
        <title>Prodotti</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Prodotti</h1>
        {/* form dropdown per selezionare il fornitore */}
        <Form.Group>
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
        {/*Tabella che mostra i prodotti del fornitore selezionato*/}
        <Table striped bordered hover hidden={fornitore == 0}>
          <thead>
            <tr>
              <th>Id prodotto</th>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
            </tr>
          </thead>
          <tbody>
            {prodTrpc.data.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nome}</td>
                <td>{prod.prezzo.toString()}</td>
                <td>
                  {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                    edit: modifica il prodotto della riga  (TODO)
                    delete: elimina il prodotto della riga
                  */}
                  <ButtonGroup >
                    <Button name='EditButton'
                      variant="outline-warning"
                      disabled={querySaveProdotto.isLoading}
                      onClick={() => sendSaveRequest()}
                    >
                      Edit
                      {(!querySaveProdotto.isLoading) && <FcSupport />}
                      {(querySaveProdotto.isLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>
                    <Button name="DeleteButton"
                      variant="outline-danger"
                      disabled={queryDeleteProdotto.isLoading}
                      onClick={() => sendDeleteRequest(prod.id)}
                    >
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
              <td>
                <Form.Control name='InputTextNomeProdotto'
                  value={inputTextValues.nome}
                  onChange={(event) => {
                    setInputTextValues({
                      ...inputTextValues,
                      nome: event.target.value,
                    })
                  }}
                  placeholder="New nome prodotto"
                />
              </td>
              <td>
                <Form.Control name='InputTextPrezzoProdotto'
                  value={inputTextValues.prezzo}
                  onChange={
                    (event) => setInputTextValues({
                      ...inputTextValues,
                      prezzo: event.target.value
                    })}
                  placeholder="New prezzo prodotto"
                />
              </td>
              <td>
                {/*Gruppo di bottoni "save" e "clean" per ogni riga prodotto
                    save: salva un nuovo prodotto
                    clean: pulisce gli input text
                  */}
                <ButtonGroup>
                  <Button name="SaveButton"
                    variant="outline-success"
                    disabled={querySaveProdotto.isLoading}
                    onClick={() => sendSaveRequest()}
                  >
                    Save
                    {!querySaveProdotto.isLoading && <FcCheckmark />}
                    {querySaveProdotto.isLoading && <Spinner as="span" animation="border" size="sm" role="status" />}
                  </Button>
                  <Button name="CleanButton"
                    variant="outline-primary"
                    onClick={() => setInputTextValues({ nome: '', prezzo: '' })}
                  >
                    Clean
                    <FcDeleteRow />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </Table>

        {/* alert per mostrare i messaggi di errore */}
        <Alert variant='danger' hidden={errorMsg.length === 0}>
          {errorMsg}
        </Alert>
        {/* <div> Test:  {newProdotto.nome}, {newProdotto.prezzo}, {newProdotto.fornitore}</div> */}
      </main>
    </div >
  )
}

