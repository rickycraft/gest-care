import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'

const ONLY_DECIMAL_REGEX = /^\d+\.?\d*$/ //regex per il check del numero prezzo (TODO: inserire che può essere anche una stringa vuota)

export default function TableRow({
    key,
    prodId,
    prodNome,
    prodPrezzoIniziale,
    isEditSuccess,
    isEditLoading,
    isDeleteLoading,
    onClickDelete,
    onClickEdit,
}: {
    key: number,
    prodId: number,
    prodNome: string,
    prodPrezzoIniziale: string,
    isEditSuccess: boolean,
    isEditLoading: boolean,
    isDeleteLoading: boolean,
    onClickEdit: (prod_id: number, prod_prezzo: number) => void,
    onClickDelete: (prod_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newPrezzo, setNewPrezzo] = useState<string>('')

    const [prezzoIsInvalid, setPrezzoIsInvalid] = useState(false)

    //check decimal prezzo
    useEffect(() => {
        if (ONLY_DECIMAL_REGEX.test(newPrezzo)) {
            setPrezzoIsInvalid(false)
        } else {
            if (isEditable) setPrezzoIsInvalid(true)
        }
    }, [isEditable, newPrezzo])

    //resetto se una query è stata mandata
    useEffect(() => {
        if (isEditSuccess) {
            setIsEditable(false)
            setNewPrezzo('')
        }
    }, [isEditSuccess, prodPrezzoIniziale])


    return (
        <tr key={key}>
            <td>{prodId}</td>
            <td>{prodNome}</td>
            <td onDoubleClick={() => {
                console.log('double click')
                if (newPrezzo.length == 0) {
                    setNewPrezzo(prodPrezzoIniziale)
                }
                setIsEditable(true)
            }}>
                {/*input text del prezzo di un prodotto che è scrivibile solo quando viene fatto doppio click
              */}
                <Form.Control
                    id={'InputPrezzo' + prodId}
                    disabled={prezzoIsInvalid}
                    value={
                        (newPrezzo.length === 0 && !isEditable) ? prodPrezzoIniziale : newPrezzo
                    }
                    readOnly={!isEditable}

                    onInput={(event) => {
                        event.preventDefault()
                        console.log('new input')
                        setNewPrezzo(event.currentTarget.value)
                    }}
                />
            </td>
            <td>
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga
              */}
                <ButtonGroup >
                    {isEditable && <Button name='EditButton'
                        // hidden={!isEditable}
                        variant="outline-warning"
                        disabled={isEditLoading || prezzoIsInvalid || !isEditable}
                        onClick={() => { !prezzoIsInvalid && onClickEdit(prodId, Number(newPrezzo)) }}
                    >
                        Edit
                        {(!isEditLoading) && <FcSupport />}
                        {(isEditLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>}
                    {isEditable && <Button name='UndoButton'
                        variant="outline-primary"
                        disabled={isEditLoading || prezzoIsInvalid || !isEditable}
                        onClick={() => {
                            //reset
                            setIsEditable(false)
                            setIsEditable(false)
                            setNewPrezzo('')
                        }}
                    >
                        Undo
                        {(!isEditLoading) && <FcCancel />}
                        {(isEditLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>}
                    {!isEditable && <Button name="DeleteButton"
                        variant="outline-danger"
                        disabled={isDeleteLoading}
                        onClick={() => onClickDelete(prodId)}
                    >
                        Delete
                        {(!isDeleteLoading) && <FcCancel />}
                        {(isDeleteLoading) && <Spinner as="span" animation="border" size="sm" role="status" />}
                    </Button>}
                </ButtonGroup>
            </td>
        </tr>
    )
}
