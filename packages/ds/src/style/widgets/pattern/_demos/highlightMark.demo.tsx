/**
 * highlightMark 데모 — `<mark>` 태그 + data-variant 변형.
 * style/widgets/pattern/highlightMark.ts 의 raw markup 시연.
 */
export default () => (
  <p style={{ lineHeight: 1.8 }}>
    <mark data-variant="default">neutral</mark>{' '}
    <mark data-variant="info">info</mark>{' '}
    <mark data-variant="success">success</mark>{' '}
    <mark data-variant="warning">warning</mark>{' '}
    <mark data-variant="danger">danger</mark>
  </p>
)
