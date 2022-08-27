import { trpc } from 'utils/trpc'
import React, { useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import ModalEdit from 'components/preventivo/ModalEditPreventivo'
import { useRouter } from 'next/router'
import ModalDelete from 'components/preventivo/ModalDeletePreventivo'
import { MdDeleteOutline, MdLock } from 'react-icons/md'
import ModalLock from 'components/preventivo/ModalLockPreventivo'
const invalidId = -1

export default function List() {
  const router = useRouter()
  const preventiviQuery = trpc.useQuery(['preventivo.list'])

  const [prevId, setPrevId] = useState(invalidId)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showLock, setShowLock] = useState(false)

  const openEdit = () => setShowEdit(!showEdit)
  const openDelete = () => setShowDelete(!showDelete)
  const openLock = () => setShowLock(!showLock)

  if (!preventiviQuery.isSuccess) return <Spinner animation="border" />

  return (
    <>
      <div className='mb-3'>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title onClick={() => router.push(`/preventivo/${prev.id}`)}>{prev.nome}</Card.Title>
              <Card.Text className='mb-0 d-flex justify-content-between'>
                <>{prev.scuola} - {prev.listino.nome}</>
                <span hidden={prev.locked}>
                  <Button variant='secondary' className='me-3' onClick={() => {
                    setPrevId(prev.id)
                    openLock()
                  }}><MdLock /></Button>
                  <Button variant='info' className='me-3' onClick={() => {
                    setPrevId(prev.id)
                    openEdit()
                  }}>✎</Button>
                  <Button variant='danger' onClick={() => {
                    setPrevId(prev.id)
                    openDelete()
                  }}><MdDeleteOutline /></Button>
                </span>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <>modificato l&apos;ultima volta da: {prev.lastEditedBy.username}, alle {prev.editedAt.toLocaleString()}</>
            </Card.Footer>
          </Card>
        ))}
      </div>
      <ModalEdit preventivoId={prevId} showModal={showEdit} />
      <ModalDelete preventivoId={prevId} showModal={showDelete} />
      <ModalLock preventivoId={prevId} showModal={showLock} />
    </>
  )
}