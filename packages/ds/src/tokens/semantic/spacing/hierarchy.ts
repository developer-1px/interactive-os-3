import { pad } from '../../scalar/space'

/**
 * Hierarchy — 위계 시멘틱(재귀 Proximity).
 *
 * Material 3 / Carbon의 ref/sys 2층에서 sys 쪽. raw 수치는 scalar/space 의 pad(),
 * 여기서는 그것에 **위계 레벨 이름**을 붙여 재내보낸다. widget은 raw pad()를 직접
 * 쓰지 말고 hierarchy.X를 import — preset 스왑 안전성 + Gestalt 의미 보존.
 *
 * 게슈탈트 매핑:
 *
 *   L0 atom    — icon↔label 등 row 안 sub-group        Proximity
 *   L1 row     — row 자체(controlBox padding)         Similarity (모양)
 *   L2 group   — listbox 안 row↔row 간격              Common Region (surface)
 *   L3 section — h3↔listbox, section↔section          Continuity
 *   L4 surface — sidebar/panel 내부 padding           Figure/Ground
 *   L5 shell   — surface↔surface (app shell)         Closure
 *
 * 불변식: L0 < L3 < L4 < L5. (L2는 row가 자기 모양으로 분리되므로 0이어도 됨 —
 * Proximity가 아니라 Similarity로 위계가 성립.)
 *
 * row 내부 padding(L1)은 controlBox/rowPadding이 이미 담당하므로 여기엔 토큰 없음.
 *
 * @demo type=spacing fn=hierarchy scale=["atom","group","section","surface","shell"]
 */
export const hierarchy = {
  /** L0 — icon↔label 등 row 안 atom 간격. row 안에서 가장 좁은 거리. */
  atom: pad(0.5),
  /** L2 — listbox 안 row↔row 간격. flush가 기본(0), 호흡 필요한 surface만 키운다. */
  group: pad(0),
  /** L3 — h3↔listbox, section↔section. atom보다 명확히 커야 위계가 성립. */
  section: pad(1),
  /** L4 — sidebar/panel 등 surface 자체의 inner padding. */
  surface: pad(2),
  /** L5 — surface↔surface (app shell 분리). */
  shell: pad(4),
} as const
