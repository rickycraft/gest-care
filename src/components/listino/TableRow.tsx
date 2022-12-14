import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { MdDelete, MdOutlineCheck, MdOutlineUndo } from 'react-icons/md'

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
    onClickEdit: (row: { id: number, prezzo: number }) => void,
    onClickDelete: (row: { id: number }) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newPrice, setNewPrice] = useState(rowPrice)
    const isEdited = useMemo(() => rowPrice !== newPrice, [rowPrice, newPrice])

    const editRow = (id: number, prezzo: number) => {
        onClickEdit({ id, prezzo })
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
                    value={newPrice}
                    disabled={!isEditable}
                    onInput={(event) => {
                        event.preventDefault()
                        setNewPrice(Number(event.currentTarget.value))
                    }}
                    onKeyUp={(event) => { if (event.key === 'Enter') editRow(rowId, newPrice) }}
                />
            </td>
            <td className='d-flex flex-nowrap'>
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga
              */}
                {isEditable ? (
                    <>
                        <ButtonTooltip tooltip="Salva Modifiche">
                            <Button name='EditButton' variant="outline-success me-1 me-lg-2" disabled={!isEdited}
                                onClick={() => editRow(rowId, newPrice)}
                            ><MdOutlineCheck /></Button>
                        </ButtonTooltip>
                        <ButtonTooltip tooltip="Annulla Modifiche">
                            <Button name='UndoButton' variant="outline-secondary"
                                onClick={() => {
                                    setNewPrice(rowPrice)
                                    setIsEditable(false)
                                }}
                            ><MdOutlineUndo /></Button>
                        </ButtonTooltip>
                    </>
                ) : (
                    <ButtonTooltip tooltip="Elimina">
                        <Button hidden={isEditable} name="DeleteButton" variant="outline-danger"
                            onClick={() => onClickDelete({ id: rowId })} >
                            <MdDelete />
                        </Button>
                    </ButtonTooltip>
                )}
            </td>
        </tr >
    )
}
