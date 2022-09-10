import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalLock({
  preventivo,
  showModal,
}: {
  preventivo?: inferQueryOutput<'preventivo.list'>[0],
  showModal: boolean,
}) {
  const [show, setShow] = useState(false)

  const context = trpc.useContext()
  const trpcCallback = {
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      setShow(false)
    }
  }
  const preventivoLock = trpc.useMutation('preventivo.lock', trpcCallback)
  const preventivoUnlock = trpc.useMutation('preventivo.unlock', trpcCallback)

  useEffect(() => setShow(true), [showModal])
  if (!preventivo) return null

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Body>
          <Modal.Title>Sei sicuro di voler {preventivo.locked ? 'sbloccare' : 'bloccare'} il preventivo?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger'
            onClick={() => {
              if (preventivo.locked) preventivoUnlock.mutate({ id: preventivo.id })
              else preventivoLock.mutate({ id: preventivo.id })
            }}
          >
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
