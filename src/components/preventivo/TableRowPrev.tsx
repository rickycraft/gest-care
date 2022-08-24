import { PreventivoRow, Prisma } from '@prisma/client'
import { useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { FcCancel, FcCheckmark, FcEmptyTrash, FcSafe, FcSupport } from 'react-icons/fc'
import { insertPrevRow, updatePrevRow } from 'server/routers/preventivo_row'
import { inferQueryOutput } from 'utils/trpc'

const invalidId = -1

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
    const rowMapper = (row: PreventivoRow) => ({
        prevId: row.preventivoId,
        prodId: row.prodottoId,
        persId: row.personalizzazioneId,
        provComm: Number(row.provvigioneComm),
        provRappre: Number(row.provvigioneRappre),
        provSc: Number(row.provvigioneSC),
    })
    const [isEditable, setIsEditable] = useState((row.id == invalidId) ? true : false)
    const [newRow, setNewRow] = useState(rowMapper(row))
    const resetRow = () => setNewRow(rowMapper(row))


    const prodotto = useMemo(() => prodList.find(p => p.id === newRow.prodId) ?? { id: invalidId, nome: '', prezzo: new Prisma.Decimal(0) }, [prodList, newRow.prodId])
    const pers = useMemo(() => persList.find(p => p.id === newRow.persId) ?? { id: invalidId, nome: '', prezzo: new Prisma.Decimal(0) }, [persList, newRow.persId])
    const total = useMemo(() => (
        newRow.provComm + newRow.provRappre + newRow.provSc
        + Number(prodotto.prezzo) + Number(pers.prezzo)
    ).toPrecision(2), [newRow])
    const isValid = useMemo(() => (Number(prodotto.prezzo) > 0 && Number(pers.prezzo) > 0
        && newRow.provComm > 0 && newRow.provRappre > 0 && newRow.provSc > 0)
        , [newRow])
    const isNew = useMemo(() => row.id == invalidId, [row])

    if (!prodotto || !pers) {
        return <Spinner animation="border" />
    }

    return (
        <tr key={row.id} onDoubleClick={() => setIsEditable(true)}>
            <td>
                <Form.Select
                    disabled={!isEditable}
                    isInvalid={newRow.prodId == invalidId && !isNew}
                    value={newRow.prodId}
                    onChange={(e) => setNewRow({ ...newRow, prodId: Number(e.target.value) })}
                >
                    <option value={invalidId} >-</option>
                    {prodList.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </Form.Select>
            </td>
            <td>{Number(prodotto.prezzo)}</td>
            <td>
                <Form.Select
                    disabled={!isEditable}
                    isInvalid={newRow.persId == invalidId && !isNew}
                    value={newRow.persId}
                    onChange={(e) => setNewRow({ ...newRow, persId: Number(e.target.value) })}
                >
                    <option value={invalidId} >-</option>
                    {persList.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </Form.Select>
            </td>
            <td>{Number(pers.prezzo)}</td>
            <td><Form.Control value={(newRow.provSc == 0) ? '' : newRow.provSc} type="number" disabled={!isEditable}
                onInput={(e) => setNewRow({
                    ...newRow,
                    provSc: Number(e.currentTarget.value)
                })} />
            </td>
            <td><Form.Control value={(newRow.provRappre == 0) ? '' : newRow.provRappre} type="number" disabled={!isEditable}
                onInput={(e) => setNewRow({
                    ...newRow,
                    provRappre: Number(e.currentTarget.value)
                })} />
            </td>
            <td><Form.Control value={(newRow.provComm == 0) ? '' : newRow.provComm} type="number" disabled={!isEditable}
                onInput={(e) => setNewRow({
                    ...newRow,
                    provComm: Number(e.currentTarget.value)
                })} />
            </td>
            <td>{total}</td>
            {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga*/}
            {
                <td>
                    <ButtonGroup hidden={isNew}>
                        <Button name='EditButton' variant="outline-success" disabled={!isValid}
                            onClick={() => {
                                onClickEdit({ id: row.id, ...newRow, })
                                setIsEditable(false)
                            }}>
                            Salva<FcSupport />
                        </Button>
                        {isEditable &&
                            <Button name='UndoButton' variant="outline-secondary"
                                onClick={() => {
                                    resetRow()
                                    setIsEditable(false)
                                }}>Undo<FcCancel />
                            </Button>
                        }
                        {!isEditable &&
                            <Button name="DeleteButton" variant="outline-danger"
                                onClick={() => onClickDelete(row.id)}>Delete<FcEmptyTrash />
                            </Button>
                        }
                    </ButtonGroup>
                    <ButtonGroup hidden={!isNew}>
                        <Button name="InsertButton" variant="outline-primary" disabled={!isValid}
                            onClick={() => {
                                onClickInsert(newRow)
                                resetRow()
                            }}>
                            Salva<FcCheckmark />
                        </Button>
                        <Button name='UndoButton' variant="outline-secondary"
                            onClick={() => resetRow()}>
                            <span>Clear<FcCancel /></span>
                        </Button>
                    </ButtonGroup>
                </td>
            }
        </tr >
    )
}
