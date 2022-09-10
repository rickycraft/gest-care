import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useEffect, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { MdEdit } from 'react-icons/md'
import { INVALID_ID } from 'utils/constants'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalListino({
    listino,
}: {
    listino?: inferQueryOutput<'listino.list'>[0],
}) {
    const context = trpc.useContext()
    const trpcCallback = {
        onSuccess() { context.invalidateQueries(['listino.list']) }
    }
    const listinoInsert = trpc.useMutation('listino.insert', trpcCallback)
    const listinoUpdate = trpc.useMutation('listino.update', trpcCallback)
    const listinoDelete = trpc.useMutation('listino.delete', trpcCallback)
    const fornitoriQuery = trpc.useQuery(['fornitore.list'])

    const [show, setShow] = useState(false)
    const [nomeListino, setNomeListino] = useState('')
    const [fornitoreId, setFornitoreId] = useState(INVALID_ID)
    const isValid = useMemo(() => fornitoreId != INVALID_ID && nomeListino.length > 4, [fornitoreId, nomeListino])
    const isNew = useMemo(() => listino === undefined, [listino])
    useEffect(() => {
        if (listino) {
            setNomeListino(listino.nome)
            setFornitoreId(listino.fornitore.id)
        } else {
            setNomeListino('')
            setFornitoreId(INVALID_ID)
        }
    }, [listino])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <ButtonTooltip tooltip={isNew ? 'aggiungi listino' : 'modifica listino'} >
                <Button variant="primary" className="rounded-circle" onClick={handleShow}>
                    {isNew ? '+' : <MdEdit />}
                </Button>
            </ButtonTooltip>
            <Modal show={show} onHide={handleClose} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew ? 'Aggiungi un nuovo' : 'Modifica un'} listino</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form per aggiungere un nuovo listino: nome listino + id fornitore */}
                    <Form>
                        <Form.Group className="mb-3" controlId="InputTextNomeListino">
                            <Form.Label>Nome listino</Form.Label>
                            <Form.Control
                                value={nomeListino}
                                isInvalid={nomeListino.length < 5}
                                placeholder="Nome"
                                autoFocus
                                onChange={(event) => setNomeListino(event.currentTarget.value)}
                            />
                            <Form.Control.Feedback type="invalid">Il nome deve essere di almeno 5 caratteri</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="InputSelectFornitore"
                        >
                            <Form.Label>Scegli fornitore</Form.Label>
                            <Form.Select
                                isInvalid={fornitoreId == INVALID_ID}
                                value={fornitoreId}
                                onChange={(event) => setFornitoreId(Number(event.currentTarget.value))}
                            >
                                <option value={INVALID_ID}>Seleziona un fornitore</option>
                                {fornitoriQuery.data?.map(element => (
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli un fornitore</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' hidden={isNew} onClick={() => {
                        if (listino == null) return
                        listinoDelete.mutate({ id: listino.id })
                        handleClose()
                    }}>
                        Elimina
                    </Button>
                    <Button variant={isNew ? 'primary' : 'success'}
                        disabled={!isValid}
                        onClick={() => {
                            if (listino == null) listinoInsert.mutate({ nome: nomeListino, fornitore: fornitoreId })
                            else listinoUpdate.mutate({ id: listino.id, nome: nomeListino })
                            handleClose()
                        }}
                    >
                        {isNew ? 'Aggiungi' : 'Salva Modifiche'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
