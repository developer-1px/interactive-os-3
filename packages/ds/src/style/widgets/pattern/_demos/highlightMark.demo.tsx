/**
 * highlightMark 데모 — `<mark>` 태그 + data-tone 변형.
 * style/widgets/pattern/highlightMark.ts 의 raw markup 시연.
 */
export default () => (
  <p style={{ lineHeight: 1.8 }}>
    <mark data-tone="neutral">neutral</mark>{' '}
    <mark data-tone="info">info</mark>{' '}
    <mark data-tone="success">success</mark>{' '}
    <mark data-tone="warning">warning</mark>{' '}
    <mark data-tone="danger">danger</mark>
  </p>
)
