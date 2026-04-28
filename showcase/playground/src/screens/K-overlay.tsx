import { Heading, Listbox, Phone, PhoneTopBar, TabList, Toolbar, fromList } from '@p/ds'
import { Disclosure } from '@p/ds/ui/6-structure/Disclosure'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body } from '../wireframe-shell'

defineGroup('K-Overlay',       { id: 'K', title: 'Overlay',       lede: 'Disclosure · Dialog · Sheet · Popover — 모달/접힘/플로팅 표면.', defaultGuide: 'grid' })

// ──────────────────────────────────────────────────────────────────────
// (K) Overlay — Disclosure FAQ + Dialog/Sheet 닫힌 상태 (showcase)
// ──────────────────────────────────────────────────────────────────────

const Overlay_FAQ = defineScreen({
  id: 'cat-overlay-faq',
  app: 'Notion Help',
  flow: 'help',
  category: 'K-Overlay',
  patterns: ['accordion-faq', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Heading', 'Disclosure'],
  render: () => (
    <Phone label="FAQ" topBar={<PhoneTopBar back title="도움말" />}>
      <Body>
        <Heading level="h3">자주 묻는 질문</Heading>
        <Disclosure summary="ds/devices/Phone 은 어떤 디바이스를 모방하나요?">
          <p>iPhone 14 Pro 의 논리 폭 393×852pt 입니다. 베젤 + dynamic island + status bar + home indicator 까지 ds 토큰으로 그립니다.</p>
        </Disclosure>
        <Disclosure summary="composite 은 정적 화면에서도 동작하나요?">
          <p>네. Listbox · TabList · Toolbar 는 fromList(items) 로 정적 데이터를 넘기면 keyboard nav · focus · selected 표시까지 그대로 작동합니다. onEvent 만 no-op 이면 됩니다.</p>
        </Disclosure>
        <Disclosure summary="MobileScreen 은 wireframes 전용인가요?">
          <p>네 — Phone wrapper 의 sticky action footer 패턴을 캡슐화한 합성입니다. 다른 라우트가 폰 모사를 한다면 ds/parts 로 승격할 수 있습니다.</p>
        </Disclosure>
        <Disclosure summary="실시간 토큰 테이블은 어떻게 동작하나요?">
          <p>:root 와 모든 stylesheet 의 :root / html 룰을 walk 해서 --ds-* 를 enumerate. preset 을 갈면 즉시 따라옵니다.</p>
        </Disclosure>
      </Body>
    </Phone>
  ),
})
