import Head from 'next/head'
import { trpc } from 'utils/trpc'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import ModalPreventivo from 'components/preventivo/ModalPreventivo'





export default function Preventivo() {
  //stati vari
  const [errorMsg, setErrorMsg] = useState('')
  const [preventivo, setPreventivo] = useState(-1) //(TO DO)


  // trpc
  //const prodQuery = trpc.useQuery(['prodotto.list', { listino }])

  const preventivoQuery = trpc.useQuery(['preventivo.list'])

  const preventivoRowQuery = trpc.useQuery(['preventivo.row.list', {preventivo}]) // (???)

  const preventivoUpdate = trpc.useMutation('preventivo.update', { //(TO DO)
    onError() {
      setErrorMsg('Errore aggiornamento preventivo')
    }
  })
  const preventivoDelete = trpc.useMutation('preventivo.delete', {  //(TO DO)
    onError() {
      setErrorMsg('Errore eliminazione preventivo selezionato')
    }
  })

  useEffect(() => {
    if (!preventivoQuery.isSuccess) return
    if (preventivoDelete.isSuccess || preventivoUpdate.isSuccess) {
      setErrorMsg('')
      preventivoQuery.refetch()
    }
  }, [preventivoDelete.isSuccess, preventivoUpdate.isSuccess])
  //TODO: LASCIARE IL WARNING SOPRA ALTRIMENTI ESPLODE IL BROWSER DI CHIAMATE TRPC (prodQuery)

  const updatePreventivo = async (idPreventivo: number, nomePreventivo : string, listinoId: number, scuolaId: number) => {
    if (preventivoUpdate.isLoading) return
    preventivoUpdate.mutate({
      id: idPreventivo,
      nome: nomePreventivo,
      listino: listinoId,  //tipo string > number      
      scuola: scuolaId,   //tipo string > number
    })
  }

  const deletePreventivo= async (idPreventivo: number) => {
    if (preventivoDelete.isLoading) return
    preventivoDelete.mutate({
      id: idPreventivo
    })

  }

  if (!preventivoQuery.isSuccess) {
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
          Preventivo &nbsp;

       {
          <ModalPreventivo preventivoId={preventivo} updatePreventivoList={() => preventivoQuery.refetch()} />
        }

        </h1>

       
     
        {preventivoQuery.data.map(element => (
       
 

    <Card>
       <Card.Body>
       <Card.Title>{element.nome} </Card.Title> 
       <Card.Text>    
         <Table  bordered hover size="sm">
          
                 <tbody>
             <tr><td> Nome</td> <td>{element.nome}</td></tr>
             <tr><td> Scuola</td> <td>{element.scuola.nome}</td></tr>
             <tr><td> User Ultima Modifica</td> <td>{element.lastEditedBy.username}</td></tr>
            <tr><td> Data Ultima Modifica</td> <td>{element.createdAt.getDate}</td></tr> {/*(???)*/}
             <tr><td> Approvato</td> <td>
              <Form.Check 
                        checked={true} //MISSING FIELD
                         type="switch"
                         id="custom-switch"
                         label=""
                       />
            </td></tr>
             {/*
             <td>
               <ButtonGroup>
                 <Button variant="outline-warning" >Edit <FcSupport /></Button>
                 <Button variant="outline-danger" name="deleteButton" disabled={false} onClick={() => sendDeleteRequest(-1)}>Delete <FcCancel /></Button>
                 <Button variant="outline-dark" name="saveButton" onClick={makePDF}>PDF <MdPictureAsPdf /></Button>
               </ButtonGroup>
             </td>
              */}
          
                   </tbody>
              </Table>
       </Card.Text>

     {/* <Button variant="dark">Vai a Lista Prodotti</Button>     */}
     </Card.Body>
   </Card>
   ))}

        {/* alert per mostrare i messaggi di errore */}
        <Alert variant='danger' hidden={errorMsg.length === 0}>
          {errorMsg}
        </Alert>
      </main>
    </div >
  )
}

