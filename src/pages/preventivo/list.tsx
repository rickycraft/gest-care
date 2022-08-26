import { trpc } from 'utils/trpc'
import React, { useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import ModalEdit from 'components/preventivo/ModalEditPreventivo'
import { useRouter } from 'next/router'
import ModalDelete from 'components/preventivo/ModalDeletePreventivo'
import { MdDeleteOutline } from 'react-icons/md'
const invalidId = -1

export default function List() {
  const router = useRouter()
  const preventiviQuery = trpc.useQuery(['preventivo.list'])
  const [prevId, setPrevId] = useState(invalidId)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const openEdit = () => setShowEdit(!showEdit)
  const openDelete = () => setShowDelete(!showDelete)

  if (!preventiviQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <>
      <div style={{ maxHeight: '60vh' }} className='mb-3'>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title onClick={() => router.push(`/preventivo/${prev.id}`)}>{prev.nome}</Card.Title>
              <Card.Text className='mb-0 d-flex justify-content-between'>
                <>{prev.scuola} - {prev.listino.nome}</>
                <span>
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
    </>
  )
}