import { Dialog, Button } from '../../../ds'
import { useDialog } from './_useDialog'

export function DeleteConfirm({
  open, target, onClose, onConfirm,
}: { open: boolean; target: string; onClose: () => void; onConfirm: () => void }) {
  const { data, onEvent } = useDialog(open, `${target} 삭제 확인`, onClose, { alert: true, deps: [target] })
  return (
    <Dialog data={data} onEvent={onEvent}>
      <article>
        <header>
          <h2>{target}을(를) 삭제하시겠습니까?</h2>
        </header>
        <p>삭제된 데이터는 복구할 수 없습니다.</p>
        <footer>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={onConfirm}>삭제</Button>
        </footer>
      </article>
    </Dialog>
  )
}
