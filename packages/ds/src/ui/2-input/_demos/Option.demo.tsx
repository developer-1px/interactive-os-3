import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { Option } from '../Option'

export default function OptionDemo() {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLUListElement>(null, {
    orientation: 'vertical',
    itemSelector: '[role="option"]',
  })
  return (
    <ul ref={ref} onKeyDown={onKeyDown} role="listbox" aria-label="Theme">
      <Option icon="palette">System</Option>
      <Option icon="star" selected>Light</Option>
      <Option icon="hash">Dark</Option>
      <Option disabled>High contrast</Option>
    </ul>
  )
}
