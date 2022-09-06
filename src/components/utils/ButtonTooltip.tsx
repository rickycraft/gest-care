import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export default function ButtonTooltip(
  { children, tooltip }: { children: React.ReactNode, tooltip: string }
) {
  return (
    <OverlayTrigger container={document.getElementById('__next')}
      overlay={
        <Tooltip>{tooltip}</Tooltip>
      }>
      <div>
        {children}
      </div>
    </OverlayTrigger>
  )
}