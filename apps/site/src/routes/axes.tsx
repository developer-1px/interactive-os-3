import { createFileRoute } from '@tanstack/react-router'
import { AxesIntro } from '../catalog/AxesIntro'
import { AxisScreen } from '../catalog/AxisScreen'
import { AXES } from '../catalog/registry.axes'
import { SnapPage } from '../layout/SnapPage'

function AxesApp() {
  return (
    <SnapPage>
      <AxesIntro />
      {AXES.map((entry, i) => (
        <AxisScreen key={entry.axis} entry={entry} index={i} total={AXES.length} />
      ))}
    </SnapPage>
  )
}

export const Route = createFileRoute('/axes')({
  component: AxesApp,
  staticData: { palette: { label: 'Axes', to: '/axes' } },
})
