import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { INVALID_ID } from 'utils/constants'
import { trpc } from 'utils/trpc'

export default function ModalCreate() {
  const [show, setShow] = useState(false)
  const [preventivoId, setPreventivo] = useState(INVALID_ID)

  const context = trpc.useContext()
  const ordineCreate = trpc.useMutation('ordine.create', {
    onSuccess() {
      context.invalidateQueries(['ordine.list'])
      setShow(false)
    },
  })
  const ordineQuery = trpc.useQuery(['ordine.list'])
  const preventivoQuery = trpc.useQuery(['preventivo.list', { search: '' }])

  return (
    <>
      <div className='d-flex justify-content-end'>
        <ButtonTooltip tooltip="aggiungi ordine">
          <Button variant="primary" size='lg' className="rounded-circle" onClick={() => setShow(true)}>
            +
          </Button>
        </ButtonTooltip>
        <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi un nuovo ordine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formOrdine">
                <Form.Select
                  isInvalid={preventivoId === INVALID_ID}
                  value={preventivoId}
                  onChange={(event) => setPreventivo(Number(event.currentTarget.value))}>
                  <option value={INVALID_ID}>Seleziona un preventivo</option>
                  {preventivoQuery.isSuccess && ordineQuery.isSuccess && preventivoQuery.data
                    .filter(p => p.locked)
                    .filter(p => !ordineQuery.data.find(o => o.preventivo.id === p.id))
                    .map(preventivo => (
                      <option key={preventivo.id} value={preventivo.id}>{preventivo.nome}</option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => ordineCreate.mutate({ preventivoId })}
              disabled={preventivoId == INVALID_ID}
            >
              AGGIUNGI
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}