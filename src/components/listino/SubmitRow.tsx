import { Decimal } from '@prisma/client/runtime'
import { trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcDeleteRow, FcCheckmark } from "react-icons/fc"

export default function SubmitRow({
  listino,
  updateProdList,
  updateErrorMessage,
}: {
  listino: number,
  updateProdList: () => void
  updateErrorMessage: (message: string) => void
}) {
  const prodottoInsert = trpc.useMutation('prodotto.insert', {
    onSuccess() {
      updateErrorMessage('')
      updateProdList()
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
  )
}