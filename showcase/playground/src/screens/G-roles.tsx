import { Phone, PhoneTopBar, RoleCard } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'

defineGroup('G-Roles',         { id: 'G', title: 'Roles',         lede: 'RoleCard · 정렬 가능한 권한 row.', defaultGuide: 'list' })

// ──────────────────────────────────────────────────────────────────────
// (G) Roles — RoleCard
// ──────────────────────────────────────────────────────────────────────

const Roles_Sortable = defineScreen({
  id: 'cat-roles-sortable',
  app: 'Notion Permissions',
  flow: 'roles',
  category: 'G-Roles',
  patterns: ['role-card-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'RoleCard', 'Button'],
  render: () => (
    <Phone
      label="roles"
      topBar={<PhoneTopBar back title="Roles" action={<span data-icon="plus" aria-label="add" />} />}
    >
      <Body>
        <RoleCard icon={<span data-icon="star" aria-hidden />} name="Owner"   desc="모든 권한"        meta={<small>1 명</small>} />
        <RoleCard icon={<span data-icon="settings" aria-hidden />} name="Admin"   desc="설정 · 멤버 관리"  meta={<small>3 명</small>} />
        <RoleCard icon={<span data-icon="edit" aria-hidden />} name="Editor"  desc="콘텐츠 작성 · 편집" meta={<small>12 명</small>} />
        <RoleCard icon={<span data-icon="user" aria-hidden />} name="Viewer"  desc="읽기 전용"        meta={<small>48 명</small>} />
      </Body>
      <StickyAction><PrimaryButton>변경 저장</PrimaryButton></StickyAction>
    </Phone>
  ),
})
