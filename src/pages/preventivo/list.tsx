import { trpc } from 'utils/trpc'
import React, { useEffect, useState } from 'react'
import { Card, Spinner } from 'react-bootstrap'
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
      <div>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'
            onClick={() => {
              setPrevId(prev.id)
              openModal()
            }
            }>
            <Card.Body>
              <Card.Title>{prev.nome}</Card.Title>
              <Card.Text>
                {prev.scuola.nome} - {prev.listino.nome}
              </Card.Text>
              <Card.Text>
                modificato da: {prev.lastEditedBy.username}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <ModalPreventivo preventivoId={prevId} showModal={showModal}
        updatePreventivoList={() => preventiviQuery.refetch()}
      />
    </>
  )
}