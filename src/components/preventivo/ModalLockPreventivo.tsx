import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalLock({
  preventivo,
  show,
  onHide,
}: {
  preventivo?: inferQueryOutput<'preventivo.list'>[0],
  show: boolean,
  onHide: () => void,
}) {

  const context = trpc.useContext()
  const trpcCallback = {
    onSuccess() {
      context.invalidateQueries(['preventivo.list'])
      onHide()
    }
  }
  const preventivoLock = trpc.useMutation('preventivo.lock', trpcCallback)
  const preventivoUnlock = trpc.useMutation('preventivo.unlock', trpcCallback)

  if (!preventivo) return null

  return (
    <>
      <Modal show={show} onHide={() => onHide()} keyboard={false}>
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
