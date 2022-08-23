
import { useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'
 
export default function TableRowPrev({
    rowId,
    rowIdProd,
    rowPriceProdotto,
    rowPers,
    rowPricePers,
    rowProvvSC,
    rowProvvRapp,
    rowProvvComm,
    rowTot,
    onClickDelete,
    onClickEdit,
}: {
    rowId: number,
    rowIdProd: number,
    rowPriceProdotto: number,
    rowPers: number,
    rowPricePers: number,
    rowProvvSC: number,
    rowProvvRapp: number,
    rowProvvComm: number,
    rowTot: number,
    onClickEdit: (row_id: number, row_id_prod: number, row_pers: number) => void,
    onClickDelete: (row_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newPers, setNewPers] = useState(rowPers)
 
    const editRow = (id: number, idProd: number, idPers: number) => {
        onClickEdit(id, idProd, idPers)
        setIsEditable(false)
    }
 
    return (
        <tr key={rowId}>
            <td>{rowIdProd}</td>
            <td>{Number(rowPriceProdotto)}</td>
            <td>{rowPers}</td>
            <td>{Number(rowPricePers)}</td>
            <td>{Number(rowProvvSC)}</td>
            <td>{Number(rowProvvRapp)}</td>
            <td>{Number(rowProvvComm)}</td>
            <td>{Number(rowTot)}</td>
             {/*input text del prezzo di un prodotto che è scrivibile solo quando viene fatto doppio click*/}
           {
           /*
            <td onDoubleClick={() => setIsEditable(true)}>
               
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
            */
                }
            <td>
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga
              */}
                <ButtonGroup hidden={!isEditable}>
                    <Button name='EditButton'
                        variant="outline-warning"
                      //  onClick={() => editRow(rowId, newPrice)}
                    >
                        Edit<FcSupport />
                    </Button>
                    <Button name='UndoButton' variant="outline-primary"
                        onClick={() => {
                          //  setNewPrice(Number(rowPrice))
                            setIsEditable(false)
                        }}
                    >
                        Undo<FcCancel />
                    </Button>
                </ButtonGroup>
                <ButtonGroup hidden={isEditable}>
                    <Button name="DeleteButton" variant="outline-danger"
                        onClick={() => onClickDelete(rowId)}
                    >
                        Delete<FcCancel />
                    </Button>
                </ButtonGroup>
            </td>
        </tr >
    )
}
