# Inspector — DS 압력 테스트 결과

Figma Properties Inspector를 ds 기존 부품만으로 복제하려다 드러난 것들.

## Gaps — 1차 라운드에서 해소

ds 원칙(classless + ARIA + 업계 수렴)에 맞춰 **native HTML 입력을 얇게 감싸 role 래퍼로 승격**. APG spinbutton/slider/combobox 패턴은 HTML이 이미 내장이므로 커스텀 대신 native를 채택.

| Role | 컴포넌트 | 파일 |
|------|----------|------|
| `role=spinbutton` (native) | `NumberInput` | [NumberInput.tsx](src/controls/ui/form/NumberInput.tsx) |
| `role=slider` (native) | `Slider` | [Slider.tsx](src/controls/ui/form/Slider.tsx) |
| `role=textbox` (native) | `Input` | [Input.tsx](src/controls/ui/form/Input.tsx) |
| `role=combobox` (native `<select>`) | `Select` | [Select.tsx](src/controls/ui/form/Select.tsx) |
| `<input type=color>` | `ColorInput` | [ColorInput.tsx](src/controls/ui/form/ColorInput.tsx) |

ds.css 추가: [src/ds/css/widgets/slider.ts](src/ds/css/widgets/slider.ts) — range/color 위젯 토큰 기반 스타일.

**prop = ARIA 그대로** 원칙 준수: `value/onChange/min/max/step` 네이티브 속성 그대로. 변환 없음.

## Gaps — 아직 남은 것

### 1. 독립 Popover (비-menu)
- **필요**: Effects 편집, Color 고급 picker, Select의 커스텀 팝업
- **현재**: `MenuPopover`만 존재 (menu 컨텍스트 묶임)
- **수렴 후보**: HTML Popover API (`[popover]` + `popovertarget`) — 2024부터 de facto. Radix/Base/Ariakit 모두 이쪽으로 수렴 중.
- **우선순위**: Inspector 현 기능은 Effects Edit 버튼이 Dialog로 대체 가능하므로 2차

### 2. SegmentedControl
- **필요**: Layout direction, Stroke style (둘 다 현재 Toolbar+pressed로 대체)
- **논점**: 정립된 role 없음. APG는 Radio group 또는 Toolbar 제안. 지금은 Toolbar로 의미상 동치 유지. 별도 부품 불필요할 수도.
- **결론**: **보류**. ds Toolbar로 이미 기능 동일, role 추가는 과잉.

### 3. Shell 레이아웃 일반화
- Inspector의 `<aside>`가 canvas 옆이 아니라 아래로 흐름 — shell CSS가 Finder 전용 roledescription에 묶여 있음
- 수정 지점: [src/ds/css/shell/](src/ds/css/shell/) panes.ts 범용화
- 범위 밖 — 별도 /handoff 또는 shell 리팩토링 태스크

## Duplications

### ✅ 추출: `Field` (label+control+unit)
- 20+회 반복 → [Field.tsx](src/inspector/Field.tsx)
- ds 승격 후보지만 `aria-roledescription` 기반이라 role 신설은 과함. 앱 로컬 유지

### 🟡 반복 중: color dual-input (ColorInput + Input)
- Fill/Stroke 2곳. 3번째(effect별 색상)가 생기면 `ColorField`로 승격

### 🟡 panel-section 래퍼
- 8곳 반복. Disclosure로 교체 가능 (접기/펼치기는 Figma 원본 동작)
- 별도 논의 후 적용

## invariant 실전 검증

| invariant | 결과 |
|---|---|
| classless (ARIA + tag only) | ✅ Inspector·신규 컴포넌트 전부 className 0 |
| no escape hatches (raw `role=`) | ✅ `aria-roledescription`만 사용 (Field의 field/control/unit), 실 role 신설 없음 |
| ds.css 제너레이터 경유 | ✅ slider/color는 [src/ds/css/widgets/slider.ts](src/ds/css/widgets/slider.ts)에 추가 |
| 업계 수렴 우선 (native HTML) | ✅ spinbutton/slider/textbox/combobox 전부 native 경로로 |
| prop = ARIA 그대로 | ✅ value/min/max/step 네이티브 그대로 전달 |

## 다음 단계 권장

1. 독립 Popover role (HTML Popover API 기반)
2. Shell 레이아웃 범용화 (panes.ts)
3. Field role을 ds 내부로 승격할지 판정 (패턴이 finder 등 다른 앱에도 재등장하는지)
