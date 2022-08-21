import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { trpc } from 'utils/trpc'
import { number } from 'zod'

const invalidId = -1



export default function ModalPreventivo({
    preventivoId = invalidId,
    updatePreventivoList,
}: {
    preventivoId?: number,
    updatePreventivoList: () => void,
}) {
    const trpcCallback = {
        onSuccess() {
            updatePreventivoList()
        }
    }
    const preventivoInsert = trpc.useMutation('preventivo.insert', trpcCallback)

    const preventivoUpdate = trpc.useMutation('preventivo.update', trpcCallback)   //(TODO)
    const preventivoDelete = trpc.useMutation('preventivo.delete', trpcCallback)  //(TODO)

    const preventivoQuery = trpc.useQuery(['preventivo.byId', { id: preventivoId}])
   // const fornitoriQuery = trpc.useQuery(['fornitore.list'])
    const scuoleQuery = trpc.useQuery(['scuola.list']) //(TODO)
    const listiniQuery = trpc.useQuery(['listino.list'])

    const [show, setShow] = useState(false)
    const [nomePreventivo, setNomePreventivo] = useState('')
    const [listinoId, setListinoId] = useState(-1)
    const [scuolaId, setScuolaId] = useState(-1)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const isEditing = () => preventivoId !== invalidId
    const insertPreventivo = async () => { //(TO SOLVE)
        if (preventivoInsert.isLoading) return
            preventivoInsert.mutate({
            listino: listinoId,  //tipo string > number
            nome: nomePreventivo,
            scuola: scuolaId,   //tipo string > number
         })
    }

    
    const updatePreventivo = () => {
        if (preventivoUpdate.isLoading) return
        preventivoUpdate.mutate({
            id: preventivoId,
            nome: nomePreventivo,
            listino: listinoId, //tipo string > number
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
    
    const isValid = () => preventivoId != invalidId && nomePreventivo.length > 4

    useEffect(() => {
        if (!preventivoQuery.isSuccess) return
        if (preventivoQuery.data === undefined ) return

        setNomePreventivo(preventivoQuery.data.nome) //tipo string > number
        setListinoId(preventivoQuery.data.listino) //tipo string > number
        setScuolaId(preventivoQuery.data.scuola.id) //tipo string > number

    }, [preventivoQuery.isSuccess])

    useEffect(() => {
        if (preventivoId != invalidId) preventivoQuery.refetch()
        else {
            setNomePreventivo('')
            setListinoId(invalidId) //tipo string > number
            setScuolaId(invalidId)  //tipo string > number
        }
    }, [preventivoId])

    if (!scuoleQuery.isSuccess || !preventivoQuery) return <Spinner animation="border" />

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
                                isInvalid={scuolaId == invalidId} // (???)
                                value={scuolaId}
                                onChange={(event) => setScuolaId(Number(event.currentTarget.value))} //tipo string > number
                            >
                                <option value={invalidId}>Seleziona una scuola</option>
                                {scuoleQuery.data.map(element => ( // TODO
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli una scuola</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="InputSelectListino"
                        >
                            <Form.Label>Scegli il Listino</Form.Label>
                            <Form.Select
                                isInvalid={scuolaId == invalidId} // (???)
                                value={scuolaId}
                                onChange={(event) => setScuolaId(Number(event.currentTarget.value))} //tipo string > number
                            >
                                <option value={invalidId}>Seleziona una scuola</option>
                                {listiniQuery.data.map(element => ( // TODO
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Scegli un listino</Form.Control.Feedback>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger'
                       // onClick={() => deletePreventivo()}
                    >
                        Delete
                    </Button>
                    <Button variant={isEditing() ? 'warning' : 'primary'}
                        disabled={!isValid()}
                        onClick={() => {
                            if (!isValid()) return
                            if (isEditing()) updatePreventivo() //(TODO)
                            else insertPreventivo()
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
