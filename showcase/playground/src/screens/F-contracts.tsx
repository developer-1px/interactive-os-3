import { ContractCard, Listbox, MessageBubble, Phone, PhoneTopBar, Row, Tag } from '@p/ds'
import { Card } from '@p/ds/ui/parts/Card'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body } from '../wireframe-shell'

defineGroup('F-Contracts',     { id: 'F', title: 'Contracts',     lede: 'ContractCard · ds 컴포넌트 계약 감사 (검사 목록 · pass/fail · 호출 사이트).' })

// ──────────────────────────────────────────────────────────────────────
// (F) Contracts — ContractCard
// ──────────────────────────────────────────────────────────────────────

const Contract_Audit = defineScreen({
  id: 'cat-contract-audit',
  app: 'Internal Audit',
  flow: 'audit',
  category: 'F-Contracts',
  patterns: ['status-summary-tags', 'contract-card-checklist', 'top-bar-back-search'],
  parts: ['Phone', 'PhoneTopBar', 'Tag', 'Row', 'ContractCard'],
  render: () => (
    <Phone
      label="contract audit"
      topBar={<PhoneTopBar back title="Contracts" action={<span data-icon="search" aria-label="search" />} />}
    >
      <Body>
        <Row flow="cluster"><Tag label="passing 12" /><Tag label="failing 2" /><Tag label="warn 3" /></Row>
        <ContractCard
          name="Listbox" file="ds/ui/4-selection/Listbox.tsx" role="listbox"
          propsSignature="(data, onEvent, autoFocus?)"
          callSites={14}
          badgeTone="good"
          checks={[
            { id: 'aria',     label: 'role=listbox',                pass: true },
            { id: 'roving',   label: 'roving + selection on focus', pass: true },
            { id: 'kbd',      label: '↑↓ Home End typeahead',       pass: true },
            { id: 'event',    label: 'activate on Enter/Space',     pass: true },
          ]}
        />
        <ContractCard
          name="MessageBubble" file="ds/ui/7-patterns/MessageBubble.tsx" role="content"
          propsSignature="(who, time, text, me?)"
          callSites={6}
          badgeTone="warn"
          checks={[
            { id: 'card',  label: 'Card slots binding',     pass: true },
            { id: 'side',  label: 'data-side me/other',     pass: true },
            { id: 'aria',  label: 'aria-label = who',       pass: true },
            { id: 'time',  label: 'Timestamp 부품 사용',     pass: false, note: 'plain string 으로 박혀 있음' },
          ]}
        />
      </Body>
    </Phone>
  ),
})
