import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

const invalidId = -1

export default function ModalPreventivo({
    preventivoId = invalidId,
    showModal,
    updatePreventivoList,
}: {
    preventivoId?: number,
    showModal: boolean
    updatePreventivoList: () => void,
}) {
    const trpcCallback = {
        onSuccess() {
            updatePreventivoList()
        }
    }
    const preventivoInsert = trpc.useMutation('preventivo.insert', trpcCallback)
    const preventivoDelete = trpc.useMutation('preventivo.delete', trpcCallback)
    const preventivoUpdate = trpc.useMutation('preventivo.update', {
        onSuccess() {
            preventivoQuery.refetch()
            updatePreventivoList()
        }
    })

    const preventivoQuery = trpc.useQuery(['preventivo.byId', { id: preventivoId }])
    const scuoleQuery = trpc.useQuery(['scuola.list'])
    const listiniQuery = trpc.useQuery(['listino.list'])

    const [show, setShow] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const [nomePreventivo, setNomePreventivo] = useState('')
    const [listinoId, setListinoId] = useState(invalidId)
    const [scuolaId, setScuolaId] = useState(invalidId)

    const openModal = () => {
        setEditing(false)
        resetFields()
        setShow(true)
    }
    const handleClose = () => setShow(false)
    const setFields = () => {
        if (!preventivoQuery.isSuccess || preventivoQuery.data === null) return
        setNomePreventivo(preventivoQuery.data.nome)
        setListinoId(preventivoQuery.data.listinoId)
        setScuolaId(preventivoQuery.data.scuolaId)
    }
    const resetFields = () => {
        setNomePreventivo('')
        setListinoId(invalidId)
        setScuolaId(invalidId)
    }
    const isValid = () => (scuolaId !== invalidId && listinoId !== invalidId && nomePreventivo.length > 4)

    const insertPreventivo = async () => {
        if (preventivoInsert.isLoading) return
        preventivoInsert.mutate({
            listino: listinoId,
            nome: nomePreventivo,
            scuola: scuolaId,
        })
    }
    const updatePreventivo = () => {
        if (preventivoUpdate.isLoading) return
        preventivoUpdate.mutate({
            id: preventivoId,
            nome: nomePreventivo,
            listino: listinoId,
            scuola: scuolaId,
        })
    }
    const deletePreventivo = () => {
        if (preventivoDelete.isLoading) return
        preventivoDelete.mutate({
            id: preventivoId,
        })
        handleClose()
    }

    useEffect(() => {
        resetFields()
        setFields()
    }, [preventivoQuery.isSuccess])

    useEffect(() => {
        if (preventivoId === invalidId) return
        // check for data refresh
        setFields()
        setEditing(true)
        setShow(true)
    }, [showModal])
    useEffect(() => {
        if (preventivoId === invalidId) return
        preventivoQuery.refetch()
    }, [preventivoId])

    if (!scuoleQuery.isSuccess || !preventivoQuery.isSuccess || !listiniQuery.isSuccess) return <Spinner animation="border" />

    return (
        <>
            <div className='d-flex justify-content-end'>
                <Button variant="primary" size='lg' className="rounded-circle" onClick={openModal}>
                    +
                </Button>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi un nuovo preventivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form per aggiungere un nuovo preventivo: servono nome preventivo, id scuola e id listino */}
                    <Form>
                        <Form.Group className="mb-3" controlId="InputTextNomePreventivo">
                            <Form.Label>Nome preventivo</Form.Label>
                            <Form.Control
                                value={nomePreventivo}
                                isInvalid={nomePreventivo.length < 5}
                                placeholder="Nome"
                                autoFocus
                                onChange={(event) => setNomePreventivo(event.currentTarget.value)}
                            />
                            <Form.Control.Feedback type="invalid">Il nome deve essere di almeno 5 caratteri</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="InputSelectScuola"
                        >
                            <Form.Label>Scegli la scuola</Form.Label>
                            <Form.Select
                                isInvalid={scuolaId == invalidId}
                                value={scuolaId}
                                onChange={(event) => setScuolaId(Number(event.currentTarget.value))}
                            >
                                <option value={invalidId}>Seleziona una scuola</option>
                                {scuoleQuery.data.map(element => (
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli una scuola</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="InputSelectListino"
                        >
                            <Form.Label>Scegli il Listino</Form.Label>
                            <Form.Select
                                isInvalid={listinoId == invalidId}
                                value={listinoId}
                                onChange={(event) => setListinoId(Number(event.currentTarget.value))}
                            >
                                <option value={invalidId}>Seleziona un listino</option>
                                {listiniQuery.data.map(element => ( // TODO
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli un listino</Form.Control.Feedback>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => deletePreventivo()} hidden={!isEditing}>
                        Delete
                    </Button>
                    <Button variant={isEditing ? 'warning' : 'primary'}
                        disabled={!isValid()}
                        onClick={() => {
                            if (!isValid()) return
                            if (isEditing) updatePreventivo()
                            else insertPreventivo()
                            handleClose()
                        }}
                    >
                        {isEditing ? 'Edit' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
