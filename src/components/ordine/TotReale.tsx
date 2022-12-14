import { useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { MdCancel, MdOutlineUndo, MdSave } from 'react-icons/md'
import { trpc } from 'utils/trpc'

import ButtonTooltip from 'components/utils/ButtonTooltip'


export default function TotReale(
  {
    sc, comm, rappre, costo, ordineId,
    _sc, _comm, _rappre,
  }:
    {
      sc: number, comm: number, rappre: number, costo: number, ordineId: number,
      _sc: number, _comm: number, _rappre: number,
    }
) {
  const [newSc, setSc] = useState(sc)
  const [newComm, setComm] = useState(comm)
  const [newRappre, setRappre] = useState(rappre)
  const tot = useMemo(() => newSc + newComm + newRappre + costo, [newSc, newComm, newRappre, costo])
  const _tot = useMemo(() => _sc + _comm + _rappre + costo, [_sc, _comm, _rappre, costo])
  const isEdited = useMemo(() => newSc !== sc || newComm !== comm || newRappre !== rappre, [newSc, newComm, newRappre, sc, comm, rappre])

  const context = trpc.useContext()
  const ordineEdit = trpc.useMutation('ordine.editTot', {
    onSuccess() {
      context.invalidateQueries(['ordine.byId', { id: ordineId }])
    }
  })

  return (
    <>
      <tr>
        <td>Differenza</td>
        <td></td>
        <td>0</td>
        <td>{(newSc - _sc).toFixed(2)}</td>
        <td>{(newComm - _comm).toFixed(2)}</td>
        <td>{(newRappre - _rappre).toFixed(2)}</td>
        <td>{(tot - _tot).toFixed(2)}</td>
        <td></td>
      </tr>
      <tr>
        <td>Tot Reale</td>
        <td></td>
        <td>{costo.toFixed(2)}</td>
        <td>
          <Form.Control type='number' value={newSc} onChange={(e) => setSc(Number(e.target.value))} className="p-1" />
        </td>
        <td>
          <Form.Control type='number' value={newComm} onChange={(e) => setComm(Number(e.target.value))} className="p-1" />
        </td>
        <td>
          <Form.Control type='number' value={newRappre} onChange={(e) => setRappre(Number(e.target.value))} className="p-1" />
        </td>
        <td>{tot.toFixed(2)}</td>
        <td>
          <span className='d-flex flex-nowrap'>
            <ButtonTooltip tooltip="salva">
              <Button variant="outline-success  me-1 me-lg-2" hidden={!isEdited} onClick={() =>
                ordineEdit.mutate({ ordineId, totSC: newSc, totComm: newComm, totRappre: newRappre })} >
                <MdSave />
              </Button>
            </ButtonTooltip>
            <ButtonTooltip tooltip="annulla">
              <Button variant="outline-secondary" hidden={!isEdited} onClick={() => {
                setSc(sc)
                setComm(comm)
                setRappre(rappre)
              }}>
                <MdOutlineUndo />
              </Button>
            </ButtonTooltip>
          </span>
        </td>
      </tr>
    </>
  )
}