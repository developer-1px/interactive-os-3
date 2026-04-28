import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type Step = {
  id: string
  label: ReactNode
  description?: ReactNode
  state?: 'complete' | 'current' | 'upcoming'
}

type StepperProps = Omit<ComponentPropsWithoutRef<'ol'>, 'children'> & {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Stepper — Material Stepper / Polaris ProgressTracker / Ant Steps / Atlassian Progress Tracker.
 * ol + aria-current="step". 의미는 *다단계 진행* — Pagination(페이지)·ProgressBar(연속) 와 다름.
 */
export function Stepper({ steps, orientation = 'horizontal', ...rest }: StepperProps) {
  return (
    <ol data-part="stepper" data-orientation={orientation} {...rest}>
      {steps.map((s, i) => (
        <li
          key={s.id}
          data-state={s.state ?? (i === 0 ? 'current' : 'upcoming')}
          aria-current={s.state === 'current' ? 'step' : undefined}
        >
          <span data-part="step-marker" aria-hidden="true">{i + 1}</span>
          <span data-part="step-label">{s.label}</span>
          {s.description && <span data-part="step-description">{s.description}</span>}
        </li>
      ))}
    </ol>
  )
}
