import { useId, useRef, useState, type ChangeEvent, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type FileInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange' | 'value'> & {
  buttonLabel?: ReactNode
  emptyLabel?: ReactNode
  onFiles?: (files: FileList | null) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

/**
 * Controlled file input — native UA 의 "Choose File / 선택된 파일 없음" 영문/지역화
 * 텍스트를 정본 ds 어휘로 대체. 실제 input 은 sr-only 로 숨기고 label 안에 button 모양과
 * 파일명 텍스트를 명시적으로 그린다. accept/multiple/disabled 등 native attr 그대로 통과.
 */
export function FileInput({
  buttonLabel = '파일 선택',
  emptyLabel = '선택된 파일 없음',
  onFiles, onChange, multiple, disabled, id, ...rest
}: FileInputProps) {
  const ownId = useId()
  const inputId = id ?? ownId
  const inputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<string[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    setNames(list ? Array.from(list).map((f) => f.name) : [])
    onFiles?.(list)
    onChange?.(e)
  }

  const summary = names.length === 0
    ? emptyLabel
    : names.length === 1 ? names[0] : `${names[0]} 외 ${names.length - 1}개`

  return (
    <label data-part="file-input" htmlFor={inputId} aria-disabled={disabled || undefined}>
      <span data-slot="button">{buttonLabel}</span>
      <span data-slot="filename" data-empty={names.length === 0 ? '' : undefined}>{summary}</span>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
    </label>
  )
}
