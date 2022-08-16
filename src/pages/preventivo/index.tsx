import Head from 'next/head'
import { trpc } from 'utils/trpc'
import styles from '../../../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Form, InputGroup } from 'react-bootstrap';
import { FcDeleteRow, FcCheckmark, FcCancel, FcSupport } from "react-icons/fc";
import Alert from 'react-bootstrap/Alert';
import { MdPictureAsPdf } from "react-icons/md";
import Row from 'react-bootstrap/Row';


export default function Preventivo() {

  const [errorMsg, setErrorMsg] = useState('')
  const [isSendingDelete, setIsSendingDelete] = useState(false)
  const [isSendingEdit, setIsSendingEdit] = useState(false)
  const [isSendingSave, setIsSendingSave] = useState(false)
  const [newPDF, setNewPDF] = useState({ id: -1, nome: '', prezzo: -1, fornitore: -1 }); //prevType ATT brutto da modificare
  const [newPreventivo, setNewPreventivo] = useState({
    id: -1,
    nome: '',
    dataCreazione: Date.now(),
    nomeScuola: '',
    nomeFornitore: '',
    ultimaModifica: Date.now(),
    nomeUtenteUltimaModifica: ''
  }); //prevType ATT brutto da modificare
  const [inputTextValues, setInputTextValues] = useState({
    inputTextId: '',
    inputTextNome: '',
    inputTextNomeScuola: '',
    inputTextNomeFornitore: '',
    inputTextNomeUtenteUltimaModifica: ''
  })
  // const preventivoTrpc = trpc.useQuery(['preventivo.list'])
  // const querySavePreventivo = trpc.useMutation(['preventivo.upsert'])
  // const queryDeletePreventivo = trpc.useMutation(['preventivo.delete',])


  const sendSaveRequest = useCallback(() => {
    console.log('sendSaveRequest ' + newPreventivo)

    // //don't send again while we are sending
    // if (isSendingSave) return
    // // update state
    // setIsSendingSave(true)
    // //send the actual request
    // const resultQuery = querySavePreventivo.mutate(newPreventivo)
    // //querySavePreventivo dovrebbe ritornare il preventivo aggiornato
    // if (resultQuery === undefined) {
    //   setErrorMsg('Non è stato possibile salvare il preventivo inserito')
    // }
    // //once the request is sent, update state again
    // setIsSendingSave(false)
  }, [newPreventivo])// update the callback if the state changes

  const sendEditRequest = useCallback(() => {
    console.log('sendEditRequest ' + newPreventivo)
    // if (isSendingEdit) return
    // setIsSendingEdit(true)
    // const resultQuery = querySavePreventivo.mutate(newPreventivo)
    // //querySavePreventivo dovrebbe ritornare il preventivo aggiornato
    // // if (resultQuery === undefined) { //condizione di qualcosa
    // //   setErrorMsg('Non è stato possibile modificare il preventivo inserito')
    // // }
    // setIsSendingEdit(false)
  }, [newPreventivo])

  const sendDeleteRequest = useCallback((idDeletePreventivo: number) => {
    console.log('sendDeleteRequest ' + idDeletePreventivo)
    // if (isSendingDelete) return
    // setIsSendingDelete(true)
    // const resultQuery = queryDeletePreventivo.mutate({ id: idDeletePreventivo })
    // //querySavePreventivo dovrebbe ritornare il preventivo aggiornato
    // // if (resultQuery === undefined) {
    // //   setErrorMsg('Non è stato possibile eliminare il preventivo selezionato')
    // // }
    // setIsSendingDelete(false)
  }, [])

useEffect(() => { 
  setNewPreventivo(
    {
      id: Number(inputTextValues.inputTextId),
      nome: inputTextValues.inputTextNome,
      dataCreazione: Date.now(),
      nomeScuola: inputTextValues.inputTextNomeScuola,
      nomeFornitore: inputTextValues.inputTextNomeFornitore,
      ultimaModifica: Date.now(),
      nomeUtenteUltimaModifica: inputTextValues.inputTextNomeUtenteUltimaModifica
    }

  )
  }, [inputTextValues])


  const makePDF = useCallback(() => { //funzione che crea il pdf
    console.log('makePDF ' + newPDF)
  }, [newPDF])


  // if (!preventivoTrpc.isSuccess) return (
  //   <div>Not ready</div>
  // )

  return (
    <div className="container">
      <Head>
        <title>Preventivi</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Preventivi</h1>

        {/*Table which shows all preventivi*/}
        <Table striped bordered hover>
          <thead>
            <tr >
              <th>Id preventivo</th>
              <th>Nome preventivo</th>
              <th>Data creazione</th>
              <th>Nome scuola</th>
              <th>Nome fornitore</th>
              <th>Data ultima modifica</th>
              <th>Utente ultima modifica</th>
            </tr>
          </thead>
          <tbody>
            {/* {preventivoTrpc.data.map(preventivo => (
              <tr key={preventivo.id}>
                <td>{preventivo.id} </td>
                <td>{preventivo.nome}</td>
                <td> {preventivo.dataCreazione}</td>
                <td> {preventivo.nomeScuola}</td>
                <td> {preventivo.nomeFornitore}</td>
                <td> {preventivo.ultimaModifica}</td>
                <td> {preventivo.nomeUtenteUltimaModifica}</td>
                <td>
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="outline-warning" >Edit <FcSupport /></Button>
                    <Button variant="outline-danger" name="deleteButton" disabled={isSendingDelete} onClick={() => sendDeleteRequest(preventivo.id)}>Delete <FcCancel /></Button>
                    <Button variant="outline-dark" name="saveButton" onClick={makePDF}>PDF <MdPictureAsPdf /></Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))} */}
            <tr >
              <td>preventivo.id </td>
              <td>preventivo.nome</td>
              <td> preventivo.dataCreazione</td>
              <td> preventivo.nomeScuola</td>
              <td> preventivo.nomeFornitore</td>
              <td> preventivo.ultimaModifica</td>
              <td> preventivo.nomeUtenteUltimaModifica</td>
              <td>
                <ButtonGroup aria-label="Basic example">
                  <Button variant="outline-warning" >Edit <FcSupport /></Button>
                  <Button variant="outline-danger" name="deleteButton" disabled={isSendingDelete} onClick={() => sendDeleteRequest(-1)}>Delete <FcCancel /></Button>
                  <Button variant="outline-dark" name="saveButton" onClick={makePDF}>PDF <MdPictureAsPdf /></Button>
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </Table>
        <Card >
          <Card.Body>
            <Card.Title>Insert new preventivo</Card.Title>
            <Form>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm="2">
                  New id preventivo
                </Form.Label>
                <Col sm="10">
                  <Form.Control id="disabledTextInput"
                    value={inputTextValues.inputTextId}
                    onChange={
                      (event) => {
                        setInputTextValues(
                          {
                            ...inputTextValues,
                            inputTextId: (event.target as HTMLInputElement).value,
                          }
                        )
                      }
                    }
                    placeholder="New id preventivo"
                    aria-label="New id preventivo"
                    aria-describedby="basic-addon1"
                  />
                </Col>
                <Form.Label column sm="2">
                  New nome preventivo
                </Form.Label>
                <Col sm="10">
                <Form.Control id="disabledTextInput"
                value={inputTextValues.inputTextNome}
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
                  placeholder="New nome preventivo"
                  aria-label="New nome preventivo"
                  aria-describedby="basic-addon1"
                />
                </Col>
              
              <Form.Label column sm="2">
                  New nome scuola preventivo
                </Form.Label>
                <Col sm="10">
              <Form.Select id="disabledTextInput"
              value={inputTextValues.inputTextNomeScuola}
                onChange={
                  (event) => {
                    setInputTextValues(
                      {
                        ...inputTextValues,
                        inputTextNomeScuola: event.target.value,
                      }
                    )
                  }}
                placeholder="New nome scuola preventivo"
                aria-label="New nome scuola preventivo"
                aria-describedby="basic-addon1"
              >
              <option>New nome scuola preventivo</option>
              <option>New nome scuola preventivo2</option>
              <option>New nome scuola preventivo3</option>
                </Form.Select>
              </Col>
              </Form.Group>
              <Button variant="outline-success" name="saveButton" onClick={sendSaveRequest}>Save <FcCheckmark /></Button>
              <Button variant="outline-primary" name="cleanButton"
                onClick={() => {
                
                setInputTextValues({ inputTextId: '', inputTextNome: '', inputTextNomeFornitore: '', inputTextNomeScuola: '', inputTextNomeUtenteUltimaModifica: '' })
              }}>
              
                Clean <FcDeleteRow /></Button>
            </Form>
          </Card.Body>
        </Card>


        <Alert variant='danger' hidden={errorMsg.length === 0}>
          {errorMsg}
        </Alert>
        <div> Test: {newPreventivo.id}, {newPreventivo.nome},  {newPreventivo.nomeScuola}  </div>
      </main>
    </div >
  )
}

