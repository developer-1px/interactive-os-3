/* eslint-disable react-refresh/only-export-components -- showcase 라우트 */
/**
 * /wireframes — 모바일 화면 와이어프레임 카탈로그 라우트 entry.
 *
 *  - 카탈로그 데이터: `screens/<group>.tsx` 21 chapter (자기 등록 — defineScreen + defineGroup)
 *  - chrome (group section + CSS): `wireframes.chrome.tsx`
 *  - 상단 toolbar: `GridOverlayToggle` — 4-column / 16px gutter design grid overlay 전체 토글
 *  - registry (defineScreen / defineGroup / getGroups): `wireframe-registry.ts`
 *  - 모바일 shell 헬퍼: `wireframe-shell.tsx`
 *
 * Convention discovery — `screens/*.tsx` 를 eager glob 으로 side-effect import 하면
 * 각 chapter 파일이 import 시점에 자기 등록을 수행한다. **새 chapter 추가 시
 * 이 파일은 무수정.**
 */
import {
  cloneElement, isValidElement, useEffect, useState,
  type ReactElement, type ReactNode,
} from 'react'
import {
  ROOT, Renderer, definePage,
  type NormalizedData,
  Column,
} from '@p/ds'
import { slot } from '@p/ds/tokens/foundations'
import { getGroups, getGroup } from './wireframe-registry'
import type { LayoutGuide, ScreenDef } from './wireframe-screens'
import { Group, wireframesCss, wireframesMobileCss } from './wireframes.chrome'

// 자기 등록 — `screens/*.tsx` 를 eager 로 import 해서 defineScreen / defineGroup 발동.
import.meta.glob('./screens/*.tsx', { eager: true })

