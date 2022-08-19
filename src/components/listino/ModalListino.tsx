import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

const invalidId = -1



export default function ModalListino({
    listinoId = invalidId,
    updateListinoList,
}: {
    listinoId?: number,
    updateListinoList: () => void,
}) {
    const trpcCallback = {
        onSuccess() {
            updateListinoList()
        }
    }
    const listinoInsert = trpc.useMutation('listino.insert', trpcCallback)
    const listinoUpdate = trpc.useMutation('listino.update', trpcCallback)
    const listinoDelete = trpc.useMutation('listino.delete', trpcCallback)
    const listinoQuery = trpc.useQuery(['listino.byId', { id: listinoId }])
    const fornitoriQuery = trpc.useQuery(['fornitore.list'])

    const [show, setShow] = useState(false)
    const [nomeListino, setNomeListino] = useState('')
    const [fornitoreId, setFornitoreId] = useState(invalidId)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const isEditing = () => listinoId !== invalidId
    const insertListino = async () => {
        if (listinoInsert.isLoading) return
        listinoInsert.mutate({
            nome: nomeListino,
            fornitore: fornitoreId,
        })
    }
    const updateListino = () => {
        if (listinoUpdate.isLoading) return
        listinoUpdate.mutate({
            id: listinoId,
            nome: nomeListino,
            fornitore: fornitoreId,
        })
    }
    const deleteListino = () => {
        if (listinoDelete.isLoading) return
        listinoDelete.mutate({
            id: listinoId,
        })
        handleClose()
    }
    const isValid = () => fornitoreId != invalidId && nomeListino.length > 4

    useEffect(() => {
        if (!listinoQuery.isSuccess) return
        if (listinoQuery.data === undefined) return

        setNomeListino(listinoQuery.data.nome)
        setFornitoreId(listinoQuery.data.fornitore.id)
    }, [listinoQuery.isSuccess])

    useEffect(() => {
        if (listinoId != invalidId) listinoQuery.refetch()
        else {
            setNomeListino('')
            setFornitoreId(invalidId)
        }
    }, [listinoId])

    if (!fornitoriQuery.isSuccess || !listinoQuery) return <Spinner animation="border" />

    return (
        <>
            <Button variant="primary" className="rounded-circle" onClick={handleShow}>
                {isEditing() ? '✎' : '+'}
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi un nuovo listino</Modal.Title>
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
                                isInvalid={fornitoreId == invalidId}
                                value={fornitoreId}
                                onChange={(event) => setFornitoreId(Number(event.currentTarget.value))}
                            >
                                <option value={invalidId}>Seleziona un fornitore</option>
                                {fornitoriQuery.data.map(element => (
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli un fornitore</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger'
                        onClick={() => deleteListino()}
                    >
                        Delete
                    </Button>
                    <Button variant={isEditing() ? 'warning' : 'primary'}
                        disabled={!isValid()}
                        onClick={() => {
                            if (!isValid()) return
                            if (isEditing()) updateListino()
                            else insertListino()
                            handleClose()
                        }}
                    >
                        {isEditing() ? 'Edit' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
