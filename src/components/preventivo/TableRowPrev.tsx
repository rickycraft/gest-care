
import { PreventivoRow, Prisma } from '@prisma/client'
import { useMemo, useState } from 'react'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap'
import { FcCancel, FcCheckmark, FcSafe, FcSupport } from 'react-icons/fc'
import { insertPrevRow, updatePrevRow } from 'server/routers/preventivo_row'
import { inferQueryOutput } from 'utils/trpc'

const invalidId = -1

const rowMapper = (row: PreventivoRow) => ({
    prevId: row.preventivoId,
    prodId: row.prodottoId,
    persId: row.personalizzazioneId,
    provComm: Number(row.provvigioneComm),
    provRappre: Number(row.provvigioneRappre),
    provSc: Number(row.provvigioneSC),
})

export default function TableRowPrev({
    row,
    prodList,
    persList,
    onClickInsert,
    onClickDelete,
    onClickEdit,
}: {
    row: PreventivoRow,
    prodList: inferQueryOutput<'prodotto.list'>,
    persList: inferQueryOutput<'pers.list'>,
    onClickInsert: (new_row: insertPrevRow) => void,
    onClickEdit: (row: updatePrevRow) => void,
    onClickDelete: (row_id: number) => void,
}) {
    const [isEditable, setIsEditable] = useState((row.id == invalidId) ? true : false)
    const [newRow, setNewRow] = useState(rowMapper(row))

    const total = useMemo(() => (newRow.provComm + newRow.provRappre + newRow.provSc), [row])
    const prodotto = useMemo(() => prodList.find(p => p.id === newRow.prodId) ?? { id: invalidId, nome: '', prezzo: new Prisma.Decimal(0) }, [prodList, newRow])
    const pers = useMemo(() => persList.find(p => p.id === newRow.persId) ?? { id: invalidId, nome: '', prezzo: new Prisma.Decimal(0) }, [persList, newRow])
    const isValid = useMemo(() => {
        return (Number(prodotto.prezzo) > 0 && Number(pers.prezzo) > 0
            && newRow.provComm > 0 && newRow.provRappre > 0 && newRow.provSc > 0)
    }, [newRow])
    const isNew = useMemo(() => row.id == invalidId, [row])

    if (!prodotto || !pers) {
        return <Spinner animation="border" />
    }

    return (
        <tr key={row.id} onDoubleClick={() => setIsEditable(true)}>
            <td>T PRod</td>
            <td>{Number(prodotto.prezzo)}</td>
            <td>T Prev</td>
            <td>{Number(pers.prezzo)}</td>
            <td>{newRow.provSc}</td>
            <td>{newRow.provRappre}</td>
            <td>{newRow.provComm}</td>
            <td>{total}</td>
            {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga*/}
            {<td>
                <ButtonGroup hidden={isNew}>
                    <Button name='EditButton' variant="outline-success"
                        onClick={() => {
                            onClickEdit({ id: row.id, ...newRow, })
                            setIsEditable(false)
                        }}>
                        Salva<FcSupport />
                    </Button>
                    {isEditable &&
                        <Button name='UndoButton' variant="outline-primary"
                            onClick={() => {
                                setNewRow(rowMapper(row))
                                setIsEditable(false)
                            }}>Undo<FcCancel />
                        </Button>
                    }
                    {!isEditable &&
                        <Button name="DeleteButton" variant="outline-danger"
                            onClick={() => onClickDelete(row.id)}>Delete<FcCancel />
                        </Button>
                    }
                </ButtonGroup>
                <ButtonGroup hidden={!isNew}>
                    <Button name="InsertButton" variant="outline-primary"
                        onClick={() => onClickInsert(newRow)}>
                        Salva<FcCheckmark />
                    </Button>
                    <Button name='UndoButton' variant="outline-primary"
                        onClick={() => {
                            setNewRow(rowMapper(row))
                            setIsEditable(false)
                        }}>
                        Undo<FcCancel />
                    </Button>
                </ButtonGroup>
            </td>}
        </tr >
    )
}
