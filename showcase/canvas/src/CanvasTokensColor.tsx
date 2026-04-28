/**
 * CanvasTokensColor — Atlas Color screen 의 5 sub-section.
 *
 * 출처: docs/inbox/screens-foundation.jsx ColorScreen
 *   01 Brand    — Accent
 *   02 Neutrals — Background · Surface · Muted · Raised
 *   03 Text     — Primary · Strong · Subtle · Mute · Inverse
 *   04 Borders  — Subtle · Default · Strong · Emphatic
 *   05 Status   — Success · Warning · Danger
 *
 * cell 렌더링은 <TokenPreview kind="color">. 그룹 라벨은 Atlas 정본 따라 hardcoded.
 * 값은 foundations/color SSOT 함수 호출.
 */
import { accent, surface, text, border, status } from '@p/ds/tokens/semantic'
import { SubGroup } from './SectionFrame'
import { TokenPreview } from './preview'

type Swatch = { name: string; call: string; value: string }

const COLORS: Record<string, Swatch[]> = {
  brand: [
    { name: 'Accent', call: 'accent()', value: accent() },
  ],
  neutral: [
    { name: 'Background', call: "surface('default')",              value: surface('default') },
    { name: 'Surface',    call: "surface('subtle')", value: surface('subtle') },
    { name: 'Muted',      call: "surface('subtle')",  value: surface('subtle') },
    { name: 'Raised',     call: "surface('raised')", value: surface('raised') },
  ],
  text: [
    { name: 'Primary', call: 'text()',          value: text() },
    { name: 'Strong',  call: "text('strong')",  value: text('strong') },
    { name: 'Subtle',  call: "text('subtle')",  value: text('subtle') },
    { name: 'Mute',    call: "text('mute')",    value: text('mute') },
    { name: 'Inverse', call: "text('inverse')", value: text('inverse') },
  ],
  border: [
    { name: 'Subtle',   call: "border('subtle')",   value: border('subtle') },
    { name: 'Default',  call: 'border()',           value: border() },
    { name: 'Strong',   call: "border('strong')",   value: border('strong') },
    { name: 'Emphatic', call: "border('emphatic')", value: border('emphatic') },
  ],
  status: [
    { name: 'Success', call: "status('success')", value: status('success') },
    { name: 'Warning', call: "status('warning')", value: status('warning') },
    { name: 'Danger',  call: "status('danger')",  value: status('danger') },
  ],
}

function Group({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <SubGroup title={title}>
      <div data-part="canvas-color-grid">
        {swatches.map((s) => (
          <TokenPreview key={s.name} kind="color" value={s.value} name={s.name} call={s.call} />
        ))}
      </div>
    </SubGroup>
  )
}

export function CanvasTokensColor() {
  return (
    <div data-part="canvas-color-frame">
      <Group title="Brand"    swatches={COLORS.brand} />
      <Group title="Neutrals" swatches={COLORS.neutral} />
      <Group title="Text"     swatches={COLORS.text} />
      <Group title="Borders"  swatches={COLORS.border} />
      <Group title="Status"   swatches={COLORS.status} />
    </div>
  )
}
