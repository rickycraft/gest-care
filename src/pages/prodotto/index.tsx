import React, { useEffect } from 'react'
import { trpc } from 'utils/trpc'

export default function Prodotto() {

  const prodTrpc = trpc.useQuery(['prodotto.list', { fornitore: 1 }])

  useEffect(() => {

  }, [])


  if (!prodTrpc.isSuccess) return (
    <div>Not ready</div>
  )

  return (
    <div>
      <h1>Prodotto</h1>
      <div>
        <ul>
          {prodTrpc.data.map(prod => (
            <li key={prod.id} ><>{prod.nome}: {prod.prezzo}</></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

