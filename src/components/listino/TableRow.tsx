import { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'
import { MdCreate, MdDeleteOutline, MdDownload, MdLock, MdLockOpen, MdDelete, MdOutlineCheck, MdOutlineClear } from 'react-icons/md'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import ButtonTooltip from 'components/utils/ButtonTooltip'

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
                
                <span className='d-flex flex-nowrap' >
                    <ButtonTooltip tooltip="Salva Modifiche">
                        <Button name='EditButton'
                            variant="outline-success me-1 me-lg-2"
                            hidden={!isEditable}
                            onClick={() => editRow(rowId, newPrice)}
                        >
                            <MdOutlineCheck />
                        </Button>
                    </ButtonTooltip>


                    <ButtonTooltip tooltip="Annulla Modifiche">
                        <Button name='UndoButton' variant="outline-secondary"
                            onClick={() => {
                                setNewPrice(rowPrice)
                                setIsEditable(false)
                            }}
                            hidden={!isEditable}
                        ><MdOutlineClear />
                        </Button>
                    </ButtonTooltip>
                </span>
              
                <span className='d-flex flex-nowrap' >
                    <ButtonTooltip tooltip="Elimina">
                        <Button hidden={isEditable} name="DeleteButton" variant="outline-danger"
                            onClick={() => onClickDelete(rowId)} >
                            <MdDelete />
                        </Button>
                    </ButtonTooltip>
                </span>
            </td>
        </tr >
    )
}
