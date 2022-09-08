import ModalDelete from 'components/preventivo/ModalDeletePreventivo'
import ModalEdit from 'components/preventivo/ModalEditPreventivo'
import ModalLock from 'components/preventivo/ModalLockPreventivo'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import { MdCreate, MdDelete, MdLock, MdLockOpen } from 'react-icons/md'
import { userAtom } from 'utils/atom'
import { canUnlockPreventivo } from 'utils/role'
import { trpc } from 'utils/trpc'

import ButtonTooltip from 'components/utils/ButtonTooltip'

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

  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
  }, [])

  if (!preventiviQuery.isSuccess) return <Spinner animation="border" />

  return (
    <>
      <div className='mb-3'>
        {preventiviQuery.data.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title onClick={() => router.push(`/preventivo/${prev.id}`)}>
                {isLoading ? <Spinner animation="border" /> : prev.nome}
              </Card.Title>
              <div className='mb-0 d-flex justify-content-between flex-wrap'>
                <span className='d-flex flex-nowrap'>{prev.scuola} - {prev.listino.nome}</span>
                <span className='d-flex flex-nowrap'>
                  {prev.locked && canUnlockPreventivo(user.role) && (
                    <ButtonTooltip tooltip="Sblocca">
                      <Button variant='outline-secondary' className='me-2' onClick={() => openModal(prev.id, prev.locked, openLock)}>
                        <MdLockOpen />
                      </Button>
                    </ButtonTooltip>
                  )}
                  {prev.locked ? (null) : (
                    <>
                      <ButtonTooltip tooltip="Blocca">
                        <Button variant='outline-secondary' className='me-2' onClick={() => openModal(prev.id, prev.locked, openLock)}>
                          <MdLock />
                        </Button>
                      </ButtonTooltip>
                      <ButtonTooltip tooltip="Modifica">
                        <Button variant='outline-info' className='me-2' onClick={() => openModal(prev.id, prev.locked, openEdit)}>
                          <MdCreate />
                        </Button>
                      </ButtonTooltip>
                      <ButtonTooltip tooltip="Elimina">
                        <Button variant='outline-danger' onClick={() => openModal(prev.id, prev.locked, openDelete)}>
                          <MdDelete />
                        </Button>
                      </ButtonTooltip>
                    </>
                  )}
                </span>
              </div>
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