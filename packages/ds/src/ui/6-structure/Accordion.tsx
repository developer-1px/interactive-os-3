import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type AccordionItem = {
  id: string
  summary: ReactNode
  content: ReactNode
  open?: boolean
  disabled?: boolean
}

type AccordionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  items: AccordionItem[]
  /** "single" — only one open at a time (radio-like). default "multiple". */
  type?: 'single' | 'multiple'
  onToggle?: (id: string, open: boolean) => void
}

/**
 * Accordion — Disclosure 의 group container. Radix Accordion / Ariakit / RAC.
 * <details> 의 native group 의도와 정합 — type="single" 은 name 속성으로 자연 ExclusiveAccordion (HTML 2024+).
 */
export function Accordion({ items, type = 'multiple', onToggle, ...rest }: AccordionProps) {
  const groupName = type === 'single' ? `accordion-${useId()}` : undefined
  return (
    <div data-part="accordion" role="group" {...rest}>
      {items.map((it) => (
        <details
          key={it.id}
          name={groupName}
          open={it.open || undefined}
          onToggle={(e) => onToggle?.(it.id, (e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary aria-disabled={it.disabled || undefined}>{it.summary}</summary>
          <div data-part="accordion-content">{it.content}</div>
        </details>
      ))}
    </div>
  )
}

let __id = 0
function useId() {
  // 모듈 스코프 카운터로 정합. SSR 일관성은 고객 측에서 stable id 주입.
  return String(++__id)
}
