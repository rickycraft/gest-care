import Head from 'next/head'
import { trpc } from 'utils/trpc'
import styles from '../../../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { ButtonGroup, Form, Spinner } from 'react-bootstrap';
import type { prodType } from '../../server/routers/prodotto'
import { FcDeleteRow, FcCheckmark, FcCancel, FcSupport } from "react-icons/fc";
import Alert from 'react-bootstrap/Alert';


export default function Prodotto() {

  const [errorMsg, setErrorMsg] = useState('')
  const [isSendingDelete, setIsSendingDelete] = useState(false)
  const [isSendingEdit, setIsSendingEdit] = useState(false)
  const [isSendingSave, setIsSendingSave] = useState(false)
  const [newProdotto, setNewProdotto] = useState<prodType>({ id: null, nome: '', prezzo: -1, fornitore: -1 }); //ATT brutto da modificare
  const [inputTextValues, setInputTextValues] = useState({ inputTextNome: '', inputTextPrezzo: '' })
  const [fornitore, setFornitore] = useState({ id: -1, isSelected: false }); //ATT brutto ma da modificare { id: -1, isSelected: false }
  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore: Number(fornitore?.id) }])
  const fornitoreTrpc = trpc.useQuery(['fornitore.list'])
  const querySaveProdotto = trpc.useMutation(['prodotto.upsert'])
  const queryDeleteProdotto = trpc.useMutation(['prodotto.delete'])


  const sendSaveRequest = async () => {
    //don't send again while we are sending
    if (isSendingSave) return
    // update state
    setIsSendingSave(true)
    //send the actual request
    querySaveProdotto.mutate(newProdotto)
    console.log('is loading ' + querySaveProdotto.isLoading)
    console.log('is success ' + querySaveProdotto.isSuccess)

    if (!querySaveProdotto.isSuccess) {
      if (querySaveProdotto.isError) {
        console.log(querySaveProdotto.error)
        setErrorMsg('Non è stato possibile salvare il prodotto inserito')
      }
    }
    setInputTextValues({ inputTextNome: '', inputTextPrezzo: '' })
    //once the request is sent, update state again
    setIsSendingSave(false)
  }

  const sendEditRequest = async () => {
    if (isSendingEdit) return
    setIsSendingEdit(true)
    console.log('edit')
    return
    querySaveProdotto.mutate({ ...newProdotto, id: Number(newProdotto.id) })
    if (!querySaveProdotto.isSuccess) {
      if (querySaveProdotto.isError) {
        console.log(querySaveProdotto.error)
        setErrorMsg('Non è stato possibile modificare il prodotto specificato')
      }
    }
    setIsSendingEdit(false)
  }

  const sendDeleteRequest = async (idDeleteProdotto: number) => {
    if (isSendingDelete) return
    setIsSendingDelete(true)
    // console.log(idDeleteProdotto)
    const resultQuery = queryDeleteProdotto.mutate({ id: idDeleteProdotto })
    console.log(resultQuery)
    if (!queryDeleteProdotto.isSuccess) {
      if (queryDeleteProdotto.isError) {
        console.log(queryDeleteProdotto.error)
        setErrorMsg('Non è stato possibile salvare il prodotto inserito')
      }
    }
    setIsSendingDelete(false)
  }

  useEffect(() => {
    setNewProdotto(
      {
        id: newProdotto.id,
        nome: inputTextValues.inputTextNome,
        prezzo: Number(inputTextValues.inputTextPrezzo),
        fornitore: fornitore.id
      }
    )

  }, [fornitore.id, inputTextValues, newProdotto.id])


  if (!prodTrpc.isSuccess || !fornitoreTrpc.isSuccess)
    return (
      <div>Not ready</div>
    )

  return (
    <div className="container">
      <Head>
        <title>Prodotti</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Prodotti</h1>
        <Form.Group >
        <Form.Select id="disabledTextInput"
          placeholder="Seleziona un fornitore"
          aria-label="Seleziona un fornitore"
          aria-describedby="basic-addon1"
          value={fornitore.id}
          onChange={(event) => {
            console.log(event.currentTarget.value)
            if(event.currentTarget.value){ //check se non è stato selezionato il primo option
            setNewProdotto(
              {
                ...newProdotto,
                fornitore: Number(event.currentTarget.value)
              }
            )
            setFornitore({ id: Number(event.currentTarget.value), isSelected: true })
            }
            else{
              setFornitore({ id:-1, isSelected: false })
              setInputTextValues({ inputTextNome: '', inputTextPrezzo: '' })
            }
          }}
        >
          <option value=''>Seleziona un fornitore</option>
          {fornitoreTrpc.data?.map(element => (
            <option key={element.id} value={element.id}>{element.nome}</option>
          ))}
        </Form.Select>
        </Form.Group>
        {/*Table which shows all products by fornitore*/}
        <Table striped bordered hover>
          <thead>
            <tr hidden={!fornitore.isSelected}>
              <th>Id prodotto</th>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
            </tr>
          </thead>
          <tbody>
            {prodTrpc.data.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id} </td>
                <td>{prod.nome}</td>
                <td> {prod.prezzo}</td>
                <td>
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="outline-warning"
                      disabled={querySaveProdotto.isLoading}
                      onClick={() => sendEditRequest()}
                    >
                      Edit
                      {(!querySaveProdotto.isLoading) && <FcSupport />}
                      {(querySaveProdotto.isLoading) &&
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />}
                    </Button>
                    <Button variant="outline-danger" name="deleteButton"
                      disabled={queryDeleteProdotto.isLoading}
                      onClick={() => sendDeleteRequest(prod.id)}>
                      Delete
                      {(!queryDeleteProdotto.isLoading) && <FcCancel />}
                      {(queryDeleteProdotto.isLoading) &&
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />}
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
            <tr hidden={!fornitore.isSelected}>
              <td>
              </td>
              <td>
                <Form.Control value={inputTextValues.inputTextNome}
                  onChange={
                    (event) => {
                      setInputTextValues(
                        {
                          ...inputTextValues,
                          inputTextNome: event.target.value,
                        }
                      )
                    }
                  }
                  placeholder="New nome prodotto"
                  aria-label="New nome prodotto"
                  aria-describedby="basic-addon1"
                />
              </td>
              <td>
                <Form.Control value={inputTextValues.inputTextPrezzo}
                  onChange={
                    (event) => setInputTextValues(
                      {
                        ...inputTextValues,
                        inputTextPrezzo: String(event.target.value)
                      }
                    )}
                  placeholder="New prezzo prodotto"
                  aria-label="New prezzo prodotto"
                  aria-describedby="basic-addon1"
                />
              </td>
              <td hidden={!fornitore.isSelected}>
                <ButtonGroup aria-label="Basic example">
                  <Button variant="outline-success" name="saveButton"
                    disabled={querySaveProdotto.isLoading}
                    onClick={sendSaveRequest}>
                    Save
                    {(!querySaveProdotto.isLoading) && <FcCheckmark />}
                    {(querySaveProdotto.isLoading) && <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />}

                  </Button>
                  <Button variant="outline-primary" name="cleanButton"
                    onClick={() => setInputTextValues({ inputTextNome: '', inputTextPrezzo: '' })}>
                    Clean <FcDeleteRow /></Button>
                </ButtonGroup>
              </td>
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

