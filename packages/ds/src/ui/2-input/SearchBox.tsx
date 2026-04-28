import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useField } from '../8-field/Field'

type SearchBoxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

/**
 * SearchBox — `<search>` 랜드마크 + 아이콘 sibling + `<input type="search">`.
 *
 * 디자인:
 * - `<search>` 는 HTML5 search 랜드마크 (role="search" 자동). 별도 `role` 부여 ❌.
 * - 아이콘은 `data-icon` sibling (inline content ❌, 형제 entity 규약 준수).
 * - 네이티브 "x" clear affordance 는 브라우저가 제공 — 커스텀 버튼 만들지 않음.
 * - 1 role = 1 component — Input 과 분리.
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
      <search>
        <span data-slot="leading" data-icon="search" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          {...props}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={props['aria-invalid'] ?? field?.invalid ?? undefined}
          aria-required={props['aria-required'] ?? field?.required ?? undefined}
          aria-disabled={props.disabled || undefined}
          aria-readonly={props.readOnly || undefined}
        />
      </search>
    )
  },
)
