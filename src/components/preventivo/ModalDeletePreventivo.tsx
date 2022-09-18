import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalDelete({
  preventivo,
  show,
  onHide,
}: {
  preventivo?: inferQueryOutput<'preventivo.list'>[0],
  show: boolean,
  onHide: () => void,
}) {

  const context = trpc.useContext()
  const preventivoDelete = trpc.useMutation('preventivo.delete', {
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      onHide()
    }
  })

  if (!preventivo) return null

  return (
    <>
      <Modal show={show} onHide={() => onHide()} keyboard={false}>
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
