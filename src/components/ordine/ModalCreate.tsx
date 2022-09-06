import { useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { trpc } from 'utils/trpc'
import ButtonTooltip from 'components/utils/ButtonTooltip'

const invalidId = -1

export default function ModalCreate() {
  const [show, setShow] = useState(false)
  const [preventivoId, setPreventivo] = useState(invalidId)

  const context = trpc.useContext()
  const ordineCreate = trpc.useMutation('ordine.create', {
    onSuccess() {
      context.invalidateQueries(['ordine.list'])
      setShow(false)
    },
  })
  const ordineQuery = trpc.useQuery(['ordine.list'])
  const preventivoQuery = trpc.useQuery(['preventivo.list'])

  if (!preventivoQuery.isSuccess || !ordineQuery.isSuccess) return <Spinner animation="border" />

  return (
    <>
      <div className='d-flex justify-content-end'>
      <ButtonTooltip tooltip="Aggiungi ordine">
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
                <Form.Label>Nome ordine</Form.Label>
                <Form.Select value={preventivoId}
                  onChange={(event) => setPreventivo(Number(event.currentTarget.value))}>
                  <option value={invalidId}>Seleziona un preventivo</option>
                  {preventivoQuery.data
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

            <Button variant="primary" onClick={() => ordineCreate.mutate({ preventivoId })} disabled={preventivoId == invalidId}>
              Salva
            </Button>


          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}