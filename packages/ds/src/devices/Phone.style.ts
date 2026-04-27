import { css, hairlineWidth, neutral, pad, radius, weight } from '../tokens/foundations'

/**
 * Phone — iPhone device chrome CSS. 실물 크기 (393×852pt = iPhone 14 Pro 논리 폭).
 *
 * 외부 수렴: Apple HIG (status bar 47pt · home indicator 5pt · safe area).
 *
 * Phone 자체는 *컨테이너* — 내부 콘텐츠는 ds 부품(Skeleton, Tag, Button, Card 등)이
 * 채운다. status bar / topbar / tabbar / home indicator 만 phone 전용 chrome.
 */
export const phone = () => css`
  [data-part="phone"] {
    margin: 0;
    display: flex; flex-direction: column;
    align-items: center;
    gap: ${pad(2)};
  }
  [data-part="phone-frame"] {
    /* iPhone 14 Pro 실물 폭 393pt + 베젤 7px. height 852pt + bezel.
       embed=iframe 모드 — phone-screen 안에 iframe 을 그대로 깔아 viewport 가 393px 이 되어
       ds 의 @media (max-width:600px) 모바일 분기가 자연 발동. (Storybook · Chromatic 패턴) */
    inline-size: 407px;
    block-size: 866px;
    background: var(--ds-bg);
    border-radius: 56px;
    border: 8px solid ${neutral(9)};
    overflow: hidden;
    display: grid;
    grid-template-rows: 47px 1fr 24px;
    position: relative;
    box-shadow:
      0 1px 0 0 ${neutral(2)} inset,
      0 -1px 0 0 ${neutral(2)} inset,
      0 24px 48px -12px color-mix(in oklch, ${neutral(9)} 25%, transparent);
  }
  [data-part="phone-screen"] > iframe {
    inline-size: 100%;
    block-size: 100%;
    border: 0;
    background: var(--ds-bg);
    display: block;
  }

  /* Status bar — 47pt (iOS standard) */
  [data-part="phone-status"] {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 ${pad(7)};
    font-size: 17px;
    font-weight: ${weight('semibold')};
    font-variant-numeric: tabular-nums;
    color: var(--ds-fg);
  }
  [data-part="phone-time"]    { justify-self: start; }
  [data-part="phone-signals"] { justify-self: end; display: inline-flex; gap: ${pad(1)}; align-items: center; }
  [data-part="phone-signal"], [data-part="phone-wifi"] {
    inline-size: 17px; block-size: 11px;
    background: var(--ds-fg);
    border-radius: 2px;
  }
  [data-part="phone-wifi"]    { mask: radial-gradient(ellipse at bottom, var(--ds-fg) 60%, transparent 62%); }
  [data-part="phone-battery"] {
    inline-size: 25px; block-size: 12px;
    border: 1.5px solid var(--ds-fg);
    border-radius: 3px;
    position: relative;
  }
  [data-part="phone-battery"]::after {
    content: ''; position: absolute;
    inset: 1.5px;
    background: var(--ds-fg);
    border-radius: 1px;
  }
  [data-part="phone-battery"]::before {
    content: ''; position: absolute;
    inset-inline-end: -3px; inset-block: 3px;
    inline-size: 1.5px;
    background: var(--ds-fg);
    border-radius: 0 1px 1px 0;
  }
  [data-part="phone-notch"] {
    justify-self: center;
    background: ${neutral(9)};
    border-radius: ${radius('pill')};
  }
  [data-part="phone-notch"][data-shape="island"]  { inline-size: 124px; block-size: 37px; }
  [data-part="phone-notch"][data-shape="classic"] { inline-size: 154px; block-size: 30px; border-radius: 0 0 18px 18px; }

  /* Screen viewport — chrome 경계만. 컨텐츠 padding 은 PhoneShell 의
     phone-body 가 단독 소유 (chrome ↔ content 책임 분리). 여기에 padding 을
     추가하면 iframe 모드에서 이중 패딩으로 여백 발생. */
  [data-part="phone-screen"] {
    overflow: hidden;
    min-block-size: 0;
    display: block;
  }

  /* Home indicator — 5pt high pill */
  [data-part="phone-home"] {
    margin-inline: auto;
    inline-size: 134px; block-size: 5px;
    background: var(--ds-fg);
    border-radius: ${radius('pill')};
    align-self: center;
    margin-block-start: ${pad(1)};
  }

  /* Top bar — sticky NavigationBar. 44pt iOS standard. */
  [data-part="phone-topbar"] {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(2)} ${pad(4)};
    block-size: 44px;
    border-block-end: ${hairlineWidth()} solid var(--ds-border);
    background: var(--ds-bg);
  }
  [data-part="phone-topbar-lead"]  { justify-self: start; font-size: var(--ds-text-xl); line-height: 1; }
  [data-part="phone-topbar-trail"] { justify-self: end; font-size: var(--ds-text-md); }
  [data-part="phone-topbar-title"] {
    grid-column: 2;
    font-size: var(--ds-text-md);
    font-weight: ${weight('semibold')};
    text-align: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* Tab bar — sticky bottom nav. 49pt iOS standard. */
  [data-part="phone-tabbar"] {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    block-size: 49px;
    border-block-start: ${hairlineWidth()} solid var(--ds-border);
    background: var(--ds-bg);
  }
  [data-part="phone-tab"] {
    display: flex; align-items: center; justify-content: center;
    color: ${neutral(6)};
    font-size: var(--ds-text-lg);
  }
  [data-part="phone-tab"][aria-current="true"] { color: var(--ds-accent); }

  [data-part="phone"] > figcaption {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-xs);
    color: color-mix(in oklab, currentColor 55%, transparent);
  }
`
