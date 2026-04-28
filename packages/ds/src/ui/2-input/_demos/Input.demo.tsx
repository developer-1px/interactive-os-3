import { Input } from '../Input'

export default function InputDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxInlineSize: 240 }}>
      <Input placeholder="Default" aria-label="default" />
      <Input defaultValue="With value" aria-label="value" />
      <Input disabled defaultValue="Disabled" aria-label="disabled" />
      <Input readOnly defaultValue="Readonly" aria-label="readonly" />
      <Input aria-invalid defaultValue="Invalid" aria-label="invalid" />
    </div>
  )
}
