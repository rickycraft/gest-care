import { useState } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { trpc } from 'utils/trpc'
import { MdReceipt } from 'react-icons/md'
import ButtonTooltip from 'components/utils/ButtonTooltip'


export default function ModalOptions({
  prevId,
}: {
  prevId: number,
}) {
  const [show, setShow] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const optionQuery = trpc.useQuery(['preventivo.opts.list', { prevId }])
  const optionEdit = trpc.useMutation('preventivo.opts.edit', {
    onSuccess() {
      optionQuery.refetch()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  })

  if (!optionQuery.isSuccess) return <Spinner animation="border" />
  if (optionQuery.data === null) return <Spinner animation="border" />

  return (
    <>
      {/*className='d-flex justify-content-end'*/}
      {/*className='position-absolute top-50 end-0 translate-middle-x'*/}
      <div className='d-flex justify-content-end'>
        <ButtonTooltip tooltip="opzioni preventivo">
          <Button variant="primary" size='lg' className="rounded-circle m-0" onClick={() => setShow(true)} style={{ display: "block" }}>
            <MdReceipt />
          </Button>
        </ButtonTooltip>
      </div>
      <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica le opzioni</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {optionQuery.data.map((opt) => (
            <Form.Check key={opt.id}>
              <Form.Check.Input type="checkbox" defaultChecked={opt.selected} disabled={optionEdit.isLoading || optionQuery.isLoading}
                onChange={(e) => optionEdit.mutate({
                  prevId: prevId,
                  optionId: opt.id,
                  selected: e.target.checked as boolean,
                })} />
              <Form.Check.Label>{opt.short}</Form.Check.Label>
            </Form.Check>
          ))}
        </Modal.Body>
        {showSuccess &&
          <Modal.Footer className='d-block'>
            <Alert variant='success' className="text-center p-1">
              opzioni modificate con successo
            </Alert>
          </Modal.Footer>
        }
      </Modal>
    </>
  )
}