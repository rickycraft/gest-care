import Head from 'next/head'
import React, { useCallback } from 'react'
import { trpc } from 'utils/trpc'
import styles from '../../../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import type { prodType } from '../../server/routers/prodotto'
import { FcDeleteRow, FcCheckmark, FcCancel, FcSupport } from "react-icons/fc";

export default function Prodotto() {
  const [isSendingSave, setIsSendingSave] = useState(false)
  const [isSendingDelete, setIsSendingDelete] = useState(false)
  const [isSendingEdit, setIsSendingEdit] = useState(false)
  const [newProdotto, setNewProdotto] = useState<prodType>({ id: -1, nome: '', prezzo: -1, fornitore: -1 }); //ATT brutto da modificare
  const [inputTextValues, setInputTextValues] = useState({ inputTextNome: '', inputTextPrezzo: '' })

  const sendSaveRequest = useCallback(async () => {
    // don't send again while we are sending
    if (isSendingSave) return
    // update state
    setIsSendingSave(true)
    // send the actual request
    const resultSavedProdotto = trpc.useMutation(['prodotto.upsert',])//ATT newProdotto ???
    // once the request is sent, update state again
    setIsSendingSave(false)
  }, [isSendingSave]) // update the callback if the state changes

  const sendEditRequest = useCallback(async () => {
    if (isSendingEdit) return
    setIsSendingEdit(true)
    const resultSavedProdotto = trpc.useMutation(['prodotto.upsert',])//ATT newProdotto ???
    setIsSendingEdit(false)
  }, [isSendingEdit])

  const sendDeleteRequest = useCallback(async () => {
    if (isSendingDelete) return
    setIsSendingDelete(true)
    const resultDeletedProdotto = trpc.useMutation(['prodotto.delete',])//ATT which one ???
    setIsSendingDelete(false)
  }, [isSendingDelete])



  const [fornitore, setFornitore] = useState(0);
  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore: Number(fornitore) }])
  const fornitoreTrpc = trpc.useQuery(['fornitore.list'])

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
              activeKey={fornitore}
              onSelect={(selectedKey) => setFornitore(Number(selectedKey))}>
              <NavDropdown title="Scegli fornitore" id="navbarScrollingDropdown">
                {fornitoreTrpc.data?.map(fornitore => (
                  <NavDropdown.Item key={fornitore.id} eventKey={fornitore.id}>{fornitore.nome}</NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/*Table which shows all products by fornitore*/}
        {prodTrpc.data.map(prod => (
          // eslint-disable-next-line react/jsx-key
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id prodotto</th>
                <th>Nome prodotto</th>
                <th>Prezzo</th>
              </tr>
            </thead>

            <tbody>
              <tr key={prod.id}>
                <td>{prod.id} </td>
                <td>{prod.nome}</td>
                <td> {prod.prezzo}</td>
                <td><Button variant="outline-warning" name="saveButton" disabled={isSendingEdit} onClick={sendEditRequest}>Edit <FcSupport /></Button></td>
                <td><Button variant="outline-danger" name="deleteButton" disabled={isSendingDelete} onClick={sendDeleteRequest}>Delete <FcCancel /></Button></td>
              </tr>
              <tr>
                <td></td>
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
              <tr>
                <td><Button variant="outline-success" name="saveButton" disabled={isSendingSave} onClick={sendSaveRequest}>Save <FcCheckmark /></Button></td>
                <td><Button variant="outline-primary" name="cleanButton" onClick={() => setInputTextValues({ inputTextNome: '', inputTextPrezzo: '' })}>Clean <FcDeleteRow /></Button></td>
              </tr>
            </tbody>
          </Table>
        ))}
      </main>
    </div >
  )
}

