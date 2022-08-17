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
  const [listino, setListino] = useState(0)
  // trpc
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const prodottoInsert = trpc.useMutation('prodotto.insert')
  const prodottoUpdate = trpc.useMutation('prodotto.update')
  const prodottoDelete = trpc.useMutation('prodotto.delete')

  useEffect(() => {
    if (!prodQuery.isSuccess) return
    if (prodottoInsert.isSuccess || prodottoDelete.isSuccess || prodottoUpdate.isSuccess) {
      prodQuery.refetch()
    }
  }, [prodottoInsert.isSuccess, prodottoDelete.isSuccess, prodottoUpdate.isSuccess])

  const insertProdotto = async () => {
    if (prodottoInsert.isLoading) return
    prodottoInsert.mutate({
      nome: inputTextValues.nome,
      prezzo: Number(inputTextValues.prezzo),
      listino: listino,
    })
    setInputTextValues({ nome: '', prezzo: '' })
    if (prodottoInsert.isError) {
      setErrorMsg('Errore nel salvare un nuovo prodotto: ' + prodottoInsert.error)
    }
  }

  const updateProdotto = async (idProdotto: number, prezzo: number) => {
    if (prodottoUpdate.isLoading) return
    prodottoUpdate.mutate({
      id: idProdotto,
      prezzo: prezzo,
    })
    if (prodottoUpdate.isError) {
      setErrorMsg('Errore nel aggiornare un prodotto: ' + prodottoUpdate.error)
    }
  }

  const deleteProdotto = async (idProdotto: number) => {
    if (prodottoDelete.isLoading) return
    prodottoDelete.mutate({
      id: idProdotto
    })
    if (prodottoDelete.isError) {
      setErrorMsg('Errore nell eliminare il prodotto selezionato: ' + prodottoDelete.error)
    }
  }

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess) {
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
        <h1>Listino</h1>
        {/* form dropdown per selezionare il listino */}
        <Form.Group>
          <Form.Select
            value={listino}
            onChange={(event) => { setListino(Number(event.currentTarget.value)) }}
          >
            <option value='0'>Seleziona un listino</option>
            {listinoQuery.data.map(element => (
              <option key={element.id} value={element.id}>{element.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*Tabella che mostra i prodotti del listino selezionato*/}
        <Table striped bordered hover hidden={listino == 0}>
          <thead>
            <tr>
              <th>Id prodotto</th>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
            </tr>
          </thead>
          <tbody>
            {prodQuery.data.map(prod => (
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
                      disabled={prodottoUpdate.isLoading}
                      onClick={() => updateProdotto(prod.id, Number(prod.prezzo))}
                    >
                      Edit
                      {(!prodottoUpdate.isLoading) && <FcSupport />}
                      {(prodottoUpdate.isLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>
                    <Button name="DeleteButton"
                      variant="outline-danger"
                      disabled={prodottoDelete.isLoading}
                      onClick={() => deleteProdotto(prod.id)}
                    >
                      Delete
                      {(!prodottoDelete.isLoading) && <FcCancel />}
                      {(prodottoDelete.isLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
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
                {/*Gruppo di bottoni "save" e "clean" per nuovo prodotto
                    save: salva un nuovo prodotto
                    clean: pulisce gli input text
                  */}
                <ButtonGroup>
                  <Button name="SaveButton"
                    variant="outline-success"
                    disabled={prodottoInsert.isLoading}
                    onClick={() => insertProdotto()}
                  >
                    Save
                    {!prodottoInsert.isLoading && <FcCheckmark />}
                    {prodottoInsert.isLoading && <Spinner as="span" animation="border" size="sm" role="status" />}
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
        {/* <div> Test:  {newProdotto.nome}, {newProdotto.prezzo}, {newProdotto.listino}</div> */}
      </main>
    </div >
  )
}

