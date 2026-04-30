import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { Option } from '../Option'

export default function OptionDemo() {
  const ref = useRovingDOM<HTMLUListElement>(null, {
    orientation: 'vertical',
    itemSelector: '[role="option"]',
  })
  return (
    <ul ref={ref} role="listbox" aria-label="Theme">
      <Option icon="palette">System</Option>
      <Option icon="star" selected>Light</Option>
      <Option icon="hash">Dark</Option>
      <Option disabled>High contrast</Option>
    </ul>
  )
}
