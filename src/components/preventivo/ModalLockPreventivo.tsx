import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

const invalidId = -1

export default function ModalLock({
  preventivoId = invalidId,
  isLock = false,
  showModal,
}: {
  preventivoId?: number,
  isLock?: boolean,
  showModal: boolean
}) {
  const [show, setShow] = useState(false)

  const context = trpc.useContext()
  const trpcCallback = {
    onSuccess() {
      context.invalidateQueries(['preventivo.byId', { id: preventivoId }])
      context.invalidateQueries(['preventivo.list'])
      setShow(false)
    }
  }
  const preventivoLock = trpc.useMutation('preventivo.lock', trpcCallback)
  const preventivoUnlock = trpc.useMutation('preventivo.unlock', trpcCallback)

  useEffect(() => {
    if (preventivoId === invalidId) return
    setShow(true)
  }, [showModal])

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Body>
          <Modal.Title>Sei sicuro di voler {isLock ? 'sbloccare' : 'bloccare'} il preventivo?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger'
            onClick={() => {
              if (isLock) preventivoUnlock.mutate({ id: preventivoId })
              else preventivoLock.mutate({ id: preventivoId })
            }}
          >
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
