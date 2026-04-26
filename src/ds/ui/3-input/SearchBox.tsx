import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useField } from './Field'

type SearchBoxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

/**
 * SearchBox — `<input type="search">`. role=searchbox는 type=search가 자동 부여한다.
 * 네이티브 "x" clear affordance도 브라우저가 제공 — 별도 버튼을 만들지 않는다.
 * Input과 분리한 이유: Input은 type=text 고정이고, role/시맨틱이 다르므로 1 role = 1 component 원칙.
 */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  function SearchBox(props, ref) {
    const field = useField()
    const id = props.id ?? field?.controlId
    const describedBy = field
      ? [props['aria-describedby'], field.descriptionId, field.invalid ? field.errorId : undefined]
          .filter(Boolean).join(' ') || undefined
      : props['aria-describedby']
    return (
      <input
        ref={ref}
        type="search"
        {...props}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={props['aria-invalid'] ?? field?.invalid ?? undefined}
        aria-required={props['aria-required'] ?? field?.required ?? undefined}
      />
    )
  },
)
