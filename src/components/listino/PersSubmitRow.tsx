import { inferMutationInput } from 'utils/trpc'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { ButtonGroup, Form } from 'react-bootstrap'
import { MdCancel, MdSave } from 'react-icons/md'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import ButtonTooltip from 'components/utils/ButtonTooltip'

export default function PersSubmitRow({
  listino,
  insertPers,
}: {
  listino: number,
  insertPers: (prod: inferMutationInput<'pers.insert'>) => void
}) {
  const [nome, setNome] = useState('')
  const [prezzo, setPrezzo] = useState(0)

  const isRowValid = () => nome.length > 0 && prezzo > 0
  const doInsertPers = () => {
    insertPers({ nome, prezzo, listino })
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
          onKeyUp={(event) => { if (event.key === 'Enter' && isRowValid()) doInsertPers() }}
          placeholder="Prezzo"
        />
      </td>
      <td>
        {/*Gruppo di bottoni "save" e "clean" per nuovo pers
                    save: salva un nuovo pers
                    clean: pulisce gli input text
                  */}
        <span className='d-flex flex-nowrap' > 

          <ButtonTooltip  tooltip="Salva">
            <Button name="SaveButton"
              variant="outline-success me-1 me-lg-2"
              disabled={!isRowValid()}
              onClick={() => doInsertPers()}
            >
              <MdSave className='ms-1' />
            </Button>
          </ButtonTooltip>


          <ButtonTooltip  tooltip="Annulla">
            <Button name="CleanButton"
              variant="outline-secondary"
              onClick={() => { setPrezzo(0); setNome('') }}
            >
              <MdCancel className='ms-1' />
            </Button>
          </ButtonTooltip>
          
        </span>
      </td>
    </tr>
  )
}