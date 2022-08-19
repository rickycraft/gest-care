import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"
import Alert from 'react-bootstrap/Alert'
import TableRow from 'components/listino/TableRow'
import ModalListino from 'components/listino/ModalListino'

export default function Prodotto() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)
  const [listino, setListino] = useState(0)

  // trpc
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])
  const fornitoriQuery = trpc.useQuery(['fornitore.list'])
  const listinoQuery = trpc.useQuery(['listino.list'])
  const listinoInsert = trpc.useMutation(['listino.insert'], {
    onError() {
      setErrorMsg('Errore nel salvare un nuovo listino')
    }
  })
  const prodottoInsert = trpc.useMutation('prodotto.insert', {
    onError() {
      setErrorMsg('Errore nel salvare un nuovo prodotto')
    }
  })
  const prodottoUpdate = trpc.useMutation('prodotto.update', {
    onError() {
      setErrorMsg('Errore nel aggiornare un prodotto')
    }
  })
  const prodottoDelete = trpc.useMutation('prodotto.delete', {
    onError() {
      setErrorMsg('Errore nell eliminare il prodotto selezionato')
    }
  })

  useEffect(() => {
    if (listinoInsert.isSuccess) {
      setErrorMsg('')
      listinoQuery.refetch()
    }
  }, [listinoInsert.isSuccess])

  useEffect(() => {
    if (!prodQuery.isSuccess) return
    if (prodottoInsert.isSuccess || prodottoDelete.isSuccess || prodottoUpdate.isSuccess) {
      setErrorMsg('')
      prodQuery.refetch()
    }
  }, [prodottoInsert.isSuccess, prodottoDelete.isSuccess, prodottoUpdate.isSuccess])
  //TODO: LASCIARE IL WARNING SOPRA ALTRIMENTI ESPLODE IL BROWSER DI CHIAMATE TRPC (prodQuery)

  const insertProdotto = async () => {
    if (prodottoInsert.isLoading) return
    prodottoInsert.mutate({
      nome,
      prezzo,
      listino,
    })
    setPrezzo(0)
    setNome('')
  }

  const updateProdotto = async (idProdotto: number, prezzo: number) => {
    if (prodottoUpdate.isLoading) return
    prodottoUpdate.mutate({
      id: idProdotto,
      prezzo: prezzo,
    })
  }

  const deleteProdotto = async (idProdotto: number) => {
    if (prodottoDelete.isLoading) return
    prodottoDelete.mutate({
      id: idProdotto
    })

  }

  const insertListino = async (nome: string, idFornitore: number) => {
    if (listinoInsert.isLoading) return
    listinoInsert.mutate({
      nome: nome,
      fornitore: idFornitore,
    })
  }

  const isRowValid = () => nome.length > 0 && prezzo > 0

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
        <h1>
          Listino &nbsp;
          <ModalListino
            label='+'
            fornitoriList={fornitoriQuery.data}
            onClickSave={insertListino}
            isSaveLoading={listinoInsert.isLoading}
          />
        </h1>

        {/* form dropdown per selezionare il listino */}
        <Form.Group className='mb-2'>
          <Form.Select
            value={listino}
            onChange={(event) => { setListino(Number(event.currentTarget.value)) }}
          >
            <option value='0'>Seleziona un listino</option> {/*TODO: cambiare value posto a 0 */}
            {listinoQuery.data.map(element => (
              <option key={element.id} value={element.id}>{element.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*Tabella che mostra i prodotti del listino selezionato*/}
        <Table bordered hover hidden={listino == 0}>
          <thead>
            <tr>
              <th>Nome prodotto</th>
              <th>Prezzo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prodQuery.data.map(prod => (
              <TableRow
                rowId={prod.id}
                rowName={prod.nome}
                rowPrice={prod.prezzo}
                onClickDelete={deleteProdotto}
                onClickEdit={updateProdotto}
              />
            ))}
            <tr>
              <td>
                <Form.Control name='InputTextNomeProdotto'
                  value={nome}
                  onChange={(event) => setNome(event.currentTarget.value)}
                  placeholder="Nome prodotto"
                />
              </td>
              <td>
                <Form.Control name='InputTextPrezzoProdotto' type='number'
                  value={(prezzo == 0) ? '' : prezzo}
                  onChange={(event) => { event.preventDefault(); setPrezzo(Number(event.currentTarget.value)) }}
                  onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertProdotto() }}
                  placeholder="Prezzo prodotto"
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
                    disabled={!isRowValid()}
                    onClick={() => insertProdotto()}
                  >
                    Save<FcCheckmark />
                  </Button>
                  <Button name="CleanButton"
                    variant="outline-primary"
                    onClick={() => { setPrezzo(0); setNome('') }}
                  >
                    Clean<FcDeleteRow />
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

