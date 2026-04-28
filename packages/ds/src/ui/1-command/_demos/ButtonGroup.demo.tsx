import { Button } from '../Button'
import { ButtonGroup } from '../ButtonGroup'

export default function ButtonGroupDemo() {
  return (
    <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
      <ButtonGroup aria-label="Text alignment">
        <Button data-icon="align-left" aria-label="Left" />
        <Button data-icon="align-center-horizontal" aria-label="Center" pressed />
        <Button data-icon="align-right" aria-label="Right" />
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button>+</Button>
        <Button>0</Button>
        <Button>−</Button>
      </ButtonGroup>
    </div>
  )
}
