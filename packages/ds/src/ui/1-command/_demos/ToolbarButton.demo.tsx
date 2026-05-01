import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { ToolbarButton } from '../ToolbarButton'

/** ToolbarButton 자체는 button 변형 — Toolbar 컬렉션이 키보드 roving 을 owner. */
export default function ToolbarButtonDemo() {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLDivElement>(null, { orientation: 'horizontal' })
  return (
    <div ref={ref} onKeyDown={onKeyDown} role="toolbar" aria-label="Format" style={{ display: 'inline-flex', gap: 4 }}>
      <ToolbarButton data-icon="align-left" aria-label="Left" />
      <ToolbarButton data-icon="align-center-horizontal" aria-label="Center" pressed />
      <ToolbarButton data-icon="align-right" aria-label="Right" />
    </div>
  )
}
