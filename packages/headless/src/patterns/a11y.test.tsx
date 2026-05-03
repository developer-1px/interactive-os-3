/**
 * a11y 통합 — 각 pattern 의 props 를 실제 DOM 에 마운트하여 axe-core 위반 0 을 검증.
 * jsdom + jest-axe 조합. 색·시각 은 jsdom 에서 검증 불가 — pure ARIA semantic rule 만.
 */
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)
import { fromTree } from '../state/fromTree'
import type { NormalizedData } from '../types'

import { useListboxPattern } from './listbox'
import { useTabsPattern } from './tabs'
import { useTreePattern } from './tree'
import { useTreeGridPattern } from './treeGrid'
import { useToolbarPattern } from './toolbar'
import { useRadioGroupPattern } from './radioGroup'
import { useMenuPattern } from './menu'
import { useFeedPattern } from './feed'
import { useGridPattern } from './grid'
import { useCarouselPattern } from './carousel'
import { spinbuttonPattern } from './spinbutton'

const flat = (ids: string[]): NormalizedData =>
  fromTree(ids.map((id) => ({ id, label: id.toUpperCase() })))

const grid3x2 = (): NormalizedData => ({
  entities: {
    r1: {}, r2: {}, r3: {},
    a: { label: 'A' }, b: { label: 'B' },
    c: { label: 'C' }, d: { label: 'D' },
    e: { label: 'E' }, f: { label: 'F' },
  },
  relationships: {
    r1: ['a', 'b'], r2: ['c', 'd'], r3: ['e', 'f'],
  },
  meta: { root: ['r1', 'r2', 'r3'] },
})

describe('axe-core ARIA compliance', () => {
  it('listbox', async () => {
    const data = flat(['o1', 'o2', 'o3'])
    function C() {
      const { rootProps, optionProps, items } = useListboxPattern(data, undefined, { label: 'Fruits' })
      return (
        <div {...rootProps}>
          {items.map((it) => (
            <div key={it.id} {...optionProps(it.id)}>{it.label}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('tabs', async () => {
    const data = flat(['t1', 't2'])
    data.entities.t1!.data = { ...(data.entities.t1!.data ?? {}), selected: true }
    function C() {
      const { rootProps, tabProps, panelProps, items } = useTabsPattern(data, undefined, { label: 'Sections' })
      return (
        <div>
          <div {...rootProps}>
            {items.map((it) => (
              <button type="button" key={it.id} {...tabProps(it.id)}>{it.label}</button>
            ))}
          </div>
          {items.map((it) => (
            <div key={it.id} {...panelProps(it.id)}>{`Panel ${it.label}`}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('tree', async () => {
    const data = flat(['n1', 'n2'])
    function C() {
      const { rootProps, itemProps, items } = useTreePattern(data, undefined, { label: 'Files' })
      return (
        <div {...rootProps}>
          {items.map((it) => (
            <div key={it.id} {...itemProps(it.id)}>{it.label}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('treegrid', async () => {
    const data = grid3x2()
    function C() {
      const { treegridProps, rowProps, columnheaderProps, rowheaderProps, gridcellProps, items } =
        useTreeGridPattern(data, undefined, { label: 'Items' })
      return (
        <div {...treegridProps}>
          <div role="row" aria-rowindex={1}>
            <div {...columnheaderProps(0)}>Name</div>
            <div {...columnheaderProps(1)}>Value</div>
          </div>
          {items.map((it, i) => (
            <div key={it.id} {...rowProps(it.id)} aria-rowindex={i + 2}>
              <div {...rowheaderProps(it.id)}>{it.label}</div>
              <div {...gridcellProps(it.id, 1)}>Value</div>
            </div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('toolbar', async () => {
    const data = flat(['save', 'open'])
    function C() {
      const { rootProps, itemProps, items } = useToolbarPattern(data, undefined, { label: 'Editor' })
      return (
        <div {...rootProps}>
          {items.map((it) => (
            <button type="button" key={it.id} {...itemProps(it.id)}>{it.label}</button>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('radiogroup', async () => {
    const data = flat(['s', 'm', 'l'])
    data.entities.s!.data = { ...(data.entities.s!.data ?? {}), selected: true }
    function C() {
      const { rootProps, radioProps, items } = useRadioGroupPattern(data, undefined, { label: 'Size' })
      return (
        <div {...rootProps}>
          {items.map((it) => (
            <div key={it.id} {...radioProps(it.id)}>{it.label}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('menu', async () => {
    const data = flat(['cut', 'copy', 'paste'])
    function C() {
      const { rootProps, itemProps, items } = useMenuPattern(data, undefined, { label: 'Actions' })
      return (
        <div {...rootProps}>
          {items.map((it) => (
            <div key={it.id} {...itemProps(it.id)}>{it.label}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('feed', async () => {
    const items = [{ id: 'a1', label: 'a1' }, { id: 'a2', label: 'a2' }]
    function C() {
      const { rootProps, articleProps, labelProps, items: rendered } =
        useFeedPattern(items, undefined, { label: 'Posts' })
      return (
        <div {...rootProps}>
          {rendered.map((it) => (
            <article key={it.id} {...articleProps(it.id)}>
              <h3 {...labelProps(it.id)}>{it.label}</h3>
            </article>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('grid', async () => {
    const data = grid3x2()
    function C() {
      const { rootProps, rowProps, cellProps, rows } = useGridPattern(data, undefined, { label: 'Cells' })
      return (
        <div {...rootProps}>
          {rows.map((r) => (
            <div key={r.id} {...rowProps(r.id)}>
              {r.cells.map((c) => (
                <div key={c.id} {...cellProps(c.id)}>{c.label}</div>
              ))}
            </div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('carousel', async () => {
    function C() {
      const slides = [{ id: 's1', label: 'First' }, { id: 's2', label: 'Second' }]
      const { rootProps, slideProps, prevButtonProps, nextButtonProps, rotationButtonProps } =
        useCarouselPattern({ slides, label: 'News' })
      return (
        <div {...rootProps}>
          <button type="button" {...prevButtonProps} />
          <button type="button" {...nextButtonProps} />
          <button type="button" {...rotationButtonProps} />
          {slides.map((s, i) => (
            <div key={s.id} {...slideProps(i)}>{s.label}</div>
          ))}
        </div>
      )
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })

  it('spinbutton', async () => {
    function C() {
      const { spinbuttonProps } = spinbuttonPattern(5, undefined,
        { min: 0, max: 10, step: 1, label: 'Quantity' })
      return <div {...spinbuttonProps}>5</div>
    }
    expect(await axe((render(<C />)).container)).toHaveNoViolations()
  })
})
