/**
 * HmiBar — HMI(Hierarchy Monotonicity Invariant) audit toolbar.
 *
 * 위계 단조 invariant 위반(자식 padding > 부모 분리), redundant padding
 * (부모/자식 padding 동시), gap stair(형제 padding 불균형) 감지 toggle.
 *
 * sticky top — wireframe 카탈로그 위에 떠 있어 즉시 감사 실행 가능.
 */
import { useState } from 'react'
import { LegendDot } from '@p/ds'
import { auditAll, clearAll } from './hmi-audit'
import { hmiBar, meta, type } from './wireframe-tokens'

export function HmiBar() {
  const [report, setReport] = useState<{ total: number; byType: Record<string, number> } | null>(null)
  const run = () => {
    // iframe 들이 아직 mount 중일 수 있어 다음 frame 에 실행
    requestAnimationFrame(() => setReport(auditAll()))
  }
  const clear = () => { clearAll(); setReport(null) }
  return (
    <div data-part="hmi-bar" style={{
      display: 'flex', gap: hmiBar.gap, alignItems: 'center',
      padding: hmiBar.pad,
      background: hmiBar.bg, border: hmiBar.border,
      borderRadius: hmiBar.shape,
      ...type.mono,
      position: 'sticky', top: hmiBar.top, zIndex: hmiBar.zIndex,
    }}>
      <strong>HMI Audit</strong>
      <button type="button" onClick={run} data-emphasis="primary">감사 실행</button>
      <button type="button" onClick={clear}>지우기</button>
      {report && (
        <div style={{ display: 'flex', gap: hmiBar.reportGap }}>
          <span>총 {report.total} 위반</span>
          <span><LegendDot tone="danger" /> 단조 위반 {report.byType['monotonic-violation']}</span>
          <span><LegendDot tone="warning" /> redundant padding {report.byType['redundant-padding']}</span>
          <span><LegendDot tone="info" /> gap stair {report.byType['gap-stair']}</span>
        </div>
      )}
      <small style={{ marginInlineStart: 'auto', ...meta.weak }}>
        단조 위반 = 자식 padding &gt; 부모 분리 · redundant = 부모/자식 padding 동시 · stair = 형제 padding 불균형
      </small>
    </div>
  )
}
