import { Decimal } from '@prisma/client/runtime'
import { trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"
import { number } from 'zod'

const invalidPreventivo = -1
const invalidListino = -1
const invalidProd = -1


export default function PrevRowSubmitRow({
  preventivo,
  updateList,
  updateErrorMessage,
}: {
  preventivo: number,
  updateList: () => void
  updateErrorMessage: (message: string) => void
}) {
  const prevRowInsert = trpc.useMutation('preventivo.row.insert', {
    onSuccess() {
      updateErrorMessage('')
      updateList()
    },
    onError() {
      updateErrorMessage('Errore nel salvare una nuova riga preventivo')
    }
  })
 

  const [prevId, setPrevId] = useState(0)
  const [prodId, setIdProd] = useState(0)
  const [PriceProdotto, setPriceProdotto] = useState(0)
  const [persId, setPers] = useState(0)
  const [PricePers, setPricePers] = useState(0)
  const [provRappre, setProvvRapp] = useState(0)
  const [provComm, setProvvComm] = useState(0)
  const [provSc, setProvvSC] = useState(0)
  const [listino, setListino] = useState(-1)


  const isRowValid = () => provRappre > 0 && provComm > 0 && provSc > 0

  const preventiviQuery = trpc.useQuery(['preventivo.list'])


  const prodottoByIdQuery = trpc.useQuery(['prodotto.byId', { id: prodId }])


  const persQuery = trpc.useQuery(['pers.list', { listino }])

  const preventiviRowQuery = trpc.useQuery(['preventivo.row.list' ,{ prevId }])
  
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])

  const listinoQuery = trpc.useQuery(['listino.list'])



 // const isRowValid = () => nome.length > 0 && prezzo > 0
  const insertPrevRow = async () => {
    if (prevRowInsert.isLoading) return
    prevRowInsert.mutate({
            prevId,      
      /*Bisogna poter selezionare il listino!*/
      prodId,
      persId,
      provRappre,
      provComm,
      provSc,
    })
    setPrevId(0)
    setIdProd(0)
    setPriceProdotto(0)
    setPers(0)
    setPricePers(0)
    setProvvRapp(0)
    setProvvComm(0)
    setProvvSC(0)
  }

  useEffect(() => {
    if (!prodottoByIdQuery.isSuccess) return
    if (prodottoByIdQuery.data === null) return
    if (prodottoByIdQuery.data === undefined) return

    setPriceProdotto(Number(prodottoByIdQuery.data.prezzo))
   }, [prodottoByIdQuery.isSuccess])

  if (!preventiviRowQuery.isSuccess || !persQuery.isSuccess || !prodQuery.isSuccess || !listinoQuery.isSuccess ) {
    return <Spinner animation="border" />
  }
  var prezzoProd=-1
  var prezzoPers=-1
  return (
    <tr>
      <td>
            {/* form dropdown per selezionare il listino */}
        <Form.Group className='mb-2'>
          <Form.Select
            value={listino}
            onChange={(event) => { setListino(Number(event.currentTarget.value)) }}
          >
            <option value={invalidListino}>Seleziona un listino</option>
            {listinoQuery.data.map(element => (
              <option key={element.id} value={element.id}>
                {element.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </td>
      <td>
           {/* form dropdown per selezionare prodotto */}
           <Form.Group className='mb-2'  hidden={listino == -1}>
          <Form.Select
            value={prodId}
            onChange={(event) => { setIdProd(Number(event.currentTarget.value)) }}
          >
            <option value={invalidProd}>Seleziona un prodotto</option>
            {prodQuery.data.map(element => (
              
              <option key={element.id} value={element.id}>
                {element.nome}
               </option>
              
            ))}
          </Form.Select>
        </Form.Group>
      </td>
      <td>
        {/* campo in cui inserisco prezzo del prodotto selezionato
         updatePrezzoProdotto={() => prodottoByIdQuery.refetch()} 
          {Number(prodottoByIdQuery.data.prezzo)} */}    
          {prezzoProd}
      </td>
         
  
      <td>
          {/* form dropdown per selezionare pers */}
          <Form.Group className='mb-2'>
                    <Form.Select
                      value={persId}
                      onChange={(event) => { setPers(Number(event.currentTarget.value)) }}
                    >
                      <option value={invalidPreventivo}>Seleziona una personalizzazione</option>
                      {persQuery.data.map(element => (
                        <option key={element.id} value={element.id}>
                          {element.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

      </td>
      
      
      <td>
        {/* campo in cui inserisco prezzo della pers selezionata
         updatePrezzoProdotto={() => prodottoByIdQuery.refetch()} 
          {Number(prodottoByIdQuery.data.prezzo)}   
       */}         
          {prezzoPers}
      </td>
      <td>

      <Form.Control name='InputTextPrezzoProvvSC' type='number'
          value={(provSc == 0) ? '' : provSc}
          onChange={(event) => { event.preventDefault(); setProvvSC(Number(event.currentTarget.value)) }}
          onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertPrevRow() }}
          placeholder="Provv"
        />


      </td>
      <td>
      <Form.Control name='InputTextPrezzoProvvRappre' type='number'
          value={(provRappre == 0) ? '' : provRappre}
          onChange={(event) => { event.preventDefault(); setProvvRapp(Number(event.currentTarget.value)) }}
          onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertPrevRow() }}
          placeholder="Provv"
        />

      </td>
      <td>
      <Form.Control name='InputTextPrezzoProvvComm' type='number'
          value={(provComm == 0) ? '' : provComm}
          onChange={(event) => { event.preventDefault(); setProvvComm(Number(event.currentTarget.value)) }}
          onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertPrevRow() }}
          placeholder="Provv"
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
            disabled={false}
            onClick={() => insertPrevRow()}
          >
            Save<FcCheckmark />
          </Button>
          <Button name="CleanButton"
            variant="outline-primary"
            onClick={() => { 
              setPrevId(0),
              setIdProd(0),
              setPriceProdotto(0),
              setPers(0),
              setPricePers(0),
              setProvvRapp(0),
              setProvvComm(0),
              setProvvSC(0)
            }}
          >
            Clean<FcDeleteRow />
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}