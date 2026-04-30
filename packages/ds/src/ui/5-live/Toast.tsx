import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer,
  type ComponentPropsWithoutRef, type ReactNode,
} from 'react'
import type { Tone } from '@p/headless/types'

export type Toast = {
  id: string
  title: ReactNode
  description?: ReactNode
  variant?: Tone
  /** ms — 0 으로 두면 자동 닫힘 ❌ (사용자 dismiss 만). */
  duration?: number
  /** 'alert' = 즉각(accessibility-aware); 'status' = polite. default 는 tone 으로 결정. */
  role?: 'status' | 'alert'
}

type State = { items: Toast[] }
type Action = { type: 'push'; toast: Toast } | { type: 'dismiss'; id: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'push':    return { items: [...state.items, action.toast] }
    case 'dismiss': return { items: state.items.filter((t) => t.id !== action.id) }
  }
}

type Ctx = {
  toast: (t: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

let __id = 0
const nextId = () => `t-${++__id}`

type ProviderProps = {
  children: ReactNode
  /** default 5000ms — 0 이면 영구. */
  defaultDuration?: number
} & Omit<ComponentPropsWithoutRef<'ol'>, 'children'>

/**
 * ToastProvider — Sonner / Radix Toast / RAC Toast 수렴.
 * region role + aria-live. portal 없이 in-tree 렌더 (CSS position:fixed).
 */
export function ToastProvider({ children, defaultDuration = 5000, ...regionProps }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = nextId()
    dispatch({ type: 'push', toast: { id, duration: defaultDuration, ...t } })
    return id
  }, [defaultDuration])

  const dismiss = useCallback((id: string) => dispatch({ type: 'dismiss', id }), [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <ol data-part="toast-region" role="region" aria-label="Notifications" {...regionProps}>
        {state.items.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </ol>
    </ToastCtx.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { duration, tone = 'neutral', role } = toast
  const ariaRole = role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')

  useEffect(() => {
    if (!duration) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <li data-part="toast" data-variant={tone} role={ariaRole} aria-live={ariaRole === 'alert' ? 'assertive' : 'polite'}>
      <div data-slot="title">{toast.title}</div>
      {toast.description && <div data-slot="description">{toast.description}</div>}
      <button type="button" data-part="toast-dismiss" aria-label="Dismiss" onClick={onDismiss}>✕</button>
    </li>
  )
}
