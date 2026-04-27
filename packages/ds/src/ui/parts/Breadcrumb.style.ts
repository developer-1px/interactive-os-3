import { accent, css, font, mute, pad, text } from '../../tokens/foundations'

/**
 * Breadcrumb — <nav aria-label="Breadcrumb"><ol><li>...</li></ol></nav>.
 * 구분자는 ::after content. 마지막 li는 구분자 없음.
 * 현재 페이지(span[aria-current="page"])는 강조 텍스트 색.
 */
export const breadcrumb = () => css`
  :where(nav[aria-label="Breadcrumb"]) {
    font-size: ${font('sm')};
    line-height: 1.4;
  }
  :where(nav[aria-label="Breadcrumb"]) > ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${pad(0.5)};
  }
  :where(nav[aria-label="Breadcrumb"]) > ol > li {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.5)};
  }
  :where(nav[aria-label="Breadcrumb"]) > ol > li:not(:last-child)::after {
    content: "/";
    ${mute(2)}
  }
  nav[aria-label="Breadcrumb"] > ol > li > a {
    color: inherit;
    text-decoration: none;
    ${mute(1)}
  }
  nav[aria-label="Breadcrumb"] > ol > li > a:hover {
    color: ${accent()};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  nav[aria-label="Breadcrumb"] > ol > li > a:focus-visible {
    outline: 2px solid ${accent()};
    outline-offset: 2px;
    border-radius: 2px;
  }
  nav[aria-label="Breadcrumb"] > ol > li > span[aria-current="page"] {
    color: ${text('strong')};
    font-weight: 500;
  }
`
