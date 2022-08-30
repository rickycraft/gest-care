import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

const invalidId = -1

export default function ModalDelete({
  preventivoId = invalidId,
  showModal,
}: {
  preventivoId?: number,
  showModal: boolean
}) {
  const [show, setShow] = useState(false)

  const context = trpc.useContext()
  const preventivoDelete = trpc.useMutation('preventivo.delete', {
    onSuccess() {
      context.invalidateQueries(['preventivo.byId', { id: preventivoId }])
      context.invalidateQueries(['preventivo.list'])
      setShow(false)
    }
  })

  useEffect(() => {
    if (preventivoId === invalidId) return
    setShow(true)
  }, [showModal])

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Body>
          <Modal.Title>Sei sicuro di voler eliminare il preventivo?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger'
            onClick={() => {
              preventivoDelete.mutate({ id: preventivoId })
            }}
          >
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
