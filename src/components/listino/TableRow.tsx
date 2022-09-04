import { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'
import { MdCreate, MdDeleteOutline, MdDownload, MdLock, MdLockOpen, MdDelete, MdOutlineCheck, MdOutlineClear } from 'react-icons/md'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function TableRow({
    rowId,
    rowName,
    rowPrice,
    onClickDelete,
    onClickEdit,
}: {
    rowId: number,
    rowName: string,
    rowPrice: number,
    onClickEdit: (row_id: number, row_prezzo: number) => void,
    onClickDelete: (row_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newPrice, setNewPrice] = useState(rowPrice)

    const editRow = (id: number, price: number) => {
        onClickEdit(id, price)
        setIsEditable(false)
    }

    return (
        <tr key={rowId}>
            <td>{rowName}</td>
            <td onDoubleClick={() => setIsEditable(true)}>
                {/*input text del prezzo di un prodotto che è scrivibile solo quando viene fatto doppio click*/}
                <Form.Control
                    id={'InputPrezzo' + rowId}
                    type="number"
                    value={(newPrice == 0) ? '' : newPrice}
                    disabled={!isEditable}
                    onInput={(event) => {
                        event.preventDefault()
                        setNewPrice(Number(event.currentTarget.value))
                    }}
                    onKeyUp={(event) => { if (event.key === 'Enter') editRow(rowId, newPrice) }}
                />
            </td>
            <td>
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga
              */}
                <ButtonGroup hidden={!isEditable}>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Salva Modifiche</Tooltip>}>
                <Button name='EditButton'
                        variant="outline-success"
                        onClick={() => editRow(rowId, newPrice)}
                    >
                         <MdOutlineCheck />
                    </Button>
                </OverlayTrigger>


                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Annulla Modifiche</Tooltip>}>
                    <Button name='UndoButton' variant="outline-secondary"
                        onClick={() => {
                            setNewPrice(rowPrice)
                            setIsEditable(false)
                        }}
                    ><MdOutlineClear />
                    </Button>
                </OverlayTrigger>

                </ButtonGroup>
                <ButtonGroup hidden={isEditable}>

                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Elimina </Tooltip>}>
                    <Button name="DeleteButton" variant="outline-danger"
                        onClick={() => onClickDelete(rowId)} >
                        <MdDelete />
                    </Button>
                </OverlayTrigger>
                </ButtonGroup>
            </td>
        </tr >
    )
}
