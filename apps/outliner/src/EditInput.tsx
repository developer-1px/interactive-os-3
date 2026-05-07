import { useEffect, useRef } from 'react'

/**
 * EditInput — 인라인 편집 input primitive.
 * Enter=commit / Escape=cancel / blur=commit. mount 후 microtask 로 input 재포커스
 * (tree roving tabindex 가 li 로 가져가는 것 보정).
 */
export function EditInput({ initial, onCommit, className }: { initial: string; onCommit: (value: string, cancelled: boolean) => void; className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cancelRef = useRef(false)
  const committedRef = useRef(false)
  const commit = () => {
    if (committedRef.current) return
    committedRef.current = true
    onCommit(inputRef.current?.value ?? '', cancelRef.current)
  }
  useEffect(() => {
    const t = setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select() }, 0)
    return () => clearTimeout(t)
  }, [])
  return (
    <input
      ref={inputRef}
      defaultValue={initial}
      onBlur={commit}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Enter') commit()
        if (e.key === 'Escape') { cancelRef.current = true; commit() }
      }}
      className={className}
    />
  )
}