function buildDesktopPage(): NormalizedData {
  const canvas: ReactNode = (
    <div data-part="wf-canvas" data-shell="desktop">
      <style>{wireframesCss}{guideSpacingCss}</style>

      <GridOverlayToggle />

      {getGroups().map((g) => (
        <Group key={g.id} id={g.id} title={g.title} lede={g.lede}>
          {g.screens.map((s) => {
            const guide = resolveGuide(s)
            return (
              <span
                key={s.id}
                data-screen={s.id}
                data-screen-guide={guide}
                data-screen-grid={GUIDE_GRID[guide]}
              >
                {s.render()}
              </span>
            )
          })}
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
      const guide = resolveGuide(s)
      items.push(
        <div
          key={s.id}
          data-screen={s.id}
          data-screen-guide={guide}
          data-screen-grid={GUIDE_GRID[guide]}
        >
          {bareEl}
        </div>,
      )
    }
  }

  const canvas: ReactNode = (
    <div data-part="wf-feed" data-shell="mobile">
      {/* wireframesCss (overlay 규칙 + toggle base) 도 같이 — mobile bare 라 iframe 복제 없음. */}
      <style>{wireframesCss}{wireframesMobileCss}{guideSpacingCss}</style>
      <GridOverlayToggle />
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

/**
 * GridOverlayToggle — design grid overlay preset 라디오 토글.
 *
 * Preset:
 *  - off       overlay 없음
 *  - 4col      4-column / 16px gutter / 16px margin (앱 콘텐츠 영역 표준)
 *  - list      목록형 — 16px margin + 56px row baseline 가이드
 *  - feed      피드형 — full-bleed + 카드 cut (200px) 가이드
 *  - content   본문형 — 24px margin + 단일 컬럼 reading measure
 *  - baseline  8pt vertical rhythm grid
 *
 * 적용 범위:
 *  - 모바일 (bare): 동일 document 의 phone-body 에 ::after overlay
 *  - 데스크탑 (iframe): 각 phone iframe documentElement 에 data-grid 주입.
 *    `useHeadClone` 이 부모 <style> 를 iframe head 로 복제하므로 같은 selector 매치.
 */
const GRID_MODES = [
  { id: 'auto',     label: 'Auto' },
  { id: 'off',      label: 'Off' },
  { id: '4col',     label: '4 col' },
  { id: 'list',     label: '목록' },
  { id: 'feed',     label: '피드' },
  { id: 'content',  label: '본문' },
  { id: 'baseline', label: '8pt' },
] as const

type GridMode = typeof GRID_MODES[number]['id']
type ScreenGrid = Exclude<GridMode, 'auto' | 'off'>

/**
 * Guide → grid overlay preset. 8개 guide 가 4개 grid 로 수렴.
 * (LayoutGuide 자체는 wireframe-screens.tsx 에 정의 — ScreenDef 의 1차 분류 축)
 */
const GUIDE_GRID: Record<LayoutGuide, ScreenGrid> = {
  list:    'list',
  thread:  'list',
  feed:    'feed',
  grid:    '4col',
  article: 'content',
  form:    'content',
  hero:    'content',
  state:   'content',
}

/**
 * 화면의 effective guide — explicit override 우선, 아니면 그룹의 defaultGuide.
 * 카테고리 default 는 `defineGroup({ defaultGuide })` 에 co-located.
 */
function resolveGuide(s: ScreenDef): LayoutGuide {
  return s.guide ?? getGroup(s.category)?.defaultGuide ?? 'list'
}

/**
 * Guide → semantic spacing CSS.
 *
 * 각 guide 가 ds slot.<guide> 토큰 (= role semantic, hierarchy 컴포지션) 을 들고 있다.
 * 이 함수가 그걸 phone-body 가 읽는 CSS var (--phone-body-pad/--phone-body-gap) 로 emit.
 *
 * Phone primitive 는 var 를 fallback 과 함께 읽으므로 (Phone.tsx phone-body 참조),
 * data-screen-guide 가 ancestor 에 있으면 자동 적용.
 *
 * 적용 경계:
 *  - 모바일 (bare): wrapper [data-screen-guide=...] 가 phone-body ancestor → cascade 매치
 *  - 데스크탑 (iframe): iframe documentElement 에 data-screen-guide 별도 push (cross-doc)
 */
const GUIDE_KEYS: readonly LayoutGuide[] =
  ['list', 'thread', 'feed', 'grid', 'article', 'form', 'hero', 'state']

const guideSpacingCss = GUIDE_KEYS.map((g) => {
  const s = slot[g] as { pad: string; gap: string }
  return `[data-screen-guide="${g}"] [data-part="phone-body"] {
    --phone-body-pad: ${s.pad};
    --phone-body-gap: ${s.gap};
  }`
}).join('\n')

function GridOverlayToggle() {
  const [mode, setMode] = useState<GridMode>('auto')
  useEffect(() => {
    const apply = () => {
      // (1) Spacing — guide → CSS 규칙 매치를 위해 iframe documentElement 에 data-screen-guide 푸시.
      //     (mobile bare 는 wrapper ancestor 로 자연 cascade — push 불필요.)
      document.querySelectorAll<HTMLElement>('[data-screen][data-screen-guide]').forEach((el) => {
        const iframe = el.querySelector<HTMLIFrameElement>('[data-part="phone"] iframe')
        if (iframe) {
          try {
            const doc = iframe.contentDocument
            if (doc) doc.documentElement.dataset.screenGuide = el.dataset.screenGuide!
          } catch { /* cross-origin */ }
        }
      })

      // (2) Grid overlay — mode 별 분기.
      if (mode === 'auto') {
        document.documentElement.dataset.grid = ''
        document.querySelectorAll<HTMLElement>('[data-screen][data-screen-grid]').forEach((el) => {
          el.dataset.grid = el.dataset.screenGrid!
          const iframe = el.querySelector<HTMLIFrameElement>('[data-part="phone"] iframe')
          if (iframe) {
            try {
              const doc = iframe.contentDocument
              if (doc) doc.documentElement.dataset.grid = el.dataset.screenGrid!
            } catch { /* cross-origin */ }
          }
        })
      } else {
        document.documentElement.dataset.grid = mode
        document.querySelectorAll<HTMLElement>('[data-screen][data-screen-grid]').forEach((el) => {
          el.removeAttribute('data-grid')
        })
        document.querySelectorAll<HTMLIFrameElement>('[data-part="phone"] iframe').forEach((f) => {
          try {
            const doc = f.contentDocument
            if (doc) doc.documentElement.dataset.grid = mode
          } catch { /* cross-origin */ }
        })
      }
    }
    apply()
    // 늦게 mount 되는 iframe 대응 — 카탈로그가 다 그려지기까지 몇 frame 여유.
    const ids = [setTimeout(apply, 100), setTimeout(apply, 500), setTimeout(apply, 1500)]
    return () => ids.forEach(clearTimeout)
  }, [mode])

  return (
    <div data-part="wf-grid-toggle" role="radiogroup" aria-label="Grid overlay preset">
      {GRID_MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={mode === m.id}
          onClick={() => setMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

// Bootstrap-time device pick — 1회 읽기, 구독 없음. resize 시 재계산 안 함 (페이지 새로고침).
const IS_MOBILE = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

export function Wireframes() {
  const [data] = useState(IS_MOBILE ? buildMobilePage : buildDesktopPage)
  return <Renderer page={definePage(data)} />
}
