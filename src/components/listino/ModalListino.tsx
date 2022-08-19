import React, { useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'

export default function ModalListino() {
    const listinoInsert = trpc.useMutation('listino.insert', {
        onSuccess() {
            trpc.useContext().invalidateQueries(['listino.list'])
        }
    })
    const fornitoriQuery = trpc.useQuery(['fornitore.list'])


    const [show, setShow] = useState(false)
    const [nomeListino, setNomeListino] = useState('')
    const [fornitoreId, setFornitoreId] = useState(-1)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const insertListino = async () => {
        if (listinoInsert.isLoading) return
        listinoInsert.mutate({
            nome: nomeListino,
            fornitore: fornitoreId,
        })
    }
    const isValid = () => fornitoreId != 0 && nomeListino.length > 4

    if (!fornitoriQuery.isSuccess) return <Spinner animation="border" />

    return (
        <>
            <Button variant="primary" className="rounded-circle" onClick={handleShow}>+</Button>
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
                                isInvalid={fornitoreId == -1}
                                value={fornitoreId}
                                onChange={(event) => setFornitoreId(Number(event.currentTarget.value))}
                            >
                                <option value={-1}>Seleziona un fornitore</option>
                                {fornitoriQuery.data.map(element => (
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli un fornitore</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                        disabled={!isValid()}
                        onClick={() => {
                            if (!isValid()) return
                            insertListino()
                            handleClose()
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
