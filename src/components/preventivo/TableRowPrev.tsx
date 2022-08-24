
import { PreventivoRow } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { FcCancel, FcSupport } from 'react-icons/fc'
import { updatePrevRow } from 'server/routers/preventivo_row'
import { inferQueryOutput } from 'utils/trpc'

export default function TableRowPrev({
    row,
    prodList,
    persList,
    onClickDelete,
    onClickEdit,
}: {
    row: PreventivoRow,
    prodList: inferQueryOutput<'prodotto.list'>,
    persList: inferQueryOutput<'pers.list'>,
    onClickEdit: (row: updatePrevRow) => void,
    onClickDelete: (row_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newRow, setNewRow] = useState(row)

    const total = useMemo(() => Number(row.provvigioneComm) + Number(row.provvigioneRappre) + Number(row.provvigioneSC), [row])
    const prodotto = useMemo(() => prodList.find(p => p.id === newRow.prodottoId), [prodList, newRow])
    const pers = useMemo(() => persList.find(p => p.id === newRow.personalizzazioneId), [persList, newRow])

    const editRow = () => {
        console.log('editRow')
        setIsEditable(false)
    }

    if (!prodotto || !pers) {
        return <Spinner animation="border" />
    }

    return (
        <tr key={row.id}>
            <td>T PRod</td>
            <td>{Number(prodotto.prezzo)}</td>
            <td>T Prev</td>
            <td>{Number(pers.prezzo)}</td>
            <td>{Number(row.provvigioneSC)}</td>
            <td>{Number(row.provvigioneRappre)}</td>
            <td>{Number(row.provvigioneComm)}</td>
            <td>{total}</td>
            <td>Bottone Edit
                {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga

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
                        onClick={() => onClickDelete(row.id)}
                    >
                        Delete<FcCancel />
                    </Button>
                </ButtonGroup>
                */}
            </td>
        </tr >
    )
}
