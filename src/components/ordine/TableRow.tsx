import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useEffect, useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { MdOutlineUndo, MdOutlineCheck } from 'react-icons/md'

export default function TableRow({
  id, prod, _quantity, costo, sc, comm, rappre, onChange,
}: {
  id: number,
  prod: string,
  _quantity: number,
  costo: number,
  sc: number,
  comm: number,
  rappre: number,
  onChange: (id: number, quantity: number) => void,
}) {
  const [quantity, setQuantity] = useState(_quantity)
  useEffect(() => {
    setQuantity(_quantity)
  }, [_quantity])

  const totSC = useMemo(() => quantity * sc, [quantity, sc])
  const totComm = useMemo(() => quantity * comm, [quantity, comm])
  const totRappre = useMemo(() => quantity * rappre, [quantity, rappre])
  const totProd = useMemo(() => quantity * costo, [quantity, costo])
  const total = useMemo(() => totSC + totComm + totRappre + totProd, [totSC, totComm, totRappre, totProd])
  const totals = useMemo(() => (
    <>
      <td>{totProd.toFixed(2)}</td>
      <td>{totSC.toFixed(2)}</td>
      <td>{totComm.toFixed(2)}</td>
      <td>{totRappre.toFixed(2)}</td>
      <td>{total.toFixed(2)}</td>
    </>
  ), [total])
  const isEdited = useMemo(() => _quantity !== quantity, [_quantity, quantity])
  return (
    <tr>
      <td>{prod}</td>
      <td>
        <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </td>
      {totals}
      <td>
        <span className='d-flex flex-nowrap'>
          <ButtonTooltip tooltip="Salva Modifiche">
            <Button variant="outline-success me-1 me-lg-2"   hidden={!isEdited} onClick={() => onChange(id, quantity)}>  <MdOutlineCheck /></Button>
          </ButtonTooltip>
          <ButtonTooltip tooltip="Annulla Modifiche">
            <Button variant="outline-secondary"   hidden={!isEdited} onClick={() => setQuantity(_quantity)}><MdOutlineUndo /></Button>
          </ButtonTooltip>
        </span>
      </td>
    </tr>
  )
}