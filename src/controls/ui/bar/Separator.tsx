import type { HTMLAttributes } from 'react'

type SeparatorProps = HTMLAttributes<HTMLElement> & {
  orientation?: 'horizontal' | 'vertical'
  /** When inside <ul>/<ol> (menu/listbox), pass "li" to keep HTML valid. */
  as?: 'div' | 'li'
}

export function Separator({ orientation = 'horizontal', as = 'div', ...rest }: SeparatorProps) {
  const Tag = as
  return <Tag role="separator" aria-orientation={orientation} {...rest} />
}
