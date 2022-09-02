import { Decimal } from '@prisma/client/runtime'
import { useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'
import { MdDelete } from 'react-icons/md'

export default function TableRow({
    rowId,
    rowName,
    rowPrice,
    onClickDelete,
    onClickEdit,
}: {
    rowId: number,
    rowName: string,
    rowPrice: Decimal,
    onClickEdit: (row_id: number, row_prezzo: number) => void,
    onClickDelete: (row_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newPrice, setNewPrice] = useState(Number(rowPrice))

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
                    onKeyPress={(event) => { if (event.key === 'Enter') editRow(rowId, newPrice) }}
                />
            </td>
            <td>
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga
              */}
                <ButtonGroup hidden={!isEditable}>
                    <Button name='EditButton'
                        variant="outline-warning"
                        onClick={() => editRow(rowId, newPrice)}
                    >
                        Edit<FcSupport />
                    </Button>
                    <Button name='UndoButton' variant="outline-primary"
                        onClick={() => {
                            setNewPrice(Number(rowPrice))
                            setIsEditable(false)
                        }}
                    >
                        Undo<FcCancel />
                    </Button>
                </ButtonGroup>
                <ButtonGroup hidden={isEditable}>
                    <Button name="DeleteButton" variant="outline-danger"
                        onClick={() => onClickDelete(rowId)} >
                        <MdDelete />
                    </Button>
                </ButtonGroup>
            </td>
        </tr >
    )
}
