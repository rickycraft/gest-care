import { Decimal } from '@prisma/client/runtime'
import { trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { MdCancel, MdSave } from 'react-icons/md'


export default function ProdSubmitRow({
  listino,
  updateList,
  updateErrorMessage,
}: {
  listino: number,
  updateList: () => void
  updateErrorMessage: (message: string) => void
}) {
  const prodottoInsert = trpc.useMutation('prodotto.insert', {
    onSuccess() {
      updateErrorMessage('')
      updateList()
    },
    onError() {
      updateErrorMessage('Errore nel salvare un nuovo prodotto')
    }
  })

  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)

  const isRowValid = () => nome.length > 0 && prezzo > 0
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

  return (
    <tr>
      <td>
        <Form.Control name='InputTextNome'
          value={nome}
          onChange={(event) => setNome(event.currentTarget.value)}
          placeholder="Nome"
        />
      </td>
      <td>
        <Form.Control name='InputTextPrezzo' type='number'
          value={(prezzo == 0) ? '' : prezzo}
          onChange={(event) => { event.preventDefault(); setPrezzo(Number(event.currentTarget.value)) }}
          onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertProdotto() }}
          placeholder="Prezzo"
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
            SALVA<MdSave className='ms-1' />
          
          </Button>
          <Button name="CleanButton"
            variant="outline-secondary" 
            onClick={() => { setPrezzo(0); setNome('') }}
          >
            UNDO<MdCancel className='ms-1' />
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}