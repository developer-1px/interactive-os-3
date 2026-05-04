import { createFileRoute } from '@tanstack/react-router'
import { AxisScreen } from '../catalog/AxisScreen'
import { AXES } from '../catalog/registry.axes'

function AxesApp() {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      {AXES.map((entry, i) => (
        <AxisScreen key={entry.axis} entry={entry} index={i} total={AXES.length} />
      ))}
    </div>
  )
}

export const Route = createFileRoute('/axes')({
  component: AxesApp,
  staticData: { palette: { label: 'Axes', to: '/axes' } },
})
