import { Textarea } from '../Textarea'

export default function TextareaDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxInlineSize: 280 }}>
      <Textarea placeholder="Comment…" rows={2} aria-label="default" />
      <Textarea defaultValue="Lorem ipsum dolor sit amet." rows={2} aria-label="value" />
      <Textarea disabled defaultValue="Disabled" rows={2} aria-label="disabled" />
    </div>
  )
}
