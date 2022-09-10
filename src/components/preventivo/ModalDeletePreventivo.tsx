import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalDelete({
  preventivo,
  showModal,
}: {
  preventivo?: inferQueryOutput<'preventivo.list'>[0],
  showModal: boolean,
}) {
  const [show, setShow] = useState(false)

  const context = trpc.useContext()
  const preventivoDelete = trpc.useMutation('preventivo.delete', {
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      setShow(false)
    }
  })

  useEffect(() => setShow(true), [showModal])
  if (!preventivo) return null

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Body>
          <Modal.Title>Sei sicuro di voler eliminare il preventivo?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger'
            onClick={() => preventivoDelete.mutate({ id: preventivo.id })}
          >
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
