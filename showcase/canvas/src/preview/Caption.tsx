/**
 * Caption — preview cell 의 공통 caption (name + call).
 *
 * 모든 *Preview 가 공유하는 메타 라벨. card frame 은 외부 wrapper 가 담당.
 */
import type { ReactNode } from 'react'

type Props = { name?: ReactNode; call?: ReactNode }

export function Caption({ name, call }: Props) {
  if (!name && !call) return null
  return (
    <>
      {name && <span data-name>{name}</span>}
      {call && <span data-call>{call}</span>}
    </>
  )
}
