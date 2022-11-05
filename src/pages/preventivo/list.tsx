import ModalDelete from 'components/preventivo/ModalDeletePreventivo'
import ModalEdit from 'components/preventivo/ModalEditPreventivo'
import ModalLock from 'components/preventivo/ModalLockPreventivo'
import ButtonTooltip from 'components/utils/ButtonTooltip'
import SearchBar from 'components/utils/SearchBar'
import { useAtom } from 'jotai'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import { MdCreate, MdDelete, MdLock, MdLockOpen } from 'react-icons/md'
import { createSSG } from 'server/context'
import { userAtom } from 'utils/atom'
import { INVALID_ID } from 'utils/constants'
import { canUnlockPreventivo } from 'utils/role'
import { trpc } from 'utils/trpc'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = await createSSG(context.req.cookies)
  await ssg.prefetchQuery('preventivo.list', { search: '' })

  return { props: { trpcState: ssg.dehydrate() } }
}

export default function List(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter()
  const [user,] = useAtom(userAtom)

  const [search, setSearch] = useState('')
  const preventiviQuery = trpc.useQuery(['preventivo.list', { search }], {
    keepPreviousData: true,
  })

  const [prevId, setPrevId] = useState(INVALID_ID)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const preventivo = useMemo(() => preventiviQuery.data?.find(el => el.id == prevId), [prevId])

  const openEdit = (id: number) => {
    setPrevId(id)
    setShowEdit(true)
  }
  const openDelete = (id: number) => {
    setPrevId(id)
    setShowDelete(true)
  }
  const openLock = (id: number) => {
    setPrevId(id)
    setShowLock(true)
  }

  return (
    <>
      <div className='mb-3'>
        <SearchBar updateSearch={(newSearch: string) => setSearch(newSearch)} />
        {preventiviQuery.data?.map((prev) => (
          <Card key={prev.id} className='my-3'>
            <Card.Body>
              <Card.Title role="button"
                onClick={() => {
                  setTimeout(() => setLoading(true), 500)
                  router.push(`/preventivo/${prev.id}`)
                }}
              >
                {isLoading ? <Spinner animation="border" /> : prev.nome}
              </Card.Title>
              <div className='mb-0 d-flex justify-content-between flex-wrap'>
                <span className='d-flex flex-nowrap'>{prev.scuola} - {prev.listino.nome}</span>
                <span className='d-flex flex-nowrap'>
                  {prev.locked && canUnlockPreventivo(user.role) && (
                    <ButtonTooltip tooltip="sblocca">
                      <Button variant='outline-secondary' className='me-2' onClick={() => openLock(prev.id)}>
                        <MdLockOpen />
                      </Button>
                    </ButtonTooltip>
                  )}
                  {prev.locked ? (null) : (
                    <>
                      <ButtonTooltip tooltip="blocca">
                        <Button variant='outline-secondary' className='me-2' onClick={() => openLock(prev.id)}>
                          <MdLock />
                        </Button>
                      </ButtonTooltip>
                      <ButtonTooltip tooltip="modifica">
                        <Button variant='outline-info' className='me-2' onClick={() => openEdit(prev.id)}>
                          <MdCreate />
                        </Button>
                      </ButtonTooltip>
                      <ButtonTooltip tooltip="elimina">
                        <Button variant='outline-danger' onClick={() => openDelete(prev.id)}>
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
      <div className='d-flex justify-content-end'>
        <ButtonTooltip tooltip="aggiungi preventivo">
          <Button variant="primary" size='lg' className="rounded-circle" onClick={() => openEdit(0)}>+</Button>
        </ButtonTooltip>
      </div>
      <ModalEdit preventivo={preventivo} show={showEdit} onHide={() => setShowEdit(false)} />
      <ModalDelete preventivo={preventivo} show={showDelete} onHide={() => setShowDelete(false)} />
      <ModalLock preventivo={preventivo} show={showLock} onHide={() => setShowLock(false)} />
    </>
  )
}