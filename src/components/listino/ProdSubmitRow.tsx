import { inferMutationInput, trpc } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useMemo, useState } from 'react'
import { ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { MdOutlineBlock, MdSave } from 'react-icons/md'
import ButtonTooltip from 'components/utils/ButtonTooltip'

export default function ProdSubmitRow({
  listino,
  insertProdotto,
}: {
  listino: number,
  insertProdotto: (prod: inferMutationInput<'prodotto.insert'>) => void
}) {
  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)
  const isEdited = useMemo(() => nome !== '' || prezzo !== 0, [nome, prezzo])

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
      <td className='d-flex flex-nowrap' >
        {/*Gruppo di bottoni "save" e "clean" per nuovo prodotto
                    save: salva un nuovo prodotto
                    clean: pulisce gli input text
                  */}
        <ButtonTooltip tooltip="Salva">
          <Button name="SaveButton"
            variant="outline-success me-1 me-lg-2"
            disabled={!isRowValid()}
            onClick={() => doInsertProd()}
          >
            <MdSave />
          </Button>
        </ButtonTooltip>
        <ButtonTooltip tooltip="Pulisci">
          <Button name="CleanButton"
            variant="outline-secondary"
            disabled={!isEdited}
            onClick={() => { setPrezzo(0); setNome('') }}
          >
            <MdOutlineBlock />
          </Button>
        </ButtonTooltip>
      </td>
    </tr>
  )
}