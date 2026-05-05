/**
 * axis.chords — phase 4 (PRD #38).
 * 모든 axis 가 자신이 응답하는 chord 목록을 노출. demo 가 probe/dedupe 없이 axisKeys 한 줄.
 */
import { describe, expect, it } from 'vitest'
import { activate, escape, navigate, treeNavigate, treeExpand, expand, gridNavigate, select, multiSelect, typeahead, composeAxes, axisKeys } from './index'

describe('axis.chords meta', () => {
  it('escape exposes Escape', () => {
    expect(escape.chords).toEqual(['Escape'])
  })

  it('navigate(vertical) exposes Arrow + Home/End', () => {
    expect([...navigate('vertical').chords]).toEqual(['ArrowUp', 'ArrowDown', 'Home', 'End'])
  })

  it('treeNavigate exposes Arrow + Home/End', () => {
    expect([...treeNavigate.chords]).toEqual(['ArrowDown', 'ArrowUp', 'Home', 'End'])
  })

  it('treeExpand exposes Right/Left/Enter/Space', () => {
    expect([...treeExpand.chords]).toEqual(expect.arrayContaining(['ArrowRight', 'ArrowLeft', 'Enter', 'Space']))
  })

  it('expand exposes Right/Enter/Space + Left', () => {
    expect([...expand.chords]).toEqual(expect.arrayContaining(['ArrowRight', 'ArrowLeft']))
  })

  it('gridNavigate exposes 8 directions', () => {
    expect(gridNavigate.chords.length).toBe(8)
  })

  it('select exposes Space + Click', () => {
    expect([...select.chords]).toEqual(expect.arrayContaining(['Space', 'Click']))
  })

  it('multiSelect exposes shift/meta/ctrl click variants', () => {
    expect([...multiSelect.chords]).toEqual(expect.arrayContaining(['Click', 'Shift+Click', 'Meta+Click', 'Control+Click']))
  })

  it('activate exposes Enter/Space + Click', () => {
    expect([...activate.chords]).toEqual(expect.arrayContaining(['Enter', 'Space', 'Click']))
  })

  it('typeahead uses placeholder for printable', () => {
    expect(typeahead.chords).toEqual(['<printable>'])
  })

  it('composeAxes flattens + dedups chords', () => {
    const ax = composeAxes(navigate('vertical'), activate)
    expect([...ax.chords]).toEqual(expect.arrayContaining(['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Space', 'Click']))
  })

  it('axisKeys extracts key part (Space → " ")', () => {
    const ax = composeAxes(navigate('vertical'), activate)
    expect(axisKeys(ax)).toEqual(expect.arrayContaining(['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ', 'Click']))
  })
})
