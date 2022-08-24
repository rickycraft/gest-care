import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'


import TableRowPrev from 'components/preventivo/TableRowPrev'
import PrevRowSubmitRow from 'components/preventivo/PrevRowSubmitRow'




export default function Index() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [preventivoRow, setPreventivoRow] = useState(-1)
  const [preventivo, setPreventivo] = useState(-1)

  const preventiviQuery = trpc.useQuery(['preventivo.list'])


  if (!preventiviQuery.isSuccess) {
    return <Spinner animation="border" />
  }


 
  const invalidPreventivo = -1
  // trpc
  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', { prevId : preventivo }])

  const listinoQuery = trpc.useQuery(['listino.list'])

  const preventivoRowUpdate = trpc.useMutation('preventivo.row.update', {
    onError() {
      setErrorMsg('Errore aggiornamento riga preventivo')
    }
  })


  const prodottoUpdate = trpc.useMutation('prodotto.update', {
    onError() {
      setErrorMsg('Errore nel aggiornare un prodotto')
    }
  })

  //preventivo row delete ??

  const prodottoDelete = trpc.useMutation('prodotto.delete', {
    onError() {
      setErrorMsg('Errore nell eliminare il prodotto selezionato')
    }
  })

  useEffect(() => {
    if (!preventivoRowQuery.isSuccess) return
    if ( /*prodottoDelete.isSuccess||*/  preventivoRowUpdate.isSuccess) {
      setErrorMsg('')
      preventivoRowQuery.refetch()
    }
  }, [/*prodottoDelete.isSuccess, */preventivoRowUpdate.isSuccess])
  //TODO: LASCIARE IL WARNING SOPRA ALTRIMENTI ESPLODE IL BROWSER DI CHIAMATE TRPC (prodQuery)

  const updatePreventivoRow = async (idPreventivo: number, idProdotto: number,
    provComm: number, provRappre: number, provSc: number) => {
    if (prodottoUpdate.isLoading) return
    preventivoRowUpdate.mutate({
      prevId: idPreventivo,
      prodId: idProdotto,
      provComm: provComm,
      provRappre: provRappre,
      provSc: provSc,
      id: 0,
      persId: 0
    })
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

  if (!preventivoRowQuery.isSuccess || !listinoQuery.isSuccess) {
    return (
      <div>Not ready</div>
    )
  }

  return (
    <div className="container">
      <Head>
        <title>Righe Preventivo</title>
        <meta name="description" content="Created by ..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Righe Preventivo &nbsp;
        </h1>

        {/* form dropdown per selezionare preventivo */}
        <Form.Group className='mb-2'>
          <Form.Select
            value={preventivo}
            onChange={(event) => { setPreventivo(Number(event.currentTarget.value)) }}
          >
            <option value={invalidPreventivo}>Seleziona un preventivo</option>
            {preventiviQuery.data.map(element => (
              <option key={element.id} value={element.id}>
                {element.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*Tabella che mostra i prodotti del preventivo selezionato*/}
        <Table bordered hover hidden={preventivo == -1}>
          <thead>
            <tr>
              <th>Id_Listino_Prodotti</th>
              <th>Id_Prodotto</th>
              <th>Prezzo Prodotto</th>
              <th>Id Personalizzazione</th>
              <th>Prezzo Personalizzazione</th>
              <th>Provvigione School-Care</th>
              <th>Provvigione Rappresentanti</th>
              <th>Provvigione Fornitori</th>
              <th>TOT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {preventivoRowQuery.data.map(prevRow => (
              <TableRowPrev
                key={prevRow.id}
                rowIdListino={1}//mi serve info Listino
                rowIdProd={prevRow.prodottoId}
                rowPriceProdotto={1}//da fare subquery?
                rowPers={prevRow.personalizzazioneId}
                rowPricePers={1}
                rowProvvSC={Number(prevRow.provvigioneSC)}
                // rowProvvSC={prevRow.provvigioneSC}
                rowProvvRapp={Number(prevRow.provvigioneRappre)}
                //   rowProvvRapp={prevRow.provvigioneRappre}
                //rowProvvComm={prevRow.provvigioneComm}
                rowProvvComm={Number(prevRow.provvigioneComm)}

                rowTot={1}

                onClickDelete={deleteProdotto}
                onClickEdit={updateProdotto} rowId={0}              />
            ))}
            {/* riga per inserire un nuovo prodotto*/}
            <PrevRowSubmitRow
              preventivo={preventivo}
              updateList={() => preventivoRowQuery.refetch}
              updateErrorMessage={(msg) => setErrorMsg(msg)}       />
            
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
