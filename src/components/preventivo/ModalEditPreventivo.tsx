import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

const invalidId = -1

export default function ModalEdit({
    preventivoId = invalidId,
    showModal,
}: {
    preventivoId?: number,
    showModal: boolean
}) {
    const [show, setShow] = useState(false)

    const context = trpc.useContext()
    const trpcCallback = {
        onSuccess() {
            context.invalidateQueries(['preventivo.byId', { id: preventivoId }])
            context.invalidateQueries(['preventivo.list'])
            setShow(false)
        }
    }
    const preventivoInsert = trpc.useMutation('preventivo.insert', trpcCallback)
    const preventivoUpdate = trpc.useMutation('preventivo.update', trpcCallback)
    const preventivoQuery = trpc.useQuery(['preventivo.byId', { id: preventivoId }])
    const listiniQuery = trpc.useQuery(['listino.list'])

    const [isEditing, setEditing] = useState(false)
    const [nomePreventivo, setNomePreventivo] = useState('')
    const [listinoId, setListinoId] = useState(invalidId)
    const [scuola, setScuola] = useState('')

    const openModal = () => {
        setEditing(false)
        resetFields()
        setShow(true)
    }
    const setFields = () => {
        if (!preventivoQuery.isSuccess || preventivoQuery.data === null) return
        setNomePreventivo(preventivoQuery.data.nome)
        setListinoId(preventivoQuery.data.listinoId)
        setScuola(preventivoQuery.data.scuola)
    }
    const resetFields = () => {
        setNomePreventivo('')
        setListinoId(invalidId)
        setScuola('')
    }
    const isValid = () => (scuola !== '' && listinoId !== invalidId && nomePreventivo.length > 4)

    const insertPreventivo = async () => {
        if (preventivoInsert.isLoading) return
        preventivoInsert.mutate({
            listino: listinoId,
            nome: nomePreventivo,
            scuola: scuola,
        })
    }
    const updatePreventivo = () => {
        if (preventivoUpdate.isLoading) return
        preventivoUpdate.mutate({
            id: preventivoId,
            nome: nomePreventivo,
            listino: listinoId,
            scuola: scuola,
        })
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

    if (!preventivoQuery.isSuccess || !listiniQuery.isSuccess) return <Spinner animation="border" />

    return (
        <>
            <div className='d-flex justify-content-end'>
                <Button variant="primary" size='lg' className="rounded-circle" onClick={openModal}>
                    +
                </Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
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
                        <Form.Group className="mb-3" controlId="InputSelectScuola">
                            <Form.Control
                                value={scuola}
                                isInvalid={scuola.length < 5}
                                placeholder="Scuola"
                                onChange={(event) => setScuola(event.currentTarget.value)}
                            />
                            <Form.Control.Feedback type="invalid">Scegli una scuola</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="InputSelectListino">
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
                    <Button variant={isEditing ? 'warning' : 'primary'}
                        disabled={!isValid()}
                        onClick={() => {
                            if (!isValid()) return
                            if (isEditing) updatePreventivo()
                            else insertPreventivo()
                        }}
                    >
                        {isEditing ? 'Edit' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
