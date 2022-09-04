import { Decimal } from '@prisma/client/runtime'
import { inferMutationInput, trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { MdCancel, MdSave } from 'react-icons/md'


export default function ProdSubmitRow({
  listino,
  insertProdotto,
}: {
  listino: number,
  insertProdotto: (prod: inferMutationInput<'prodotto.insert'>) => void
}) {
  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)

  const isRowValid = () => nome.length > 0 && prezzo > 0
  const doInsertProd = () => {
    insertProdotto({ nome, prezzo, listino })
    setNome('')
    setPrezzo(0)
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
          onKeyUp={(event) => { if (event.key === 'Enter' && isRowValid()) doInsertProd() }}
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
            onClick={() => doInsertProd()}
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