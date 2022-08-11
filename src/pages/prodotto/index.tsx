import Head from 'next/head'
import { trpc } from 'utils/trpc'
import styles from '../../../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import { useCallback, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import type { prodType } from '../../server/routers/prodotto'
import { FcDeleteRow, FcCheckmark, FcCancel, FcSupport } from "react-icons/fc";
import Alert from 'react-bootstrap/Alert';


export default function Prodotto() {

  const [errorMsg, setErrorMsg] = useState('')
  const [isSendingDelete, setIsSendingDelete] = useState(false)
  const [isSendingEdit, setIsSendingEdit] = useState(false)
  const [isSendingSave, setIsSendingSave] = useState(false)
  const [newProdotto, setNewProdotto] = useState<prodType>({ id: -1, nome: '', prezzo: -1, fornitore: -1 }); //ATT brutto da modificare
  const [inputTextValues, setInputTextValues] = useState({ inputTextId: '', inputTextNome: '', inputTextPrezzo: '' })
  const [fornitore, setFornitore] = useState({ id: -1,  isSelected:false}); //ATT brutto ma da modificare { id: -1, isSelected: false }
  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore: Number(fornitore?.id) }]) 
  const fornitoreTrpc = trpc.useQuery(['fornitore.list'])
  const querySaveProdotto = trpc.useMutation(['prodotto.upsert'])
  const queryDeleteProdotto = trpc.useMutation(['prodotto.delete',])


  const sendSaveRequest = useCallback( () =>  {
    //don't send again while we are sending
    if (isSendingSave) return
    // update state
    setIsSendingSave(true)
    //send the actual request
    const resultQuery = querySaveProdotto.mutate(newProdotto)
    //querySaveProdotto dovrebbe ritornare il prodotto aggiornato
    if (resultQuery === undefined) {
      setErrorMsg('Non è stato possibile salvare il prodotto inserito')
    }
    //once the request is sent, update state again
    setIsSendingSave(false)
  }, [isSendingSave, newProdotto, querySaveProdotto])// update the callback if the state changes

  function sendEditRequest () {
    if (isSendingEdit) return
    setIsSendingEdit(true)
    const resultQuery = querySaveProdotto.mutate(newProdotto)
    //querySaveProdotto dovrebbe ritornare il prodotto aggiornato
    // if (resultQuery === undefined) { //condizione di qualcosa
    //   setErrorMsg('Non è stato possibile modificare il prodotto inserito')
    // }
    setIsSendingEdit(false)
  }

  function sendDeleteRequest(idDeleteProdotto: number) {
    if (isSendingDelete) return
    setIsSendingDelete(true)
    const resultQuery  = queryDeleteProdotto.mutate({id: idDeleteProdotto})
    //querySaveProdotto dovrebbe ritornare il prodotto aggiornato
    // if (resultQuery === undefined) {
    //   setErrorMsg('Non è stato possibile eliminare il prodotto selezionato')
    // }
    setIsSendingDelete(false)
  } 

  if (!prodTrpc.isSuccess) return (
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
        <Navbar bg="light" style={{ maxHeight: '100px' }} >
          <Navbar.Collapse id="navbarScroll" >
            <Nav className="me-auto"
              activeKey={fornitore.id}
              onSelect={(selectedKey) => {
                setNewProdotto(
                  {
                    id: newProdotto.id,
                    nome: newProdotto.nome,
                    prezzo: newProdotto.prezzo,
                    fornitore: Number(selectedKey)
                  }
                )
                setFornitore({ id: Number(selectedKey), isSelected: true })
              }}>
              <NavDropdown title="Scegli fornitore" id="navbarScrollingDropdown">
                {fornitoreTrpc.data?.map(fornitore => (
                  <NavDropdown.Item key={fornitore.id} eventKey={fornitore.id}>{fornitore.nome}</NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

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
                <td><Button variant="outline-warning" name="saveButton" disabled={isSendingEdit} onClick={sendEditRequest}>Edit <FcSupport /></Button></td>
                <td><Button variant="outline-danger" name="deleteButton" disabled={isSendingDelete} onClick={() => sendDeleteRequest(prod.id) }>Delete <FcCancel /></Button></td>
              </tr>
            ))}
            <tr hidden={!fornitore.isSelected}>
              <td>
                <InputGroup className="mb-3"
                  onChange={
                    (event) => setNewProdotto(
                      {
                        id: Number((event.target as HTMLInputElement).value),
                        nome: newProdotto.nome,
                        prezzo: newProdotto.prezzo,
                        fornitore: newProdotto.fornitore
                      }
                    )}
                >
                  <InputGroup.Text id="newIdProdottoInputText">
                  </InputGroup.Text>
                  <Form.Control value={inputTextValues.inputTextId}
                    onChange={
                      (event) => {
                        setInputTextValues(
                          {
                            inputTextId: event.target.value,
                            inputTextNome: inputTextValues.inputTextNome,
                            inputTextPrezzo: inputTextValues.inputTextPrezzo
                          }
                        )
                      }
                    }
                    placeholder="New id prodotto"
                    aria-label="New id prodotto"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </td>
              <td>
                <InputGroup className="mb-3"
                  onChange={
                    (event) => setNewProdotto(
                      {
                        id: newProdotto.id,
                        nome: (event.target as HTMLInputElement).value,
                        prezzo: newProdotto.prezzo,
                        fornitore: newProdotto.fornitore
                      }
                    )}

                >
                  <InputGroup.Text id="newnomeProdottoInputText">
                  </InputGroup.Text>
                  <Form.Control value={inputTextValues.inputTextNome}
                    onChange={
                      (event) => {
                        setInputTextValues(
                          {
                            inputTextId: inputTextValues.inputTextId,
                            inputTextNome: event.target.value,
                            inputTextPrezzo: inputTextValues.inputTextPrezzo
                          }
                        )
                      }
                    }
                    placeholder="New nome prodotto"
                    aria-label="New nome prodotto"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </td>
              <td>
                <InputGroup className="mb-3"
                  onChange={
                    (event) => {
                      setNewProdotto(
                        {
                          id: newProdotto.id,
                          nome: newProdotto.nome,
                          prezzo: Number((event.target as HTMLInputElement).value),
                          fornitore: newProdotto.fornitore
                        }
                      )
                    }}
                >
                  <InputGroup.Text id="newPrezzoProdottoInputText" ></InputGroup.Text>
                  <Form.Control value={inputTextValues.inputTextPrezzo}
                    onChange={
                      (event) => setInputTextValues(
                        {
                          inputTextId: inputTextValues.inputTextId,
                          inputTextNome: inputTextValues.inputTextNome,
                          inputTextPrezzo: String(event.target.value)
                        }
                      )}
                    placeholder="New prezzo prodotto"
                    aria-label="New prezzo prodotto"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </td>
            </tr>
            <tr hidden={!fornitore.isSelected}>
              <td><Button variant="outline-success" name="saveButton" onClick={sendSaveRequest}>Save <FcCheckmark /></Button></td>
              <td><Button variant="outline-primary" name="cleanButton" onClick={() => setInputTextValues({ inputTextId: '', inputTextNome: '', inputTextPrezzo: '' })}>Clean <FcDeleteRow /></Button></td>
            </tr>
          </tbody>

        </Table>
        <Alert  variant='danger' hidden={errorMsg.length === 0}>
        {errorMsg}
        </Alert>
        <div> Test: {newProdotto.id}, {newProdotto.nome}, {newProdotto.prezzo}, {newProdotto.fornitore}</div>
      </main>
    </div >
  )
}

