import { Personalizzazione, Prodotto } from '@prisma/client'
import { useMemo, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'


export default function TableRow({
  _quantity,
  prod,
  pers,
  provvSC,
  provvComm,
  provvRappre,
}: {
  _quantity: number,
  prod: Prodotto,
  pers: Personalizzazione,
  provvSC: number,
  provvComm: number,
  provvRappre: number,
}) {
  const [quantity, setQuantity] = useState(_quantity)
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
    </tr>
  )
}