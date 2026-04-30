import { useEffect, useSyncExternalStore } from 'react'
import type { Event as UiEvent, NormalizedData } from './types'

/**
 * Resource — ui/ `(data, onEvent)`의 데이터 레이어 평행.
 * 모든 데이터 read/write는 `useResource(resource, ...args) → [value, dispatch]` 단일 인터페이스로 흐른다.
 * 종류별 훅(useFsTree/useFsText/useView…)은 만들지 않는다 — 인터페이스 분기는 ds 원칙 위반.
 *
 * onEvent 옵션: ui/ event를 직접 수용한다. (e, ctx) => 다음 값 (또는 undefined로 무시).
 * 도메인 라우트는 더 이상 Event → resource action 매퍼를 매번 작성하지 않는다.
 */

export type ResourceEvent<T> =
  | { type: 'set'; value: T }
  | { type: 'patch'; partial: Partial<T> }
  | { type: 'refetch' }
  | { type: 'invalidate' }

export type ResourceDispatch<T> = (e: ResourceEvent<T>) => void

export type ResourceEventRouter<T> = (
  e: UiEvent,
  ctx: { value: T | undefined; data: NormalizedData },
) => T | undefined

export interface Resource<T, Args extends unknown[] = []> {
  key: (...args: Args) => string
  load?: (...args: Args) => T | Promise<T>
  initial?: T | ((...args: Args) => T)
  subscribe?: (key: string, notify: () => void, ...args: Args) => () => void
  serialize?: (key: string, value: T, ...args: Args) => void
  /** ui/ event → 다음 값 매퍼. flow에서 intent 라우터로 사용. */
  onEvent?: ResourceEventRouter<T>
}

type Entry = { value: unknown; loaded: boolean; inflight?: Promise<unknown>; externalUnsub?: () => void; refCount: number }

const cache = new Map<string, Entry>()
const listeners = new Map<string, Set<() => void>>()

function getEntry(key: string): Entry {
  let e = cache.get(key)
  if (!e) {
    e = { value: undefined, loaded: false, refCount: 0 }
    cache.set(key, e)
  }
  return e
}

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l())
}

function setValue<T>(key: string, value: T) {
  const e = getEntry(key)
  e.value = value
  e.loaded = true
  notify(key)
}

function subscribeKey(key: string, l: () => void): () => void {
  let set = listeners.get(key)
  if (!set) { set = new Set(); listeners.set(key, set) }
  set.add(l)
  return () => {
    set!.delete(l)
    if (set!.size === 0) listeners.delete(key)
  }
}

function ensureLoaded<T, Args extends unknown[]>(
  key: string,
  resource: Resource<T, Args>,
  args: Args,
): void {
  const entry = getEntry(key)
  if (entry.loaded || entry.inflight) return
  if (resource.initial !== undefined) {
    const v = typeof resource.initial === 'function'
      ? (resource.initial as (...a: Args) => T)(...args)
      : resource.initial
    entry.value = v
    entry.loaded = true
    return
  }
  if (!resource.load) return
  const r = resource.load(...args)
  if (r instanceof Promise) {
    entry.inflight = r
    r.then((v) => {
      entry.value = v
      entry.loaded = true
      entry.inflight = undefined
      notify(key)
    }).catch(() => {
      entry.inflight = undefined
    })
  } else {
    entry.value = r
    entry.loaded = true
  }
}

export function defineResource<T, Args extends unknown[] = []>(
  spec: Resource<T, Args>,
): Resource<T, Args> {
  return spec
}

export function useResource<T, Args extends unknown[] = []>(
  resource: Resource<T, Args>,
  ...args: Args
): [T | undefined, ResourceDispatch<T>] {
  const key = resource.key(...args)

  // 외부 push 채널(HMR 등) 1회 attach — 같은 key의 첫 구독자가 켜고, 마지막 구독자가 끈다.
  useEffect(() => {
    const entry = getEntry(key)
    entry.refCount += 1
    if (entry.refCount === 1 && resource.subscribe && !entry.externalUnsub) {
      entry.externalUnsub = resource.subscribe(key, () => notify(key), ...args)
    }
    return () => {
      entry.refCount -= 1
      if (entry.refCount === 0 && entry.externalUnsub) {
        entry.externalUnsub()
        entry.externalUnsub = undefined
      }
    }
    // key/args 변경 시 재계산 — args는 key에 반영되어 있다고 가정
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // 첫 read 시 load 트리거 (렌더 중 호출 OK — store side-effect는 idempotent)
  ensureLoaded(key, resource, args)

  const value = useSyncExternalStore(
    (l) => subscribeKey(key, l),
    () => getEntry(key).value as T | undefined,
    () => getEntry(key).value as T | undefined,
  )

  const dispatch: ResourceDispatch<T> = (e) => {
    const entry = getEntry(key)
    if (e.type === 'set') {
      setValue(key, e.value)
      resource.serialize?.(key, e.value, ...args)
    } else if (e.type === 'patch') {
      const next = { ...(entry.value as object), ...e.partial } as T
      setValue(key, next)
      resource.serialize?.(key, next, ...args)
    } else if (e.type === 'refetch') {
      entry.loaded = false
      entry.inflight = undefined
      ensureLoaded(key, resource, args)
    } else if (e.type === 'invalidate') {
      entry.value = undefined
      entry.loaded = false
      entry.inflight = undefined
      notify(key)
    }
  }

  return [value, dispatch]
}

/** 컴포넌트 외부(이벤트 핸들러·HMR 콜백 등)에서 자원에 직접 쓰기. */
export function writeResource<T, Args extends unknown[] = []>(
  resource: Resource<T, Args>,
  value: T,
  ...args: Args
): void {
  const key = resource.key(...args)
  setValue(key, value)
  resource.serialize?.(key, value, ...args)
}

/** 컴포넌트 외부에서 현재 값 읽기 (구독 없음). */
export function readResource<T, Args extends unknown[] = []>(
  resource: Resource<T, Args>,
  ...args: Args
): T | undefined {
  const key = resource.key(...args)
  return getEntry(key).value as T | undefined
}
