import { useEffect, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { INVALID_ID } from 'utils/constants'
import { inferQueryOutput, trpc } from 'utils/trpc'

const CLEAR_ON_CLOSE = true

export default function ModalEdit({
    preventivo,
    show,
    onHide,
}: {
    preventivo?: inferQueryOutput<'preventivo.list'>[0],
    show: boolean,
    onHide: () => void,
}) {

    const context = trpc.useContext()
    const trpcCallback = {
        onSuccess() {
            onHide()
            context.invalidateQueries(['preventivo.list'])
        }
    }
    const preventivoInsert = trpc.useMutation('preventivo.insert', trpcCallback)
    const preventivoUpdate = trpc.useMutation('preventivo.update', trpcCallback)
    const listiniQuery = trpc.useQuery(['listino.list'])

    const [listinoId, setListinoId] = useState(INVALID_ID)
    const [nomePreventivo, setNomePreventivo] = useState('')
    const [scuola, setScuola] = useState('')
    const isEditing = useMemo(() => preventivo !== undefined, [preventivo])
    const isInvalid = useMemo(() => nomePreventivo.length < 5 || scuola.length < 5 || listinoId === INVALID_ID, [nomePreventivo, scuola, listinoId])

    const setState = () => {
        if (preventivo) {
            setListinoId(preventivo.listino.id)
            setNomePreventivo(preventivo.nome)
            setScuola(preventivo.scuola)
        } else {
            setListinoId(INVALID_ID)
            setNomePreventivo('')
            setScuola('')
        }
    }
    useEffect(() => {
        if (!CLEAR_ON_CLOSE) return
        // Reset form when hiding, add delay so it doesn't reset while closing
        if (!show) setTimeout(setState, 500)
    }, [show])
    // Update form when preventivo changes
    useEffect(setState, [preventivo])

    return (
        <Modal show={show} onHide={() => onHide()} keyboard={false}>
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
                        <Form.Control.Feedback type="invalid">Il nome del preventivo è troppo corto</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="InputSelectScuola">
                        <Form.Label>Scuola</Form.Label>
                        <Form.Control
                            value={scuola}
                            isInvalid={scuola.length < 5}
                            placeholder="Nome scuola"
                            onChange={(event) => setScuola(event.currentTarget.value)}
                        />
                        <Form.Control.Feedback type="invalid">Il nome della scuola è troppo corto</Form.Control.Feedback>
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
                    disabled={isInvalid}
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
