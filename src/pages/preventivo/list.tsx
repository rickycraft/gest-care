import { trpc } from 'utils/trpc'
import React, { useEffect, useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import ModalPreventivo from 'components/preventivo/ModalPreventivo'
const invalidId = -1

export default function List() {

  const preventiviQuery = trpc.useQuery(['preventivo.list'])
  const [prevId, setPrevId] = useState(invalidId)
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal(!showModal)

  if (!preventiviQuery.isSuccess) {
    return <Spinner animation="border" />
  }

  return (
    <>
      <div style={{ maxHeight: '60vh' }} className='mb-3'>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title>{prev.nome}</Card.Title>
              <Card.Text className='mb-0 d-flex justify-content-between'>
                <>{prev.scuola.nome} - {prev.listino.nome}</>
                <Button variant='info' onClick={() => {
                  setPrevId(prev.id)
                  openModal()
                }}>✎</Button>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              modificato l&apos;ultima volta da: {prev.lastEditedBy.username}
            </Card.Footer>
          </Card>
        ))}
      </div>
      <ModalPreventivo preventivoId={prevId} showModal={showModal}
        updatePreventivoList={() => preventiviQuery.refetch()}
      />
    </>
  )
}