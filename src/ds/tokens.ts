import { css } from './fn'

export const seeds = css`
  @property --ds-hue     { syntax: '<number>'; initial-value: 260; inherits: true; }
  @property --ds-density { syntax: '<number>'; initial-value: 1;   inherits: true; }
  @property --ds-depth   { syntax: '<number>'; initial-value: 1;   inherits: true; }

  :root {
    --ds-space:  calc(4px * var(--ds-density));
    --ds-bg:     Canvas;
    --ds-fg:     CanvasText;
    --ds-muted:  color-mix(in oklch, CanvasText 60%, transparent);
    --ds-border: color-mix(in oklch, CanvasText 12%, transparent);
    --ds-accent: oklch(65% 0.22 var(--ds-hue));

    --ds-font-sans:
      ui-sans-serif, -apple-system, 'SF Pro Text', 'Inter',
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --ds-font-mono:
      ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace;

    --ds-text-xs:  11px;
    --ds-text-sm:  12px;
    --ds-text-md:  13px;
    --ds-text-lg:  15px;
    --ds-text-xl:  18px;
    --ds-text-2xl: 22px;

    --ds-leading:       1.5;
    --ds-leading-tight: 1.3;
    --ds-tracking:      -0.01em;
    --ds-radius:        6px;

    /* 모든 control/roving이 공유하는 기본 높이 — UA가 line-height를 무시하는
       select 같은 요소까지 min-height로 강제해 같은 선상 정렬을 보장한다. */
    --ds-control-h: calc(var(--ds-text-md) * var(--ds-leading) + var(--ds-space) * 2 + 2px);
    --ds-shadow:
      0 calc(4px * var(--ds-depth))
        calc(12px * var(--ds-depth))
        color-mix(in oklch, CanvasText calc(10% * var(--ds-depth)), transparent);
  }
`
