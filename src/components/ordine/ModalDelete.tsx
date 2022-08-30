import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { trpc } from 'utils/trpc'

export default function ModalDelete(
  { ordineId, showModal }: { ordineId: number, showModal: boolean }
) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (ordineId == -1) return
    setShow(true)
  }, [showModal])

  const context = trpc.useContext()
  const ordineDelete = trpc.useMutation('ordine.delete', {
    onSuccess() {
      context.invalidateQueries(['ordine.list'])
      setShow(false)
    },
  })

  return (
    <>
      <div className='d-flex justify-content-end'>
        <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
          <Modal.Body>
            <Modal.Title>Sei sicuro di voler eliminare questo ordine?</Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => ordineDelete.mutate({ id: ordineId })} disabled={ordineDelete.isLoading}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}