import { trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { ButtonGroup, Form } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"

export default function PersSubmitRow({
  listino,
  updateList,
  updateErrorMessage,
}: {
  listino: number,
  updateList: () => void
  updateErrorMessage: (message: string) => void
}) {
  const persInsert = trpc.useMutation('pers.insert', {
    onSuccess() {
      updateErrorMessage('')
      updateList()
    },
    onError() {
      updateErrorMessage('Errore nel salvare un nuova personalizzazione')
    }
  })

  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)

  const isRowValid = () => nome.length > 0 && prezzo > 0
  const insertPers = async () => {
    if (persInsert.isLoading) return
    persInsert.mutate({
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
          onKeyPress={(event) => { if (event.key === 'Enter' && isRowValid()) insertPers() }}
          placeholder="Prezzo"
        />
      </td>
      <td>
        {/*Gruppo di bottoni "save" e "clean" per nuovo pers
                    save: salva un nuovo pers
                    clean: pulisce gli input text
                  */}
        <ButtonGroup>
          <Button name="SaveButton"
            variant="outline-success"
            disabled={!isRowValid()}
            onClick={() => insertPers()}
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
  )
}