import { useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { trpc } from 'utils/trpc'
import { MdReceipt } from 'react-icons/md'

export default function ModalOptions({
  prevId,
  locked,
}: {
  prevId: number,
  locked: boolean,
}) {
  const [show, setShow] = useState(false)

  const optionQuery = trpc.useQuery(['preventivo.opts.list', { prevId }])
  const optionEdit = trpc.useMutation('preventivo.opts.edit', {
    onSuccess() {
      optionQuery.refetch()
    }
  })

  if (!optionQuery.isSuccess) return <Spinner animation="border" />
  if (optionQuery.data === null) return <Spinner animation="border" />

  return (
    <>
      <div className='d-flex justify-content-end'>
        <Button variant="primary" size='lg' className="rounded-circle" onClick={() => setShow(true)}>
          <MdReceipt />
        </Button>
      </div>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica le opzioni</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {optionQuery.data.options.map((opt) => (
            <Form.Check key={opt.id}>
              <Form.Check.Input type="checkbox" defaultChecked={opt.selected} disabled={locked}
                onChange={(e) => optionEdit.mutate({
                  prevId: prevId,
                  optionId: opt.id,
                  selected: e.target.checked as boolean,
                })} />
              <Form.Check.Label>{opt.short}</Form.Check.Label>
            </Form.Check>
          ))}
        </Modal.Body>
      </Modal>
    </>
  )
}