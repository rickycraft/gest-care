import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"
import Alert from 'react-bootstrap/Alert'
import TableRow from 'components/TableRow'
import ModalListino from 'components/ModalListino'

const ONLY_DECIMAL_REGEX = /^\d+\.?\d*$/ //regex per il check del numero prezzo (TODO: inserire che può essere anche una stringa vuota)

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [inputTextValues, setInputTextValues] = useState({ nome: '', prezzo: '' })
  const [listino, setListino] = useState(0)

  // trpc
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const fornitoriQuery = trpc.useQuery(['fornitore.list'])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const listinoInsert = trpc.useMutation(['listino.insert'])
  const prodottoInsert = trpc.useMutation('prodotto.insert')
  const prodottoUpdate = trpc.useMutation('prodotto.update')
  const prodottoDelete = trpc.useMutation('prodotto.delete')

  const [prezzoInputTextIsInvalid, setPrezzoInputTextIsInvalid] = useState(false)

  //check decimal prezzo
  useEffect(() => {
    if (ONLY_DECIMAL_REGEX.test(inputTextValues.prezzo) || inputTextValues.prezzo.length === 0) {
      setPrezzoInputTextIsInvalid(false)
    } else {
      setPrezzoInputTextIsInvalid(true)
    }
  }, [inputTextValues.prezzo]);

  useEffect(() => {
    if (!prodQuery.isSuccess) return
    if (prodottoInsert.isSuccess || prodottoDelete.isSuccess || prodottoUpdate.isSuccess || listinoInsert.isSuccess) {
      prodQuery.refetch()
      listinoQuery.refetch()
    }
  }, [prodottoInsert.isSuccess, prodottoDelete.isSuccess, prodottoUpdate.isSuccess, listinoInsert.isSuccess])
  //TODO: LASCIARE IL WARNING SOPRA ALTRIMENTI ESPLODE IL BROWSER DI CHIAMATE TRPC (prodQuery)

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
    console.log('id: ' + idProdotto + ' prezzo: ' + prezzo)
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

  const insertListino = async (nome:string, idFornitore:number) => {
    // console.log('id: ' +idFornitore  + ' nome: ' + nome)
    if (listinoInsert.isLoading) return
    listinoInsert.mutate({
      nome: nome,
      fornitore: idFornitore,
    })
    if (listinoInsert.isError) {
      setErrorMsg('Errore nel salvare un nuovo listino: ' + listinoInsert.error)
    }
  }

  if (!prodQuery.isSuccess || !listinoQuery.isSuccess || !fornitoriQuery.isSuccess) {
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
        <ModalListino 
        label='+'
        fornitoriList={fornitoriQuery.data}
        onClickSave={insertListino}
        isSaveLoading={listinoInsert.isLoading}
        />
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prodQuery.data.map(prod => (
              <TableRow
                key={prod.id}
                prodId={prod.id}
                prodNome={prod.nome}
                prodPrezzoIniziale={prod.prezzo.toString()}
                onClickDelete={deleteProdotto}
                onClickEdit={updateProdotto}
                isDeleteLoading={prodottoDelete.isLoading}
                isEditLoading={prodottoUpdate.isLoading}
                isEditSuccess={prodottoUpdate.isSuccess}
              />
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
                  isInvalid={prezzoInputTextIsInvalid}
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
                    disabled={prodottoInsert.isLoading || prezzoInputTextIsInvalid}
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
      </main>
    </div >
  )
}

