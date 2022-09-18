import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { trpc } from 'utils/trpc'

export default function ModalDuplicate(
  { idPreventivo, _nomePreventivo, show, onHide }:
    {
      idPreventivo: number,
      _nomePreventivo?: string,
      show: boolean,
      onHide: () => void
    }
) {
  const router = useRouter()
  const context = trpc.useContext()
  const [nomePreventivo, setNomePreventivo] = useState(_nomePreventivo ?? '')

  const preventivoDuplicate = trpc.useMutation('preventivo.duplicate', {
    onSuccess(data) {
      context.prefetchQuery(['preventivo.byId', { id: data.id }])
      context.invalidateQueries(['preventivo.list'])
      router.push(`/preventivo/${data.id}`)
      onHide()
    }
  })

  useEffect(() => {
    // when closing
    if (!show) setNomePreventivo(_nomePreventivo ?? '')
  }, [show])

  return (
    <Modal show={show} onHide={onHide} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          Duplica preventivo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="InputTextNomePreventivo">
          <Form.Label>Nome preventivo</Form.Label>
          <Form.Control
            value={nomePreventivo}
            isInvalid={nomePreventivo.length < 5 || nomePreventivo == _nomePreventivo}
            placeholder="Nome"
            autoFocus
            onChange={(event) => setNomePreventivo(event.currentTarget.value)}
          />
          <Form.Control.Feedback type="invalid">Il nome del preventivo non è valido</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          className='me-0'
          onClick={() => preventivoDuplicate.mutate({
            id: idPreventivo,
            nome: nomePreventivo
          })}
        >
          DUPLICA
        </Button>
      </Modal.Footer>
    </Modal>
  )
}