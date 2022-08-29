import { trpc } from 'utils/trpc'
import React, { useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import ModalEdit from 'components/preventivo/ModalEditPreventivo'
import { useRouter } from 'next/router'
import ModalDelete from 'components/preventivo/ModalDeletePreventivo'
import { MdCreate, MdDeleteOutline, MdDownload, MdLock, MdLockOpen } from 'react-icons/md'
import ModalLock from 'components/preventivo/ModalLockPreventivo'
import { useAtom } from 'jotai'
import { userAtom } from 'utils/atom'
import { canUnlockPreventivo } from 'utils/role'

const invalidId = -1

export default function List() {
  const router = useRouter()
  const [user,] = useAtom(userAtom)
  const preventiviQuery = trpc.useQuery(['preventivo.list'])

  const [prevId, setPrevId] = useState(invalidId)
  const [isPrevLock, setIsPrevLock] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showLock, setShowLock] = useState(false)

  const openEdit = () => setShowEdit(!showEdit)
  const openDelete = () => setShowDelete(!showDelete)
  const openLock = () => setShowLock(!showLock)
  const openModal = (id: number, locked: boolean, openFn: () => void) => {
    setPrevId(id)
    setIsPrevLock(locked)
    openFn()
  }

  if (!preventiviQuery.isSuccess) return <Spinner animation="border" />

  return (
    <>
      <div className='mb-3'>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title onClick={() => router.push(`/preventivo/${prev.id}`)}>{prev.nome}</Card.Title>
              <Card.Text className='mb-0 d-flex justify-content-between flex-wrap'>
                <span className='d-flex flex-nowrap'>{prev.scuola} - {prev.listino.nome}</span>
                <span className='d-flex flex-nowrap'>
                  <Button variant='primary' className='me-2'
                    onClick={
                      () => router.push({
                        pathname: '/preventivo/pdf',
                        query: { id: prev.id },
                      })}
                  ><MdDownload /></Button>
                  {prev.locked && canUnlockPreventivo(user.role) && (
                    <Button variant='secondary' className='me-2' onClick={() => openModal(prev.id, prev.locked, openLock)}><MdLockOpen /></Button>
                  )}
                  {prev.locked ? (null) : (
                    <>
                      <Button variant='secondary' className='me-2' onClick={() => openModal(prev.id, prev.locked, openLock)}>
                        <MdLock />
                      </Button>
                      <Button variant='info' className='me-2' onClick={() => openModal(prev.id, prev.locked, openEdit)}>
                        <MdCreate />
                      </Button>
                      <Button variant='danger' onClick={() => openModal(prev.id, prev.locked, openDelete)}>
                        <MdDeleteOutline />
                      </Button>
                    </>
                  )}
                </span>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <>modificato l&apos;ultima volta da: {prev.lastEditedBy.username}, alle {prev.editedAt.toLocaleString()}</>
            </Card.Footer>
          </Card>
        ))
        }
      </div>
      <ModalEdit preventivoId={prevId} showModal={showEdit} />
      <ModalDelete preventivoId={prevId} showModal={showDelete} />
      <ModalLock preventivoId={prevId} showModal={showLock} isLock={isPrevLock} />
    </>
  )
}