import { NavDropdown } from 'react-bootstrap'
import { trpc } from 'utils/trpc'


export default function Refresh() {
  const context = trpc.useContext()

  const refreshAll = () => {
    context.invalidateQueries()
  }

  return (
    <NavDropdown.Item onClick={refreshAll}>Refresh</NavDropdown.Item>
  )
}