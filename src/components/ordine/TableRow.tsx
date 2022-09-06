import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { MdCancel, MdSave } from 'react-icons/md'


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

  return (
    <tr>
      <td>{prod}</td>
      <td>
        <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </td>
      {totals}
      <td>
        <ButtonGroup hidden={_quantity == quantity}>
          <style>
            {`
              .btn-outline-success{
                border-top-left-radius: 5px !Important;
                border-bottom-left-radius: 5px !Important;
             }
             .btn-outline-secondary {
              border-top-left-radius: 0px !Important;
                border-bottom-left-radius: 0px;
             }
             `}
          </style>
          <Button variant="outline-success" onClick={() => onChange(id, quantity)}>SALVA<MdSave className='ms-1' /></Button>
          <Button variant="outline-secondary" onClick={() => setQuantity(_quantity)}>UNDO<MdCancel className='ms-1' /></Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}