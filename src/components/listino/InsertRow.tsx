import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { MdOutlineBlock, MdSave } from 'react-icons/md'

export default function InsertRow({
  listino,
  addRow,
}: {
  listino: number,
  addRow: (row: { nome: string, prezzo: number, listino: number }) => void
}) {
  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)
  const isEdited = useMemo(() => nome !== '' || prezzo !== 0, [nome, prezzo])
  const isRowValid = useMemo(() => nome.length > 0 && prezzo >= 0, [nome, prezzo])

  const doAddRow = () => {
    if (!isRowValid) return
    addRow({ nome, prezzo, listino })
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
          value={prezzo}
          onChange={(event) => { event.preventDefault(); setPrezzo(Number(event.currentTarget.value)) }}
          onKeyUp={(event) => { if (event.key === 'Enter') doAddRow() }}
          placeholder="Prezzo"
        />
      </td>
      <td className='d-flex flex-nowrap' >
        {/*Gruppo di bottoni "save" e "clean" per nuovo prodotto
                    save: salva un nuovo prodotto
                    clean: pulisce gli input text
        */}
        <ButtonTooltip tooltip="salva">
          <Button name="SaveButton"
            variant="outline-success me-1 me-lg-2"
            disabled={!isRowValid}
            onClick={() => doAddRow()}
          >
            <MdSave />
          </Button>
        </ButtonTooltip>
        <ButtonTooltip tooltip="pulisci">
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