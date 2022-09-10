import { useEffect, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { INVALID_ID } from 'utils/constants'
import { inferQueryOutput, trpc } from 'utils/trpc'

export default function ModalEdit({
    preventivo,
    showModal,
}: {
    preventivo?: inferQueryOutput<'preventivo.list'>[0],
    showModal: number,
}) {
    const [show, setShow] = useState(false)

    const context = trpc.useContext()
    const trpcCallback = {
        onSuccess() {
            context.invalidateQueries(['preventivo.list'])
            setShow(false)
        }
    }
    const preventivoInsert = trpc.useMutation('preventivo.insert', trpcCallback)
    const preventivoUpdate = trpc.useMutation('preventivo.update', trpcCallback)
    const listiniQuery = trpc.useQuery(['listino.list'])

    const [listinoId, setListinoId] = useState(INVALID_ID)
    const [nomePreventivo, setNomePreventivo] = useState('')
    const [scuola, setScuola] = useState('')
    const isEditing = useMemo(() => preventivo !== undefined, [preventivo])

    useEffect(() => {
        if (preventivo) {
            setListinoId(preventivo.listino.id)
            setNomePreventivo(preventivo.nome)
            setScuola(preventivo.scuola)
        } else {
            setListinoId(INVALID_ID)
            setNomePreventivo('')
            setScuola('')
        }
    }, [preventivo])
    useEffect(() => { if (showModal > 0) setShow(true) }, [showModal])

    const isValid = useMemo(() => (scuola !== '' && listinoId !== INVALID_ID && nomePreventivo.length > 4), [scuola, listinoId, nomePreventivo])

    return (
        <Modal show={show} onHide={() => setShow(false)} keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Modifica" : "Aggiungi"} preventivo</Modal.Title>
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
                        <Form.Label>Scuola</Form.Label>
                        <Form.Control
                            value={scuola}
                            isInvalid={scuola.length < 5}
                            placeholder="Nome scuola"
                            onChange={(event) => setScuola(event.currentTarget.value)}
                        />
                        <Form.Control.Feedback type="invalid">Scegli una scuola</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="InputSelectListino">
                        <Form.Label>Scegli il Listino</Form.Label>
                        <Form.Select
                            disabled={isEditing}
                            isInvalid={listinoId == INVALID_ID}
                            value={listinoId}
                            onChange={(event) => setListinoId(Number(event.currentTarget.value))}
                        >
                            <option value={INVALID_ID}>Seleziona un listino</option>
                            {listiniQuery.data?.map(element => (
                                <option key={element.id} value={element.id}>{element.nome}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Scegli un listino</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={isEditing ? 'success' : 'primary'}
                    disabled={!isValid}
                    onClick={() => {
                        if (preventivo) {
                            preventivoUpdate.mutate({ id: preventivo.id, nome: nomePreventivo, scuola })
                        } else {
                            preventivoInsert.mutate({ listino: listinoId, nome: nomePreventivo, scuola })
                        }
                    }}
                >
                    {isEditing ? 'Salva Modifiche' : 'Aggiungi'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
