import type { ReactNode } from 'react'

// Popover — light-dismiss 비-모달 오버레이. native HTML popover API를 ds primitive로 봉인.
// Radix·Ariakit·Base 수렴: Popover는 Dialog와 별도 primitive (modal 여부가 다름).
//
// 사용:
//   <button popovertarget="my-pop">열기</button>
//   <Popover id="my-pop" label="Nav">…</Popover>
//
// SRP: 토글 라이프사이클은 native popover 속성이 처리. 본 컴포넌트는 시맨틱 + 슬롯만.
export interface PopoverProps {
  id: string
  label?: string
  /** 'auto'(light-dismiss) | 'manual'(JS-only). 기본 'auto'. */
  mode?: 'auto' | 'manual'
  children?: ReactNode
}

export function Popover({ id, label, mode = 'auto', children }: PopoverProps) {
  return (
    <div id={id} popover={mode} role="dialog" aria-label={label} aria-roledescription="popover">
      {children}
    </div>
  )
}
