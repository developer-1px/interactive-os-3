import { Phone, PhoneTopBar, RoleCard } from '@p/ds'
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
        <RoleCard icon="star" name="Owner" desc="모든 권한" meta="1 명" />
        <RoleCard icon="settings" name="Admin" desc="설정 · 멤버 관리" meta="3 명" />
        <RoleCard icon="edit" name="Editor" desc="콘텐츠 작성 · 편집" meta="12 명" />
        <RoleCard icon="user" name="Viewer" desc="읽기 전용" meta="48 명" />
      </Body>
      <StickyAction><PrimaryButton>변경 저장</PrimaryButton></StickyAction>
    </Phone>
  ),
})
