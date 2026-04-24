/**
 * Outline extractor — semantic unit inventory.
 *
 * 같은 함수를 브라우저(Chrome MCP javascript_tool)와 Node(JSDOM 등) 양쪽에서
 * 실행한다. DOM API는 querySelector / querySelectorAll / getAttribute / textContent
 * 만 쓴다. 원본(HTML class 기반)과 우리 구현(role + data-ds) 양쪽에서 같은
 * Item[] 집합이 나오도록 normalize 규칙을 뒀다.
 *
 * kind   : panel | toolbar | button | field | stat | chart | table | list | legend
 * label  : accessible name (aria-label / heading / button text / panel title)
 * parent : 직계 panel label (없으면 null). diff 시 context 가중치
 * meta   : kind별 보조 정보 (cols/rows/headers/items/value/topBadge/alert/bars/options...)
 *
 * 숨김(hidden 또는 .period-custom-wrap) 노드는 **포함**한다. DOM에 존재하면
 * 구조적 부품으로 간주 — 원본은 display:none로 유지하므로 일관성 확보.
 */
export function extractOutline(root) {
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
  const items = []
  const doc = root.ownerDocument || document
  const byId = (id) => doc.getElementById(id)
  const accName = (el) => {
    const l = el.getAttribute?.('aria-label'); if (l) return norm(l)
    const lby = el.getAttribute?.('aria-labelledby')
    if (lby) {
      const p = lby.split(/\s+/).map((id) => byId(id)?.textContent).filter(Boolean)
      if (p.length) return norm(p.join(' '))
    }
    return ''
  }

  // ── panel detection ────────────────────────────────────────────────
  const PANEL_SEL = '.panel, section[data-ds="Section"][data-emphasis="raised"]'
  const panels = [...root.querySelectorAll(PANEL_SEL)]
  const panelTitleOf = (p) => {
    const m = p.querySelector(':scope > .panel-header .panel-title')
    if (m) return norm(m.firstChild?.textContent || m.textContent)
    // any heading owned directly by this panel (not by nested panels)
    const h = [...p.querySelectorAll('h2, h3')].find((el) => el.closest(PANEL_SEL) === p)
    if (h) return norm(h.firstChild?.textContent || h.textContent).replace(/\s*[—–-]\s*.*$/, '')
    return accName(p)
  }
  const panelSubOf = (p) => {
    const m = p.querySelector('.top10-panel-sub'); if (m) return norm(m.textContent)
    const s = [...p.querySelectorAll(':scope > small, :scope > [data-ds="Text"][data-variant="small"]')]
      .find((el) => el.closest(PANEL_SEL) === p)
    if (s) return norm(s.textContent)
    return ''
  }
  const panelRecord = new Map()
  for (const p of panels) {
    const title = panelTitleOf(p); if (!title) continue
    const sub = panelSubOf(p); panelRecord.set(p, title)
    items.push({ kind: 'panel', label: title, meta: sub ? { sub } : {}, parent: null })
  }
  const panelParent = (el) => { for (const p of panels) if (p.contains(el) && p !== el) return panelRecord.get(p) || null; return null }

  // ── period filter ──────────────────────────────────────────────────
  const pfBar = root.querySelector('.period-filter-bar, [role="toolbar"][aria-label*="기간"]')
  if (pfBar) {
    items.push({ kind: 'toolbar', label: '기간 필터', parent: null, meta: {} })
    for (const b of pfBar.querySelectorAll('button')) items.push({ kind: 'button', label: norm(b.textContent), parent: '기간 필터', meta: {} })
    if (pfBar.querySelector('input[type="date"], .period-custom-wrap')) {
      items.push({ kind: 'field', label: '시작일', parent: '기간 필터', meta: {} })
      items.push({ kind: 'field', label: '종료일', parent: '기간 필터', meta: {} })
    }
    if (pfBar.querySelector('.period-current-label') || pfBar.querySelector('[data-ds="Badge"]')) {
      items.push({ kind: 'field', label: '집계 기준', parent: '기간 필터', meta: {} })
    }
  }

  // ── stat cards ─────────────────────────────────────────────────────
  for (const c of [...root.querySelectorAll('.stat-card, article[data-ds="StatCard"]')]) {
    const label = norm(c.querySelector('.stat-label')?.firstChild?.textContent ?? c.querySelector('dt')?.firstChild?.textContent ?? '')
    if (!label) continue
    items.push({
      kind: 'stat', label, parent: null,
      meta: {
        value: norm(c.querySelector('.stat-value, [data-ds-value]')?.textContent || ''),
        topBadge: !!c.querySelector('.pcl-badge, [data-ds="Badge"]'),
        alert: c.classList?.contains('alert-card') || c.getAttribute?.('data-tone') === 'alert',
      },
    })
  }

  // ── bar chart ──────────────────────────────────────────────────────
  const barChart = root.querySelector('.bar-chart, figure[data-ds="BarChart"]')
  if (barChart) {
    const bars = [...barChart.querySelectorAll('.bar-group, ul > li')]
      .map((b) => norm(b.querySelector('.bar-label, [data-ds-bar-label]')?.textContent || ''))
      .filter(Boolean)
    items.push({ kind: 'chart', label: '역할별 수강 현황', meta: { bars }, parent: panelParent(barChart) })
  }

  // ── level progress rows ────────────────────────────────────────────
  const lvlPanel = panels.find((p) => /레벨/.test(panelTitleOf(p) || ''))
  if (lvlPanel) for (const pr of lvlPanel.querySelectorAll('.prog-track, progress')) {
    if (pr.closest('table')) continue
    const row = pr.closest('.panel-body > div, [data-ds="Row"]') || pr.parentElement
    const lbl = norm(row?.querySelector('.level-badge, [data-ds="Badge"]')?.textContent || '')
    if (lbl && !/^[0-9]+%/.test(lbl)) items.push({ kind: 'field', label: lbl, parent: panelTitleOf(lvlPanel), meta: {} })
  }

  // ── tables (데이터 행만 카운트 — header가 tbody 안에 있어도 td 있는 행만) ──
  for (const t of root.querySelectorAll('table')) {
    const headers = [...t.querySelectorAll('thead th, tr:first-child > th')].map((th) => norm(th.textContent))
    const dataRows = [...t.querySelectorAll('tbody tr')].filter((tr) => tr.querySelector('td')).length
    items.push({
      kind: 'table',
      label: t.getAttribute('aria-label') || panelParent(t) || '(unnamed)',
      meta: { cols: headers.length, rows: dataRows, headers },
      parent: panelParent(t) || '',
    })
  }

  // ── lists (Top10 등) ──────────────────────────────────────────────
  for (const l of root.querySelectorAll('.top10-list, ol[data-ds="Top10List"]')) {
    items.push({ kind: 'list', label: 'Top10', meta: { items: l.querySelectorAll(':scope > *').length }, parent: panelParent(l) })
  }

  // ── legend + select + panel-header buttons ─────────────────────────
  const legendCount = root.querySelectorAll('[data-ds="LegendDot"]').length
  if (legendCount) items.push({ kind: 'legend', label: '범례', meta: { items: legendCount }, parent: '영상별 이탈율' })
  for (const s of root.querySelectorAll('select')) {
    items.push({ kind: 'field', label: accName(s) || '정렬', meta: { options: s.querySelectorAll('option').length }, parent: panelParent(s) })
  }
  for (const b of root.querySelectorAll('.panel-header button, section[data-ds="Section"] header button')) {
    items.push({ kind: 'button', label: norm(b.textContent), parent: panelParent(b), meta: {} })
  }
  for (const b of root.querySelectorAll('button')) {
    if (/^적용$/.test(norm(b.textContent))) items.push({ kind: 'button', label: '적용', parent: '기간 필터', meta: {} })
  }

  return items
}

/** Browser injection string — MCP javascript_tool.text 으로 그대로 사용. */
export const injectScript = `
  ${extractOutline.toString()}
  const __root = document.querySelector('section[aria-roledescription="content"]') || document.getElementById('view-dashboard') || document.body;
  window.__outline = extractOutline(__root);
  window.__outline.length + ' items';
`
