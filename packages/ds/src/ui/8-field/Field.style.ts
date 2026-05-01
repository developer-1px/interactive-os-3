import { accent, border, control, css, dur, ease, hairlineWidth, icon, radius, ring, slot, surface, text, typography } from '../../tokens/semantic'
import { pad, tracking, weight } from '../../tokens/scalar'

/**
 * Paired field primitives — Fieldset / CheckboxField / SwitchField.
 *
 * Fieldset 은 native `<legend>` 으로 grouping label 을 표현 (roledescription 안티패턴 제거).
 * Checkbox/Switch + label 페어는 단일 button[role] 안에 indicator/track + label 슬롯을
 * 두어 하나의 클릭 타겟·하나의 focus ring 으로 정렬한다.
 *
 * bare Checkbox/Switch 와 충돌 회피 — data-part="checkbox-field"/"switch-field" 가
 * 있을 때 bare 의 ::before/::after pseudo 를 무력화하고 자식 슬롯 visual 로 그린다.
 */
export const cssField = () => css`
  /* ── Fieldset — native <fieldset><legend> grouping ───────────────── */
  fieldset:where([data-part="fieldset"], :not([data-part])) {
    display: flex;
    flex-direction: column;
    gap: ${pad(1.5)};
    margin: 0 0 ${slot.form.fieldsetMargin};
    padding: 0;
    border: 0;
    min-inline-size: 0;
  }
  fieldset > legend {
    ${typography('bodyStrong')}
    color: ${text()};
    padding: 0;
    margin: 0 0 ${pad(0.5)};
    letter-spacing: ${tracking()};
    display: inline-flex;
    align-items: baseline;
    gap: ${pad(0.5)};
  }
  fieldset > legend > [data-slot="required"] {
    color: ${accent('strong')};
    font-weight: ${weight('regular')};
  }
  fieldset > legend > small {
    ${typography('caption')}
    color: ${text('subtle')};
    font-weight: ${weight('regular')};
  }
  fieldset > p[data-part="field-desc"] {
    ${typography('caption')}
    color: ${text('subtle')};
    margin: ${pad(0.5)} 0 0;
  }

  /* ── CheckboxField — single button[role=checkbox] containing indicator+label */
  button[role="checkbox"][data-part="checkbox-field"] {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(0.5)} 0;
    cursor: pointer;
    color: ${text()};
    min-inline-size: 0;
  }
  /* bare Checkbox 의 ::before checkmark pseudo 가 button 자체에 그려지지 않게 차단 */
  button[role="checkbox"][data-part="checkbox-field"]::before,
  button[role="checkbox"][data-part="checkbox-field"]::after {
    content: none;
    display: none;
  }
  button[role="checkbox"][data-part="checkbox-field"][aria-disabled="true"] {
    cursor: not-allowed;
    color: ${text('mute')};
  }
  button[role="checkbox"][data-part="checkbox-field"]:focus-visible {
    ${ring()}
    border-radius: ${radius('sm')};
  }
  button[role="checkbox"][data-part="checkbox-field"] > [data-slot="indicator"] {
    flex: 0 0 auto;
    inline-size: 1.125em;
    block-size: 1.125em;
    border: 1.5px solid ${control('border')};
    border-radius: ${radius('sm')};
    background: ${surface('default')};
    color: ${text('on-accent')};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color ${dur('base')} ${ease('out')},
      border-color ${dur('base')} ${ease('out')};
  }
  button[role="checkbox"][data-part="checkbox-field"]:hover:not([aria-disabled="true"]) > [data-slot="indicator"] {
    border-color: ${control('borderHover')};
  }
  button[role="checkbox"][data-part="checkbox-field"][aria-checked="true"] > [data-slot="indicator"],
  button[role="checkbox"][data-part="checkbox-field"][aria-checked="mixed"] > [data-slot="indicator"] {
    background: ${accent()};
    border-color: ${accent()};
  }
  /* checkmark — indicator span 의 ::before 에 icon mask. checked 일 때만 visible */
  button[role="checkbox"][data-part="checkbox-field"] > [data-slot="indicator"]::before {
    content: '';
    ${icon('check', '0.8em')}
    visibility: hidden;
  }
  button[role="checkbox"][data-part="checkbox-field"][aria-checked="true"] > [data-slot="indicator"]::before,
  button[role="checkbox"][data-part="checkbox-field"][aria-checked="mixed"] > [data-slot="indicator"]::before {
    visibility: visible;
  }
  button[role="checkbox"][data-part="checkbox-field"] > [data-slot="label"] {
    min-inline-size: 0;
  }

  /* ── SwitchField — single button[role=switch] with label + track ─── */
  button[role="switch"][data-part="switch-field"] {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${pad(2)};
    padding: ${pad(0.5)} 0;
    inline-size: 100%;
    cursor: pointer;
    color: ${text()};
    min-inline-size: 0;
  }
  /* bare Switch 의 ::before track / ::after thumb pseudo 차단 */
  button[role="switch"][data-part="switch-field"]::before,
  button[role="switch"][data-part="switch-field"]::after {
    content: none;
    display: none;
  }
  button[role="switch"][data-part="switch-field"][aria-disabled="true"] {
    cursor: not-allowed;
    color: ${text('mute')};
  }
  button[role="switch"][data-part="switch-field"]:focus-visible {
    ${ring()}
    border-radius: ${radius('sm')};
  }
  button[role="switch"][data-part="switch-field"] > [data-slot="label"] {
    min-inline-size: 0;
    flex: 1 1 auto;
  }
  button[role="switch"][data-part="switch-field"] > [data-slot="track"] {
    flex: 0 0 auto;
    position: relative;
    inline-size: calc(${control('h')} * 1.28);
    block-size: calc(${control('h')} * 0.56);
    border: ${hairlineWidth()} solid ${control('border')};
    border-radius: ${radius('pill')};
    background: ${surface('subtle')};
    transition:
      background-color ${dur('fast')} ${ease('out')},
      border-color ${dur('fast')} ${ease('out')};
  }
  button[role="switch"][data-part="switch-field"] > [data-slot="track"]::after {
    content: '';
    position: absolute;
    inline-size: calc(${control('h')} * 0.56 - 4px);
    block-size: calc(${control('h')} * 0.56 - 4px);
    inset-block-start: 50%;
    inset-inline-start: 2px;
    border-radius: ${radius('pill')};
    background: ${surface('default')};
    border: ${hairlineWidth()} solid ${border()};
    transform: translateY(-50%);
    transition: transform ${dur('base')} ${ease('spring')},
                background-color ${dur('fast')} ${ease('out')},
                border-color ${dur('fast')} ${ease('out')};
  }
  button[role="switch"][data-part="switch-field"]:hover:not([aria-disabled="true"]) > [data-slot="track"] {
    border-color: ${control('borderHover')};
  }
  button[role="switch"][data-part="switch-field"][aria-checked="true"] > [data-slot="track"] {
    border-color: ${accent('border')};
    background: ${accent('soft')};
  }
  button[role="switch"][data-part="switch-field"][aria-checked="true"] > [data-slot="track"]::after {
    transform: translate(calc(${control('h')} * 1.28 - ${control('h')} * 0.56 - 4px), -50%);
    background: ${accent()};
    border-color: ${accent()};
  }

  /* ── FileInput — native UA "Choose File / No file chosen" 대체 ─────── */
  label[data-part="file-input"] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(2)};
    inline-size: 100%;
    padding: ${pad(2)} ${pad(3)};
    background: ${surface('subtle')};
    border: ${hairlineWidth()} dashed ${border()};
    border-radius: ${radius('md')};
    color: ${text('subtle')};
    cursor: pointer;
    transition:
      background-color ${dur('fast')} ${ease('out')},
      border-color ${dur('fast')} ${ease('out')};
  }
  label[data-part="file-input"]:hover {
    border-color: ${accent('border')};
  }
  label[data-part="file-input"]:focus-within {
    ${ring()}
    border-color: ${accent()};
  }
  label[data-part="file-input"][aria-disabled="true"] {
    cursor: not-allowed;
    color: ${text('mute')};
  }
  label[data-part="file-input"] > [data-slot="button"] {
    flex: 0 0 auto;
    padding: 4px ${pad(3)};
    background: ${accent()};
    color: ${text('on-accent')};
    border-radius: ${radius('sm')};
    font-weight: ${weight('semibold')};
    transition: background-color ${dur('fast')} ${ease('out')};
  }
  label[data-part="file-input"]:hover > [data-slot="button"] {
    background: ${accent('strong')};
  }
  label[data-part="file-input"] > [data-slot="filename"] {
    flex: 1 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${text()};
  }
  label[data-part="file-input"] > [data-slot="filename"][data-empty] {
    color: ${text('subtle')};
    font-style: italic;
  }
  /* 실제 input 은 sr-only — visual 은 button/filename 슬롯이 담당 */
  label[data-part="file-input"] > input[type="file"] {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`
