import ModalCreate from 'components/ordine/ModalCreate'
import ModalDelete from 'components/ordine/ModalDelete'
import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import { MdDelete } from 'react-icons/md'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function List() {
  const router = useRouter()
  const ordineList = trpc.useQuery(['ordine.list'])
  const [showDeleteModal, setShowDelete] = useState(false)

  const [ordineId, setOrdine] = useState(INVALID_ID)
  const showDelete = (id: number) => {
    setOrdine(id)
    setShowDelete(!showDeleteModal)
  }

  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
  }, [])

  if (!ordineList.isSuccess) return <Spinner animation="border" />

  return (
    <div>
      <div className='mb-3'>
        {ordineList.data.map(ordine => (
          <Card key={ordine.id} className='mb-3'>
            <Card.Body className='d-flex justify-content-between align-items-center'>
              <h2 onClick={() => router.push(`/ordine/${ordine.id}`)}>
                {isLoading ? <Spinner animation='border' /> : ordine.preventivo.nome.toUpperCase()}
              </h2>
              <span className='d-flex flex-nowrap align-items-center'>
                Totale SC: {ordine.sc.toFixed(2)}
                <ButtonTooltip tooltip="elimina ordine">
                  <Button variant='outline-danger' className='ms-3' onClick={() => showDelete(ordine.id)}>
                    <MdDelete />
                  </Button>
                </ButtonTooltip>
              </span>
            </Card.Body>
          </Card>
        ))}
      </div>
      <ModalCreate />
      <ModalDelete ordineId={ordineId} showModal={showDeleteModal} />
    </div >
  )
}