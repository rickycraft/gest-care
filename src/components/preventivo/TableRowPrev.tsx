import { useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, Spinner } from 'react-bootstrap'
import { inferMutationInput, inferQueryOutput } from 'utils/trpc'
import { MdCancel, MdSave, MdDelete, MdOutlineClear, MdOutlineCheck } from 'react-icons/md'
import { INVALID_ID } from 'utils/constants'
import ButtonTooltip from 'components/utils/ButtonTooltip'


export default function TableRowPrev({
    row,
    prodList,
    persList,
    locked,
    onClickInsert,
    onClickDelete,
    onClickEdit,
}: {
    row: inferQueryOutput<'preventivo.row.list'>[0],
    prodList: inferQueryOutput<'prodotto.list'>,
    persList: inferQueryOutput<'pers.list'>,
    locked: boolean,
    onClickInsert: (new_row: inferMutationInput<'preventivo.row.insert'>) => void,
    onClickEdit: (row: inferMutationInput<'preventivo.row.update'>) => void,
    onClickDelete: (row_id: number) => void,
}) {

    const [isEditable, setIsEditable] = useState((row.id == INVALID_ID) ? true : false)
    const [newRow, setNewRow] = useState(row)
    const resetRow = () => setNewRow(row)

    const prodotto = useMemo(() => prodList.find(p => p.id === newRow.prodId)?.prezzo ?? 0, [prodList, newRow.prodId])
    const pers = useMemo(() => persList.find(p => p.id === newRow.persId)?.prezzo ?? 0, [persList, newRow.persId])
    const total = useMemo(() => (
        newRow.provComm + newRow.provRappre + newRow.provSc + prodotto + pers
    ).toFixed(2), [newRow])
    const isValid = useMemo(() => (prodotto > 0 && pers > 0
        && newRow.provComm > 0 && newRow.provRappre > 0 && newRow.provSc > 0
    ), [newRow])
    const isNew = useMemo(() => row.id == INVALID_ID, [row])

    return (
        <tr className="tr" key={row.id} onDoubleClick={() => {
            if (!locked) setIsEditable(true)
        }}>
            <td>
                <Form.Select
                    disabled={!isEditable}
                    isInvalid={newRow.prodId == INVALID_ID && !isNew}
                    value={newRow.prodId}
                    onChange={(e) => setNewRow({ ...newRow, prodId: Number(e.target.value) })}
                >
                    <option value={INVALID_ID} >-</option>
                    {prodList.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </Form.Select>
            </td>
            <td>{prodotto}</td>
            <td>
                <Form.Select
                    disabled={!isEditable}
                    isInvalid={newRow.persId == INVALID_ID && !isNew}
                    value={newRow.persId}
                    onChange={(e) => setNewRow({ ...newRow, persId: Number(e.target.value) })}
                >
                    <option value={INVALID_ID} >-</option>
                    {persList.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </Form.Select>
            </td>
            <td>{pers}</td>
            <td><Form.Control value={newRow.provSc} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => setNewRow({
                    ...newRow,
                    provSc: Number(e.currentTarget.value)
                })} />
            </td>
            <td><Form.Control value={newRow.provComm} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => setNewRow({
                    ...newRow,
                    provComm: Number(e.currentTarget.value)
                })} />
            </td>
            <td><Form.Control value={newRow.provRappre} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => setNewRow({
                    ...newRow,
                    provRappre: Number(e.currentTarget.value)
                })} />
            </td>
            <td>{total}</td>
            {/*Gruppo di bottoni "edit" e "delete" per ogni riga prodotto
                edit: modifica il prodotto della riga  (TODO)
                delete: elimina il prodotto della riga*/}
            <td>
                {isEditable ? (
                 <div className='d-flex flex-nowrap'>
                        <ButtonTooltip tooltip="Salva le modifiche">
                            <Button name='EditButton' variant="outline-success  me-1 me-lg-2" disabled={!isValid} hidden={isNew || locked}
                                onClick={() => {
                                    onClickEdit({ ...newRow, id: row.id })
                                    setIsEditable(false)
                                }}>
                                <MdOutlineCheck />
                            </Button>
                        </ButtonTooltip>

                        <ButtonTooltip tooltip="Annulla Modifiche">
                            <Button name='UndoButton' variant="outline-secondary" hidden={isNew || locked}
                                onClick={() => {
                                    resetRow()
                                    setIsEditable(false)
                                }}><MdOutlineClear />
                            </Button>
                        </ButtonTooltip>
                         </div>
               
                ) : (
                    <div className="d-inline-block">
                        <ButtonTooltip tooltip="Elimina riga preventivo">
                            <Button name="DeleteButton" variant="outline-danger" hidden={isNew || locked} onClick={() => onClickDelete(row.id)}>
                                <MdDelete />
                            </Button>
                        </ButtonTooltip>
                    </div>
                )}
                <ButtonGroup hidden={!isNew || locked}>

                    <ButtonTooltip tooltip="Salva ">
                        <Button name="InsertButton" variant="outline-success  me-1 me-lg-2" disabled={!isValid} onClick={() => { onClickInsert(newRow); resetRow() }}>
                            <MdSave className='ms-1' />
                        </Button>
                    </ButtonTooltip>


                    <ButtonTooltip tooltip="Annulla">
                        <Button name='UndoButton' variant="outline-secondary" onClick={() => resetRow()}>
                            <MdCancel className='ms-1' />
                        </Button>
                    </ButtonTooltip>

                </ButtonGroup>
            </td>
        </tr >
    )
}
