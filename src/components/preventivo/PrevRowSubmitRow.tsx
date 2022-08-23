import { Decimal } from '@prisma/client/runtime'
import { trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"

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

  const preventiviQuery = trpc.useQuery(['preventivo.list'])
  const persQuery = trpc.useQuery(['pers.list', { listino }])

  const preventiviRowQuery = trpc.useQuery(['preventivo.row.list' ,{ prevId }])
  
  const prodQuery = trpc.useQuery(['prodotto.list', { listino }])


  const invalidPreventivo = -1
  const invalidProd = -1

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
  if (!preventiviRowQuery.isSuccess || !persQuery.isSuccess || !prodQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <tr>
      <td>
           {/* form dropdown per selezionare prodotto */}
           <Form.Group className='mb-2'>
          <Form.Select
            value={listino}
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
      <td></td>
      <td>
          {/* form dropdown per selezionare pers */}
          <Form.Group className='mb-2'>
                    <Form.Select
                      value={persId}
                      onChange={(event) => { setPers(Number(event.currentTarget.value)) }}
                    >
                      <option value={invalidPreventivo}>Seleziona un preventivo</option>
                      {persQuery.data.map(element => (
                        <option key={element.id} value={element.id}>
                          {element.id}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

      </td>
      
      <td></td>

      <td></td>
      <td></td>
      <td></td>
      <td></td>
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