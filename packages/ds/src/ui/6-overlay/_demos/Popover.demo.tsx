import { Popover } from '../Popover'

export default function PopoverDemo() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button type="button" popovertarget="demo-popover">팝오버 열기</button>
      <Popover id="demo-popover" label="예시 팝오버">
        <p style={{ margin: 0 }}>native [popover] API — Esc·바깥 클릭 자동 닫힘.</p>
      </Popover>
    </div>
  )
}
