import ModalCreate from 'components/ordine/ModalCreate'
import { useRouter } from 'next/router'
import { Card, Spinner } from 'react-bootstrap'
import { trpc } from 'utils/trpc'

export default function List() {
  const router = useRouter()
  const ordineList = trpc.useQuery(['ordine.list'])

  if (!ordineList.isSuccess) return <Spinner animation="border" />

  return (
    <div>
      <div className='mb-3'>
        {ordineList.data.map(ordine => (
          <Card key={ordine.id} onClick={() => router.push(`/ordine/${ordine.id}`)} className='mb-3'>
            <Card.Body className='d-flex justify-content-between align-items-center'>
              <h2>{ordine.preventivo.nome.toUpperCase()}</h2>
              <span>Altra descrizione</span>
            </Card.Body>
          </Card>
        ))}
      </div>
      <ModalCreate />
    </div>
  )
}