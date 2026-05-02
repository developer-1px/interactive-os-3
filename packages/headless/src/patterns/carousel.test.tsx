import { describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCarouselPattern, type CarouselSlide } from './carousel'

const slides: CarouselSlide[] = [
  { id: 's1', label: 'First' },
  { id: 's2', label: 'Second' },
  { id: 's3', label: 'Third' },
]

describe('useCarouselPattern', () => {
  it('exposes role=region + aria-roledescription=carousel + container id', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, label: 'News' }))
    expect(result.current.rootProps.role).toBe('region')
    expect((result.current.rootProps as unknown as Record<string, unknown>)['aria-roledescription']).toBe('carousel')
    expect((result.current.rootProps as unknown as Record<string, unknown>)['aria-label']).toBe('News')
    expect(result.current.rootProps.id).toBeTruthy()
  })

  it('slideProps emits role=group + aria-roledescription=slide + "Slide N of M: label"', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides }))
    const props = result.current.slideProps(1) as unknown as Record<string, unknown>
    expect(props.role).toBe('group')
    expect(props['aria-roledescription']).toBe('slide')
    expect(props['aria-label']).toBe('Slide 2 of 3: Second')
    expect(props.hidden).toBe(true) // index defaults to 0, slide 1 hidden
  })

  it('uncontrolled defaultIndex sets initial slide', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, defaultIndex: 1 }))
    expect(result.current.index).toBe(1)
  })

  it('next/prev advance index with loop wrap', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides }))
    expect(result.current.index).toBe(0)
    act(() => result.current.next())
    expect(result.current.index).toBe(1)
    act(() => result.current.next())
    act(() => result.current.next())
    // index 2 → next wraps to 0 (loop default true)
    expect(result.current.index).toBe(0)
    act(() => result.current.prev())
    expect(result.current.index).toBe(2)
  })

  it('loop=false clamps at boundaries', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, loop: false }))
    act(() => result.current.prev())
    expect(result.current.index).toBe(0) // clamped at 0
    // 각 act 가 closure refresh — 3 번 분리해야 0→1→2→2(clamp)
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.index).toBe(2) // clamped at last
  })

  it('controlled index ignores internal state', () => {
    const onIndexChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ idx }: { idx: number }) => useCarouselPattern({ slides, index: idx, onIndexChange }),
      { initialProps: { idx: 0 } },
    )
    act(() => result.current.next())
    // controlled — internal state doesn't update; only onIndexChange called
    expect(result.current.index).toBe(0)
    expect(onIndexChange).toHaveBeenCalledWith(1)
    rerender({ idx: 2 })
    expect(result.current.index).toBe(2)
  })

  it('autoplay default false → paused=true → playing=false', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides }))
    expect(result.current.playing).toBe(false)
  })

  it('autoplay=true + no focus/hover → playing=true', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, autoplay: true }))
    expect(result.current.playing).toBe(true)
  })

  it('focus pause is sticky (APG rule 1) — playing remains false even after blur', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, autoplay: true }))
    expect(result.current.playing).toBe(true)
    const onFocusCapture = result.current.rootProps.onFocusCapture as (e: unknown) => void
    act(() => onFocusCapture({} as unknown))
    expect(result.current.playing).toBe(false)
    // simulate blur
    const onBlurCapture = result.current.rootProps.onBlurCapture as (e: unknown) => void
    const fakeBlur = { currentTarget: { contains: () => false }, relatedTarget: null }
    act(() => onBlurCapture(fakeBlur as unknown))
    // explicit pause set on focus → still false until toggleRotation
    expect(result.current.playing).toBe(false)
    act(() => result.current.toggleRotation())
    expect(result.current.playing).toBe(true)
  })

  it('mouse hover pauses, mouseLeave resumes (when not explicitly paused)', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, autoplay: true }))
    const onMouseEnter = result.current.rootProps.onMouseEnter as () => void
    const onMouseLeave = result.current.rootProps.onMouseLeave as () => void
    act(() => onMouseEnter())
    expect(result.current.playing).toBe(false)
    act(() => onMouseLeave())
    expect(result.current.playing).toBe(true)
  })

  it('rotation control aria-label flips Stop ↔ Start', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, autoplay: true }))
    expect((result.current.rotationButtonProps as unknown as Record<string, unknown>)['aria-label']).toBe('Stop slide rotation')
    act(() => result.current.toggleRotation())
    expect((result.current.rotationButtonProps as unknown as Record<string, unknown>)['aria-label']).toBe('Start slide rotation')
  })

  it('prev/next aria-controls reference the carousel container, not active slide (APG)', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, idPrefix: 'cx' }))
    const containerId = result.current.rootProps.id
    expect((result.current.prevButtonProps as unknown as Record<string, unknown>)['aria-controls']).toBe(containerId)
    expect((result.current.nextButtonProps as unknown as Record<string, unknown>)['aria-controls']).toBe(containerId)
  })

  it('liveRegionProps: aria-live=off when playing, polite when paused', () => {
    const { result } = renderHook(() => useCarouselPattern({ slides, autoplay: true }))
    expect((result.current.liveRegionProps as unknown as Record<string, unknown>)['aria-live']).toBe('off')
    act(() => result.current.toggleRotation())
    expect((result.current.liveRegionProps as unknown as Record<string, unknown>)['aria-live']).toBe('polite')
  })
})
