import { Column, Phone, PhoneTabBar, PhoneTopBar, Row } from '@p/ds'
import { Grid } from '@p/ds/ui/9-layout/Grid'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, tabIcons } from '../wireframe-shell'
import { type } from '@p/ds/tokens/semantic'
import { calendar, dot, meta, todayPill } from '../wireframe-tokens'

defineGroup('U-Calendar',      { id: 'U', title: 'Calendar',      lede: 'Google Calendar 식 월간 grid — weekday header · today pill · event dot.', defaultGuide: 'grid' })

// ──────────────────────────────────────────────────────────────────────
// (U) Calendar — Month grid
// ──────────────────────────────────────────────────────────────────────

const Calendar_Month = defineScreen({
  id: 'cat-calendar-month',
  app: 'Google Calendar',
  flow: 'calendar',
  category: 'U-Calendar',
  patterns: ['month-grid', 'weekday-header', 'today-pill', 'event-dot', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Grid', 'Row', 'Column'],
  render: () => {
    const today = 27
    const events = new Set([5, 12, 19, 21, 22, 27, 30])
    const weekdays = ['월','화','수','목','금','토','일']
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    return (
      <Phone
        label="calendar"
        topBar={<PhoneTopBar back title="2026년 4월" action={<span data-icon="plus" aria-label="add" />} />}
        bottomBar={<PhoneTabBar items={tabIcons(3)} active={3} />}
      >
        <Body>
          <Grid cols={6} style={{ gridTemplateColumns: calendar.cols, ...meta.weak, ...type.weekday }}>
            {weekdays.map(w => <span key={w}>{w}</span>)}
          </Grid>
          <Grid cols={6} style={{ gridTemplateColumns: calendar.cols, rowGap: calendar.rowGap, textAlign: 'center' }}>
            {days.map(d => (
              <Column key={d} style={{ alignItems: 'center', gap: calendar.cellGap }}>
                <span aria-current={d === today ? 'date' : undefined} style={todayPill(d === today)}>{d}</span>
                <span aria-hidden style={dot.event(events.has(d))} />
              </Column>
            ))}
          </Grid>
        </Body>
      </Phone>
    )
  },
})
