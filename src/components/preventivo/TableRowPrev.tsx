import ButtonTooltip from 'components/utils/ButtonTooltip'
import { useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { MdCancel, MdDelete, MdOutlineCheck, MdOutlineUndo, MdSave } from 'react-icons/md'
import { INVALID_ID } from 'utils/constants'
import { inferMutationInput, inferQueryOutput } from 'utils/trpc'

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
    const resetRow = () => {
        setNewRow(row)
        setProvScTxt(row.provSc.toString())
        setProvCommTxt(row.provComm.toString())
        setProvRappreTxt(row.provRappre.toString())
    }

    const [provScTxt, setProvScTxt] = useState(row.provSc.toString())
    const [provCommTxt, setProvCommTxt] = useState(row.provComm.toString())
    const [provRappreTxt, setProvRappreTxt] = useState(row.provRappre.toString())

    const prodotto = useMemo(() => prodList.find(p => p.id === newRow.prodId)?.prezzo ?? 0, [prodList, newRow.prodId])
    const pers = useMemo(() => persList.find(p => p.id === newRow.persId)?.prezzo ?? 0, [persList, newRow.persId])
    const total = useMemo(() => (
        newRow.provComm + newRow.provRappre + newRow.provSc + prodotto + pers
    ).toFixed(2), [newRow, prodotto, pers])
    const isValid = useMemo(() => (prodotto >= 0 && pers >= 0
        && newRow.provComm >= 0 && newRow.provRappre >= 0 && newRow.provSc >= 0
    ), [newRow, prodotto, pers])
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
            <td><Form.Control value={provScTxt} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => {
                    setProvScTxt(e.currentTarget.value)
                    setNewRow({
                        ...newRow,
                        provSc: Number(e.currentTarget.value)
                    })
                }} />
            </td>
            <td><Form.Control value={provCommTxt} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => {
                    setProvCommTxt(e.currentTarget.value)
                    setNewRow({
                        ...newRow,
                        provComm: Number(e.currentTarget.value)
                    })
                }} />
            </td>
            <td><Form.Control value={provRappreTxt} type="number" disabled={!isEditable} className="p-1"
                onInput={(e) => {
                    setProvRappreTxt(e.currentTarget.value)
                    setNewRow({
                        ...newRow,
                        provRappre: Number(e.currentTarget.value)
                    })
                }} />
            </td>
            <td>{total}</td>
            <td hidden={locked}>
                {!isNew && (isEditable ? (
                    <div className='d-flex flex-nowrap'>
                        <ButtonTooltip tooltip="salva modifiche">
                            <Button name='EditButton' variant="outline-success  me-1 me-lg-2" disabled={!isValid}
                                onClick={() => {
                                    onClickEdit({ ...newRow, id: row.id })
                                    setProvCommTxt(newRow.provComm.toString())
                                    setProvRappreTxt(newRow.provRappre.toString())
                                    setProvScTxt(newRow.provSc.toString())
                                    setIsEditable(false)
                                }}>
                                <MdOutlineCheck />
                            </Button>
                        </ButtonTooltip>
                        <ButtonTooltip tooltip="annulla modifiche">
                            <Button name='UndoButton' variant="outline-secondary"
                                onClick={() => { resetRow(); setIsEditable(false) }}>
                                <MdOutlineUndo />
                            </Button>
                        </ButtonTooltip>
                    </div>
                ) : (
                    <div className="d-inline-block">
                        <ButtonTooltip tooltip="rimuovi prodotto">
                            <Button name="DeleteButton" variant="outline-danger" onClick={() => onClickDelete(row.id)}>
                                <MdDelete />
                            </Button>
                        </ButtonTooltip>
                    </div>
                ))}
                {isNew && <div className='d-flex flex-nowrap'>
                    <ButtonTooltip tooltip="salva">
                        <Button name="InsertButton" variant="outline-success  me-1 me-lg-2"
                            disabled={!isValid}
                            onClick={() => { onClickInsert(newRow); resetRow() }}>
                            <MdSave />
                        </Button>
                    </ButtonTooltip>
                    <ButtonTooltip tooltip="pulisci">
                        <Button name='UndoButton' variant="outline-secondary" onClick={resetRow}>
                            <MdCancel />
                        </Button>
                    </ButtonTooltip>
                </div>}
            </td>
        </tr>
    )
}
