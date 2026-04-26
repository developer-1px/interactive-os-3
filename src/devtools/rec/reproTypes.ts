/** Reproduction Recorder — timeline event types. */

export interface ComponentInfo {
  stack: string[]
  source: string | null
}

export interface InputEntry {
  seq: number
  time: string
  ch: 'input'
  type: 'keydown' | 'click' | 'focus'
  key?: string
  target: string
  source: string | null
  focus: string
  prevented: boolean
  ariaTree: string
}

export interface RouteEntry {
  seq: number
  time: string
  ch: 'route'
  from: string
  to: string
  method: 'pushState' | 'replaceState' | 'popstate'
}

export interface ConsoleEntry {
  seq: number
  time: string
  ch: 'console'
  level: 'error' | 'warn'
  message: string
}

export type ReproEvent = InputEntry | RouteEntry | ConsoleEntry

export interface ReproRecording {
  text: string
  meta: {
    url: string
    startedAt: string
    duration: number
    eventCount: number
  }
  timeline: ReproEvent[]
}
