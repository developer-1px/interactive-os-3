/** Foundations — foundations/ 레이어 검증 대시보드 페이지. master-slave sidebar (FlatLayout). */
import { useEffect, useMemo, useState } from 'react'
import { audit, type AuditData } from 'virtual:ds-audit'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  SidebarAdminFloating,
  type Event,
} from '../../ds'
import { applyPreset, defaultPreset, hairlinePreset, type DsPreset } from '../../ds/style/preset'
import { buildFoundationsPage, navBase, presetToolsBase } from './build'
import { DemoStyles, renderDemoFromSpec } from './demoRenderers'

const presets: { id: string; label: string; preset: DsPreset }[] = [
  { id: 'default',  label: 'default',  preset: defaultPreset },
  { id: 'hairline', label: 'hairline', preset: hairlinePreset },
]

export function Foundations() {
  const [presetId, setPresetId] = useState('default')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const p = presets.find((x) => x.id === presetId)?.preset ?? defaultPreset
    applyPreset(p)
  }, [presetId])

  const { exports, callSites, leaks } = audit as AuditData
  const byFile = useMemo(() => {
    const out: Record<string, AuditData['exports']> = {}
    for (const e of exports) (out[e.file] ??= []).push(e)
    return Object.entries(out)
  }, [exports])

  const missingDemos = useMemo(() => exports.filter((e) => !e.demo), [exports])

  const navData0 = useMemo(
    () => navBase(filter, byFile, exports.length, leaks.length, missingDemos.length),
    [filter, byFile, exports.length, leaks.length, missingDemos.length],
  )
  const [navData, navDispatch] = useControlState(navData0)
  const onNavEvent = (e: Event) =>
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'activate') setFilter(ev.id)
    })

  const presetData0 = useMemo(() => presetToolsBase(presets, presetId), [presetId])
  const [presetData, presetDispatch] = useControlState(presetData0)
  const onPresetEvent = (e: Event) => {
    presetDispatch(e)
    if (e.type === 'activate') setPresetId(e.id)
  }

  return (
    <>
      <DemoStyles />
      <Renderer
        page={definePage(
          buildFoundationsPage({
            filter,
            exports, callSites, leaks, byFile,
            missingDemos,
            nav: { data: navData, onEvent: onNavEvent },
            presetTools: { data: presetData, onEvent: onPresetEvent },
            renderDemo: renderDemoFromSpec,
          }),
        )}
      />
      <SidebarAdminFloating
        id="foundations-nav-mobile"
        label="Foundations navigation"
        tree={navData}
        onEvent={onNavEvent}
        collection="listbox"
      />
    </>
  )
}
