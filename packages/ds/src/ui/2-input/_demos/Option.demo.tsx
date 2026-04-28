import { Option } from '../Option'

export default function OptionDemo() {
  return (
    <ul role="listbox" aria-label="Theme">
      <Option icon="palette">System</Option>
      <Option icon="star" selected>Light</Option>
      <Option icon="hash">Dark</Option>
      <Option disabled>High contrast</Option>
    </ul>
  )
}
