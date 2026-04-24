import { Dialog, Input, Textarea, Field, FieldLabel, Button } from '../../../ds'
import { useDialog } from './_useDialog'

export function CategoryEdit({
  open, name, desc, onClose, onSave,
}: {
  open: boolean
  name: string
  desc: string
  onClose: () => void
  onSave: (name: string, desc: string) => void
}) {
  const { data, onEvent } = useDialog(open, '카테고리 편집', onClose)
  return (
    <Dialog data={data} onEvent={onEvent}>
      <article>
        <header><h2>카테고리 편집</h2></header>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const f = e.currentTarget
            const n = (f.elements.namedItem('cat-name') as HTMLInputElement).value
            const d = (f.elements.namedItem('cat-desc') as HTMLTextAreaElement).value
            onSave(n, d)
          }}
        >
          <Field>
            <FieldLabel>이름</FieldLabel>
            <Input name="cat-name" defaultValue={name} />
          </Field>
          <Field>
            <FieldLabel>설명</FieldLabel>
            <Textarea name="cat-desc" rows={3} defaultValue={desc} />
          </Field>
          <footer>
            <Button onClick={onClose}>취소</Button>
            <Button type="submit">저장</Button>
          </footer>
        </form>
      </article>
    </Dialog>
  )
}
