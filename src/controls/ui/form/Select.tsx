import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type SelectProps = ComponentPropsWithoutRef<'select'>

// native <select> — 브라우저가 role=combobox + listbox 팝업을 제공.
// APG "Listbox with Popup" 패턴을 HTML이 내장. ds.css가 appearance 재정의하여
// chevron을 currentColor로 일관시킨다. (상위 호환 — 런타임 팝업 커스텀은 후순위)
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    return <select ref={ref} {...props} />
  },
)
