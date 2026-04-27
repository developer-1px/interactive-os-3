/* eslint-disable react-refresh/only-export-components -- showcase 라우트 */
/**
 * /wireframes — 모바일 화면 와이어프레임 카탈로그 라우트 entry.
 *
 *  - 카탈로그 데이터: `screens/<group>.tsx` 21 chapter (자기 등록 — defineScreen + defineGroup)
 *  - chrome (group section + CSS): `wireframes.chrome.tsx`
 *  - HMI audit toolbar: `HmiBar.tsx`
 *  - registry (defineScreen / defineGroup / getGroups): `wireframe-registry.ts`
 *  - 모바일 shell 헬퍼: `wireframe-shell.tsx`
 *
 * Convention discovery — `screens/*.tsx` 를 eager glob 으로 side-effect import 하면
 * 각 chapter 파일이 import 시점에 자기 등록을 수행한다. **새 chapter 추가 시
 * 이 파일은 무수정.**
 */
import {
  cloneElement, isValidElement, useState,
  type ReactElement, type ReactNode,
} from 'react'
import {
  ROOT, Renderer, definePage,
  type NormalizedData,
  Column,
} from '@p/ds'
import { getGroups } from './wireframe-registry'
import { HmiBar } from './HmiBar'
import { Group, wireframesCss, wireframesMobileCss } from './wireframes.chrome'

// 자기 등록 — `screens/*.tsx` 를 eager 로 import 해서 defineScreen / defineGroup 발동.
import.meta.glob('./screens/*.tsx', { eager: true })

function buildDesktopPage(): NormalizedData {
  const canvas: ReactNode = (
    <div data-part="wf-canvas" data-shell="desktop">
      <style>{wireframesCss}</style>

      <HmiBar />

      {getGroups().map((g) => (
        <Group key={g.id} id={g.id} title={g.title} lede={g.lede}>
          {g.screens.map((s) => <span key={s.id}>{s.render()}</span>)}
        </Group>
      ))}
    </div>
  )

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Main', flow: 'split', label: 'Wireframes' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'cluster' } },
      hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: 'Wireframes' } },
      hdrSub: { id: 'hdrSub', data: { type: 'Text', variant: 'small', content: '우리가 가진 widget 으로 짠 모바일 화면 카탈로그 — Chat · Shopping · Learning · Feed · Dashboard · Contracts · Roles · States. 실물 크기 iPhone (393×852pt).' } },

      canvasBlock: { id: 'canvasBlock', data: { type: 'Ui', component: 'Block', content: canvas } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'canvasBlock'],
      hdr: ['hdrTitle', 'hdrSub'],
    },
  }
}

// 모바일 — TikTok 식 snap feed. Group header 와 각 screen 모두 1 snap = 1 화면.
// device chrome 없이 viewport 자체가 device. ScreenDef.render() 의 <Phone/> 에 cloneElement
// 로 bare={true} 주입 — iframe 우회 + CSS 로 figure/frame chrome 풀스크린화.
function buildMobilePage(): NormalizedData {
  const items: ReactNode[] = []
  for (const g of getGroups()) {
    items.push(
      <section key={`title-${g.id}`} data-part="wf-feed-title">
        <Column style={{ gap: 'calc(var(--ds-space) * 3)' }}>
          <strong>({g.id})</strong>
          <h2>{g.title}</h2>
          <p>{g.lede}</p>
        </Column>
      </section>,
    )
    for (const s of g.screens) {
      const el = s.render()
      const bareEl = isValidElement(el)
        ? cloneElement(el as ReactElement<{ bare?: boolean }>, { bare: true })
        : el
      items.push(<div key={s.id} data-screen={s.id}>{bareEl}</div>)
    }
  }

  const canvas: ReactNode = (
    <div data-part="wf-feed" data-shell="mobile">
      <style>{wireframesMobileCss}</style>
      {items}
    </div>
  )

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Main', flow: 'stack', label: 'Wireframes' } },
      canvasBlock: { id: 'canvasBlock', data: { type: 'Ui', component: 'Block', content: canvas } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['canvasBlock'],
    },
  }
}

// Bootstrap-time device pick — 1회 읽기, 구독 없음. resize 시 재계산 안 함 (페이지 새로고침).
const IS_MOBILE = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

export function Wireframes() {
  const [data] = useState(IS_MOBILE ? buildMobilePage : buildDesktopPage)
  return <Renderer page={definePage(data)} />
}
