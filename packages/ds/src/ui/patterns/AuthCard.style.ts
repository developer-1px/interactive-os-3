import { accent, border, css, hairlineWidth, hierarchy, radius, ring, slot, surface, text, typography } from '../../tokens/semantic'
import { weight, pad } from '../../tokens/scalar'

/**
 * AuthCard slot inner styling — 로그인 / 가입 / 재설정 / OTP.
 *
 * 외부 수렴 (Stripe · Linear · Vercel · Notion · Auth0):
 *   카드 폭     ~ 480px (panel container)
 *   카드 padding 32~48px (pad(8)~pad(12)) — 일반 Card 의 2~3배
 *   섹션 호흡    24px (pad(6)) — OAuth ↔ divider ↔ fields ↔ submit ↔ footer
 *   submit 버튼  full-width, 큰 hit area
 *
 * 일반 카드 ([data-part="card"]) 가 정보 밀도 우선이라면 auth 카드는 *집중* 우선.
 * 한 번에 한 가지만 — fields 적게, 호흡 크게.
 */
export const cssAuthCard = () => css`
  article[data-part="card"][data-card="auth"] {
    padding: ${slot.auth.pad};                                /* 32px — 호흡 공간 */
    gap: ${slot.auth.slotGap};                                    /* 24px — 슬롯 간 큰 호흡 */
    border: ${hairlineWidth()} solid ${surface('subtle')};
    border-radius: ${radius('lg')};
    background: var(--ds-bg);
  }
  article[data-part="card"][data-card="auth"]:hover {
    /* hover 강조 안 함 — 폼은 정적 surface */
    box-shadow: none;
    border-color: ${surface('subtle')};
  }

  /* title 슬롯 — heading 위 + small 서브카피 */
  article[data-part="card"][data-card="auth"] > [data-slot="title"] > header {
    display: flex; flex-direction: column;
    gap: ${pad(1.5)};
  }
  article[data-part="card"][data-card="auth"] > [data-slot="title"] h2 {
    margin: 0;
    ${typography('display')};
    letter-spacing: -0.01em;
  }
  article[data-part="card"][data-card="auth"] > [data-slot="title"] small {
    color: ${text('subtle')};
    font-size: var(--ds-text-sm);
  }

  /* body — form 안 큰 호흡. 필드들 자체 gap 은 form.ts 가 owner. */
  article[data-part="card"][data-card="auth"] > [data-slot="body"] {
    display: block;
  }
  article[data-part="card"][data-card="auth"] > [data-slot="body"] > form {
    display: flex; flex-direction: column;
    gap: ${slot.auth.formGap};                                    /* 20px — 폼 섹션 간 */
  }
  /* field 들끼리는 form gap(20px) 보다 살짝 좁게 묶음 */
  article[data-part="card"][data-card="auth"] > [data-slot="body"] > form > [role="group"][data-part="field"] + [role="group"][data-part="field"] {
    margin-top: calc(${pad(1)} * -1);                  /* form gap 에서 살짝 당김 */
  }

  /* OAuth row — 위아래 동일 폭 버튼 */
  article[data-part="card"][data-card="auth"] [data-part="oauth-row"] {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: ${pad(2)};
  }
  article[data-part="card"][data-card="auth"] [data-part="oauth-row"] > button {
    inline-size: 100%;
    padding-block: ${slot.auth.buttonPadY};
    background: var(--ds-bg);
    border: ${hairlineWidth()} solid ${border('subtle')};
    border-radius: ${radius('md')};
    cursor: pointer;
    font: inherit;
    color: inherit;
    display: inline-flex; align-items: center; justify-content: center;
    gap: ${pad(1.5)};
  }
  article[data-part="card"][data-card="auth"] [data-part="oauth-row"] > button:hover {
    background: ${surface('subtle')};
    border-color: ${border()};
  }

  /* "또는 이메일로" divider */
  article[data-part="card"][data-card="auth"] [role="separator"] {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    color: ${text('mute')};
  }
  article[data-part="card"][data-card="auth"] [role="separator"]::before,
  article[data-part="card"][data-card="auth"] [role="separator"]::after {
    content: '';
    block-size: ${hairlineWidth()};
    background: ${surface('subtle')};
  }
  article[data-part="card"][data-card="auth"] [role="separator"] > small {
    font-size: var(--ds-text-xs);
  }

  /* row-split (로그인 유지 ↔ 비밀번호 찾기) */
  article[data-part="card"][data-card="auth"] [data-part="row-split"] {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
    font-size: var(--ds-text-sm);
  }
  article[data-part="card"][data-card="auth"] [data-part="row-split"] label {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    cursor: pointer;
  }

  /* submit 버튼 — full-width, 큰 hit area */
  article[data-part="card"][data-card="auth"] form > button[type="submit"] {
    inline-size: 100%;
    padding-block: ${slot.auth.buttonPadY};
    background: ${accent()};
    color: var(--ds-accent-on);
    border: 0;
    border-radius: ${radius('md')};
    font: inherit;
    font-weight: ${weight('semibold')};
    cursor: pointer;
    transition: background 120ms ease;
  }
  article[data-part="card"][data-card="auth"] form > button[type="submit"]:hover {
    filter: brightness(0.95);
  }

  /* footer — 작은 보조 링크 한 줄 */
  article[data-part="card"][data-card="auth"] > [data-slot="footer"] {
    text-align: center;
    color: ${text('subtle')};
    font-size: var(--ds-text-sm);
    border-block-start: ${hairlineWidth()} solid ${surface('subtle')};
    padding-block-start: ${pad(4)};
    margin-block-start: calc(${hierarchy.shell} * -1 + ${pad(2)});  /* card gap 보정 */
  }
  article[data-part="card"][data-card="auth"] > [data-slot="footer"] a {
    color: ${accent()};
    font-weight: ${weight('medium')};
  }

  /* OTP 6자리 — 큰 정사각 input row */
  article[data-part="card"][data-card="auth"] [data-part="otp-row"] {
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: ${slot.auth.otpGap};
  }
  article[data-part="card"][data-card="auth"] [data-part="otp-row"] > input {
    aspect-ratio: 1;
    text-align: center;
    ${typography('headingStrong')};
    border: ${hairlineWidth()} solid ${border('subtle')};
    border-radius: ${radius('md')};
    background: var(--ds-bg);
    padding: 0;
    inline-size: 100%;
  }
  article[data-part="card"][data-card="auth"] [data-part="otp-row"] > input:focus-visible {
    ${ring()}
    border-color: ${accent()};
  }
`
