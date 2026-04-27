/**
 * Sidebar 샘플 데이터 — faker로 생성. 데모/스토리/스크린샷 용도.
 * NormalizedData(Tree용) 단일 형식. seed 고정으로 재현 가능.
 */
import { faker } from '@faker-js/faker'
import { ROOT, EXPANDED, FOCUS, type NormalizedData } from '../../../headless/types'

export interface SampleOptions {
  seed?: number
  sections?: number
  itemsPerSection?: number
  withSubmenus?: boolean
}

export function sampleSidebarTree({
  seed = 7, sections = 3, itemsPerSection = 4, withSubmenus = true,
}: SampleOptions = {}): NormalizedData {
  faker.seed(seed)

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
  }
  const relationships: NormalizedData['relationships'] = { [ROOT]: [] }
  const expandedIds: string[] = []

  // 한 항목을 current=true로 마킹 (활성 라우트 시각화). 같은 id를 focus로도 시드.
  let currentMarked = false
  let focusSeed: string | null = null

  for (let s = 0; s < sections; s++) {
    const secId = `sec${s}`
    entities[secId] = {
      id: secId,
      data: {
        label: faker.helpers.arrayElement(['메인', '콘텐츠', '설정', '워크스페이스', '운영']),
        kind: 'group',
        disabled: true,
      },
    }
    relationships[ROOT].push(secId)
    relationships[secId] = []

    for (let i = 0; i < itemsPerSection; i++) {
      const itemId = `${secId}.it${i}`
      const hasBadge = faker.datatype.boolean({ probability: 0.35 })
      const hasSub = withSubmenus && faker.datatype.boolean({ probability: 0.3 })
      const isCurrent = !currentMarked && s === 0 && i === 1 && !hasSub
      if (isCurrent) { currentMarked = true; focusSeed = itemId }
      // 아이콘은 leaf에만 — submenu 부모는 chevron이 들어가는 자리.
      const iconToken = hasSub
        ? undefined
        : faker.helpers.arrayElement([
            'home', 'users', 'file-text', 'calendar', 'settings',
            'hash', 'inbox', 'star', 'list', 'edit',
          ])
      entities[itemId] = {
        id: itemId,
        data: {
          label: faker.commerce.department(),
          icon: iconToken,
          badge: hasBadge ? faker.number.int({ min: 1, max: 99 }) : undefined,
          current: isCurrent || undefined,
        },
      }
      relationships[secId].push(itemId)
      if (hasSub) {
        relationships[itemId] = []
        expandedIds.push(itemId)
        const subCount = faker.number.int({ min: 2, max: 4 })
        for (let j = 0; j < subCount; j++) {
          const subId = `${itemId}.sub${j}`
          entities[subId] = {
            id: subId,
            data: { label: faker.word.noun() },
          }
          relationships[itemId].push(subId)
        }
      }
    }
  }

  entities[EXPANDED] = { id: EXPANDED, data: { ids: expandedIds } }
  if (focusSeed) entities[FOCUS] = { id: FOCUS, data: { id: focusSeed } }
  return { entities, relationships }
}
