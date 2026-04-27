import { css } from '../css'
import { dim } from '../../palette/color'

/**
 * Recipe — atomic fn 위 한 층. "이렇게 조립하면 2026" 조합을 한 곳에서 정의한다.
 *
 * 원칙:
 * - opinionated: 파라미터로 흔들지 않음. 2026 톤 결정이 이미 녹아 있다.
 * - atomic fn만 소비 (raw CSS 리터럴·숫자 금지). 값 교체는 preset/palette에서 일어난다.
 * - 외곽(margin/padding) 등 배치 결정은 호출부에 남기고, recipe는 내재적 성격만 표현.
 */

/**
 * microLabel — section/field header용 micro-label.
 * uppercase + xs + weight 600 + dim(50) + tracking .06em 세트.
 * 용도: sidebar section h3, Inspector panel-section h3 등 "작게 말하는 이름".
 * @demo type=recipe fn=microLabel
 */
export const microLabel = () => css`
  font-size: var(--ds-text-xs);
  font-weight: 600;
  color: ${dim(50)};
  text-transform: uppercase;
  letter-spacing: .06em;
`
