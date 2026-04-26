/** finder.devtools.Inspector — spec ↔ code 1:1 SSOT 시각화.
 *
 *  좌: FinderStateSpec (현재 값 라이브)
 *  중: FinderCmdSpec (desc·effect·payload — dispatch 버튼)
 *  우: FinderInvariants (runChecks 라이브 결과 ✅/❌)
 *  하: FinderViewSpec (viewFn 출력 키 contract)
 *
 *  LLM 시대의 가치: spec.ts 1개를 읽으면 finder 전체를 재구성 가능.
 *  Inspector 는 spec 의 거울 — 코드 일탈을 즉시 빨갛게 표시한다.
 */
import { useReducer } from 'react'
import {
  FinderStateSpec, FinderCmdSpec, FinderInvariants, FinderViewSpec,
  type FinderCmdType,
} from '../entities/spec'
import type { FinderState, FinderCmd } from '../entities/schema'
import { finderFeature } from '../features/feature'
import { runChecks } from './checks'

const initial: FinderState = { url: '/', pinned: '/', mode: 'columns', query: '' }

const reducer = (s: FinderState, c: FinderCmd): FinderState =>
  finderFeature.on[c.type](s as never, c as never) as FinderState

const samplePayload: { [K in FinderCmdType]: Extract<FinderCmd, { type: K }> } = {
  goto:        { type: 'goto', to: '/a/b' },
  pinFav:      { type: 'pinFav', id: '/x' },
  setMode:     { type: 'setMode', mode: 'list' },
  setQuery:    { type: 'setQuery', q: 'hello' },
  activateCol: { type: 'activateCol', id: '/a/b/c' },
  activateRec: { type: 'activateRec', id: '/today' },
  expandCol:   { type: 'expandCol', id: '/a/b', open: true },
  back:        { type: 'back' },
}

export function FinderInspector() {
  const [state, dispatch] = useReducer(reducer, initial)
  const checks = runChecks(state)
  const passed = checks.filter((c) => c.pass).length

  return (
    <main aria-label="Finder Spec Inspector" style={{ padding: 24, display: 'grid', gap: 24 }}>
      <header>
        <h1>Finder · Spec ↔ Code Inspector</h1>
        <p style={{ opacity: 0.7 }}>
          spec.ts (SSOT) 와 feature.ts (impl) 의 1:1 매핑을 라이브 검증합니다.
          State 는 sample reducer 로 조작 — 실제 라우트와는 무관.
        </p>
      </header>

      <section aria-label="State">
        <h2>State <small>· {Object.keys(FinderStateSpec).length}개 슬롯</small></h2>
        <table>
          <thead><tr><th>key</th><th>desc</th><th>현재 값</th></tr></thead>
          <tbody>
            {Object.entries(FinderStateSpec).map(([k, v]) => (
              <tr key={k}>
                <td><code>{k}</code></td>
                <td>{v.desc}</td>
                <td><code>{JSON.stringify(state[k as keyof FinderState])}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-label="Cmds">
        <h2>Cmds <small>· {Object.keys(FinderCmdSpec).length}개 — 클릭하면 sample payload 로 dispatch</small></h2>
        <table>
          <thead><tr><th>type</th><th>desc</th><th>effect</th><th>dispatch</th></tr></thead>
          <tbody>
            {Object.entries(FinderCmdSpec).map(([type, v]) => (
              <tr key={type}>
                <td><code>{type}</code></td>
                <td>{v.desc}</td>
                <td><code>{v.effect}</code></td>
                <td>
                  <button type="button" onClick={() => dispatch(samplePayload[type as FinderCmdType])}>
                    dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-label="Invariants">
        <h2>Invariants <small>· {passed}/{checks.length} 통과</small></h2>
        <table>
          <thead><tr><th>#</th><th>spec</th><th>결과</th><th>detail</th></tr></thead>
          <tbody>
            {checks.map((c) => (
              <tr key={c.index} style={{ background: c.pass ? 'transparent' : 'rgba(255,80,80,0.1)' }}>
                <td>{c.index}</td>
                <td>{c.spec}</td>
                <td>{c.pass ? '✅' : '❌'}</td>
                <td><code>{c.detail}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-label="View">
        <h2>View 출력 키 contract</h2>
        <table>
          <thead><tr><th>key</th><th>contract</th></tr></thead>
          <tbody>
            {Object.entries(FinderViewSpec).map(([k, v]) => (
              <tr key={k}><td><code>{k}</code></td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
