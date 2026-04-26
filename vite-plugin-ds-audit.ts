import type { Plugin } from 'vite'
import type { AuditData } from './vite-plugin-ds-audit/types'
import { parseExports, indexCallSites, detectLeaks } from './vite-plugin-ds-audit/scan'

/**
 * virtual:ds-audit
 *
 * foundations/ 레이어의 건강검진 데이터를 빌드타임에 수집해 Atlas 페이지에 공급한다.
 *
 * 세 축:
 *  1. exports   — foundations/*.ts 의 named export 목록 + JSDoc 첫 줄
 *  2. callSites — export 이름을 widget/ui/ 에서 grep 한 역인덱스
 *  3. leaks     — style/widgets/** 에서 hex 리터럴 / var(--ds-*) 직접 참조 등 foundations/ 우회 흔적
 */

export type { DemoSpec, FoundationExport, CallSite, Leak, AuditData } from './vite-plugin-ds-audit/types'

export default function dsAudit(): Plugin {
  const VIRTUAL = 'virtual:ds-audit'
  const RESOLVED = '\0' + VIRTUAL

  const build = (): AuditData => {
    const root = process.cwd()
    const exports = parseExports(root)
    const callSites = indexCallSites(root, exports.map((e) => e.name))
    const leaks = detectLeaks(root)
    return { exports, callSites, leaks }
  }

  return {
    name: 'ds-audit',
    resolveId(id) { return id === VIRTUAL ? RESOLVED : null },
    load(id) {
      if (id !== RESOLVED) return
      const data = build()
      return `export const audit = ${JSON.stringify(data)}\n`
    },
    handleHotUpdate({ file, server }) {
      if (/src\/ds\/(fn|foundations|palette|style|ui)\//.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
