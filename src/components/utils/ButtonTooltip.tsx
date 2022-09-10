import { TooltipContext } from 'components/Layout'
import { useRef } from 'react'
import { useContext } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export default function ButtonTooltip(
  { children, tooltip }: { children: React.ReactNode, tooltip: string }
) {

  const container = useContext(TooltipContext)

  return (
    <OverlayTrigger container={container}
      overlay={<Tooltip>{tooltip}</Tooltip>}
      delay={{ show: 1500, hide: 250 }}
    >
      <div>{children}</div>
    </OverlayTrigger>
  )
}