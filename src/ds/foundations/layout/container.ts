/**
 * Container — *환경 폭* 토큰. 컴포넌트가 production 에서 실제로 점유하는 inline-size.
 *
 * 토큰 이름은 *환경* (chat / feed / reading) — modular scale 의 t-shirt size 가 아님.
 * 같은 컴포넌트라도 어느 환경에 들어가느냐로 폭이 달라지고, 그 폭이 가독·UX 의 외부 수렴.
 *
 * 외부 수렴 (벤더 → 채택 폭):
 *   cell      240px  카드 그리드 셀                        (Pinterest · Dribbble · Shopify)
 *   card      320px  단일 카드 (preview + 본문)            (Apple App Store)
 *   chat      360px  모바일 메신저 폭                      (KakaoTalk · iMessage · Slack mobile)
 *   form      420px  단일 폼 (로그인 / 1-step)             (Auth0 · Stripe Elements)
 *   panel     480px  사이드 패널 / Drawer                  (Linear · Slack right pane)
 *   feed      600px  Feed 메인 컬럼                        (Twitter / Threads / Mastodon)
 *   reading   680px  본문 읽기 폭                          (Notion · Medium · Substack)
 *   list      720px  Inbox / GitHub-like list             (Gmail · GitHub Issues)
 *
 * 단조 증가 invariant: cell < card < chat < form < panel < feed < reading < list.
 *
 * widget CSS 는 raw px 직접 쓰지 말고 container.X import — preset 스왑 안전성 유지.
 * layout.ts 가 [data-stage="<name>"] selector 로 일괄 적용.
 */
export const container = {
  cell:    '240px',
  card:    '320px',
  chat:    '360px',
  form:    '420px',
  panel:   '480px',
  feed:    '600px',
  reading: '680px',
  list:    '720px',
} as const

export type ContainerKey = keyof typeof container
