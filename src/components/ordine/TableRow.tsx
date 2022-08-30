import { Personalizzazione, Prodotto } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { MdCancel, MdSave } from 'react-icons/md'


export default function TableRow({
  id,
  _quantity,
  prod,
  pers,
  provvSC,
  provvComm,
  provvRappre,
  onChange,
}: {
  id: number,
  _quantity: number,
  prod: Prodotto,
  pers: Personalizzazione,
  provvSC: number,
  provvComm: number,
  provvRappre: number,
  onChange: (id: number, quantity: number) => void,
}) {
  const [quantity, setQuantity] = useState(_quantity)
  useEffect(() => {
    setQuantity(_quantity)
  }, [_quantity])

  const totSC = useMemo(() => quantity * provvSC, [quantity, provvSC])
  const totComm = useMemo(() => quantity * provvComm, [quantity, provvComm])
  const totRappre = useMemo(() => quantity * provvRappre, [quantity, provvRappre])
  const totProd = useMemo(() => quantity * (Number(prod.prezzo) + Number(pers.prezzo)), [quantity, prod.prezzo, pers.prezzo])
  const total = useMemo(() => quantity * (
    totSC + totComm + totRappre + totProd
  ), [totSC, totComm, totRappre, totProd])
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
      <td>{prod.nome}</td>
      <td>
        <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </td>
      {totals}

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
        `} </style>
        <Button variant="outline-success" onClick={() => onChange(id, quantity)}>SALVA<MdSave className='ms-1' /></Button>
        <Button variant="outline-secondary" onClick={() => setQuantity(_quantity)}>UNDO<MdCancel className='ms-1' /></Button>
      </ButtonGroup>
    </tr>
  )
}