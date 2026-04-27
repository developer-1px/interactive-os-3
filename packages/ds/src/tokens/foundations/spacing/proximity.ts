import { emStep, insetStep } from '../../palette/space'

/**
 * Gestalt proximity — 거리=관계 의미. 7단계 시맨틱 (foundations layer).
 *
 * 핵심 원칙: 거리가 가까울수록 연관, 멀수록 분리. 마진 위계는 시각이 아니라 의미로 결정.
 *
 *   bonded  (0.25em) — 붙음        (heading → 자기 본문)
 *   related (0.5em)  — 직접 연관    (li → li, dt → dd)
 *   sibling (1em)    — 형제 항목    (p → p)
 *   group   (1.5em)  — 소그룹       (h5·h6 mt)
 *   section (2em)    — 섹션 분리    (h3·h4 mt)
 *   major   (3em)    — 메이저 분리  (h2 mt)
 *   page    (4em)    — 페이지 break (h1 mt, hr)
 *
 * 수치 자체는 palette/emStep에 정의. 여기는 의미 → 인덱스 매핑만.
 *
 * @demo type=value fn=proximity args=["section"]
 */
export type Proximity = 'bonded' | 'related' | 'sibling' | 'group' | 'section' | 'major' | 'page'

export const proximity = (rel: Proximity) => {
  const map: Record<Proximity, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
    bonded: 0,
    related: 1,
    sibling: 2,
    group: 3,
    section: 4,
    major: 5,
    page: 6,
  }
  return emStep(map[rel])
}

/**
 * Inset — 컴포넌트 *내부* padding scale. proximity(블록 간 마진)와 의도적으로 분리.
 *
 *   xs (0.2em) — inline code padding-y
 *   sm (0.4em) — inline code padding-x
 *   md (0.6em) — 일반 inline padding
 *   lg (1em)   — blockquote padding-inline-start 등 large inset
 *
 * @demo type=value fn=inset args=["sm"]
 */
export type Inset = 'xs' | 'sm' | 'md' | 'lg'

export const inset = (size: Inset) => {
  const map: Record<Inset, 0 | 1 | 2 | 3> = { xs: 0, sm: 1, md: 2, lg: 3 }
  return insetStep(map[size])
}
