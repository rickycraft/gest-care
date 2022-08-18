import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModalListino({
    fornitoriList,
    onClickSave,
    label,
    isSaveLoading,
}: {
    fornitoriList: { nome: string; id: number; }[],
    onClickSave: (nomeListino: string, id_fornitore: number) => void,
    label: string,
    isSaveLoading: boolean,
}) {
    const [show, setShow] = useState(false);
    const [fornitore, setFornitore] = useState(0)
    const [nomeListino, setNomeListino] = useState('')
    const [isFornitoreInvalid, setIsFornitoreInvalid] = useState(false)
    const [isNomeInvalid, setIsNomeInvalid] = useState(false)


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {label}
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
                            <Form.Label>New nome listino</Form.Label>
                            <Form.Control
                                isInvalid={isNomeInvalid}
                                placeholder="new nome listino"
                                autoFocus
                                onChange={(event) => {
                                    if (event?.currentTarget.value.length === 0) {
                                        setIsNomeInvalid(true)
                                        setNomeListino(event?.currentTarget.value)
                                    }
                                    else {
                                        setIsNomeInvalid(false)
                                        setNomeListino(event?.currentTarget.value)
                                    }
                                }}
                            />
                            <Form.Control.Feedback type="invalid" >
                                Please, type a new name
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="InputSelectFornitore"
                        >
                            <Form.Label>Scegli fornitore</Form.Label>
                            <Form.Select
                                isInvalid={isFornitoreInvalid}
                                value={fornitore}
                                onChange={(event) => {
                                    if (Number(event.currentTarget.value) < 0) {
                                        setIsFornitoreInvalid(true)
                                        setFornitore(Number(event.currentTarget.value))
                                    }
                                    else {
                                        setIsFornitoreInvalid(false)
                                        setFornitore(Number(event.currentTarget.value))
                                    }
                                }}
                            >
                                <option value='-1'>Seleziona un fornitore</option> {/*TODO da cambiare il controllo '-1' */}
                                {fornitoriList.map(element => (
                                    <option key={element.id} value={element.id}>{element.nome}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" >
                                Please, choose a fornitore
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                        onClick={() => {
                            if (!isFornitoreInvalid && !isNomeInvalid) {
                                onClickSave(nomeListino, fornitore);
                                handleClose
                            }
                        }}
                    >
                        {/* TODO: non funziona handleClose */}
                        Save
                        {(isSaveLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
