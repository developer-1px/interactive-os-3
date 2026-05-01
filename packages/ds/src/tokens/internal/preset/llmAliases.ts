import { css } from '../../semantic/css'

/**
 * LLM-facing token aliases.
 *
 * System-facing tokens remain `--ds-*`. This block exposes a small,
 * role-first CSS variable vocabulary for prompts, prototypes, and generated
 * examples without letting component-specific names leak into the public
 * surface. Every value resolves back to the preset-owned `--ds-*` graph.
 */
export const llmAliasBlock = () => css`
    /* LLM-facing color aliases - background */
    --color-bg-page:          var(--ds-base);
    --color-bg-page-soft:     var(--ds-neutral-1);
    --color-bg-surface:       var(--ds-bg);
    --color-bg-surface-muted: var(--ds-bg-sunken);
    --color-bg-surface-glass: color-mix(in oklab, var(--ds-bg) 76%, transparent);
    --color-bg-overlay:       color-mix(in oklab, var(--ds-fg) 30%, transparent);

    /* LLM-facing color aliases - text */
    --color-text-primary:   var(--ds-fg);
    --color-text-secondary: var(--ds-fg-2);
    --color-text-tertiary:  var(--ds-fg-4);
    --color-text-inverse:   var(--ds-bg);
    --color-text-link:      var(--ds-accent);
    --color-text-danger:    var(--ds-danger);
    --color-text-success:   var(--ds-success);

    /* LLM-facing color aliases - border */
    --color-border-default: var(--ds-line);
    --color-border-subtle:  color-mix(in oklab, var(--ds-line) 66%, transparent);
    --color-border-strong:  var(--ds-line-2);
    --color-border-focus:   color-mix(in oklab, var(--ds-accent) 42%, transparent);
    --color-border-danger:  color-mix(in oklab, var(--ds-danger) 40%, transparent);
    --color-border-success: color-mix(in oklab, var(--ds-success) 40%, transparent);

    /* LLM-facing color aliases - action */
    --color-action-primary:       var(--ds-accent);
    --color-action-primary-hover: color-mix(in oklab, var(--ds-accent) 85%, var(--ds-fg));
    --color-action-primary-soft:  color-mix(in oklab, var(--ds-accent) 12%, transparent);
    --color-action-neutral:       var(--ds-fg);
    --color-action-neutral-hover: var(--ds-fg-2);
    --color-action-danger:        var(--ds-danger);
    --color-action-danger-soft:   color-mix(in oklab, var(--ds-danger) 12%, transparent);

    /* LLM-facing color aliases - state */
    --color-state-success:      var(--ds-success);
    --color-state-success-soft: color-mix(in oklab, var(--ds-success) 12%, transparent);
    --color-state-danger:       var(--ds-danger);
    --color-state-danger-soft:  color-mix(in oklab, var(--ds-danger) 12%, transparent);
    --color-state-warning:      var(--ds-warning);
    --color-state-warning-soft: color-mix(in oklab, var(--ds-warning) 12%, transparent);
    --color-state-info:         var(--ds-accent);
    --color-state-info-soft:    color-mix(in oklab, var(--ds-accent) 12%, transparent);

    /* LLM-facing spacing aliases */
    --space-0:  0;
    --space-1:  calc(var(--ds-space) * 1);
    --space-2:  calc(var(--ds-space) * 2);
    --space-3:  calc(var(--ds-space) * 3);
    --space-4:  calc(var(--ds-space) * 4);
    --space-5:  calc(var(--ds-space) * 5);
    --space-6:  calc(var(--ds-space) * 6);
    --space-8:  calc(var(--ds-space) * 8);
    --space-10: calc(var(--ds-space) * 10);
    --space-12: calc(var(--ds-space) * 12);
    --space-16: calc(var(--ds-space) * 16);
    --space-20: calc(var(--ds-space) * 20);

    /* LLM-facing shape aliases */
    --radius-none: 0;
    --radius-xs:   calc(var(--ds-radius-sm) * 0.5);
    --radius-sm:   var(--ds-radius-sm);
    --radius-md:   var(--ds-radius-md);
    --radius-lg:   var(--ds-radius-lg);
    --radius-xl:   calc(var(--ds-radius-lg) + var(--ds-space) * 2);
    --radius-pill: var(--ds-radius-pill);
    --radius-full: 50%;

    /* LLM-facing typography aliases */
    --font-family-sans: var(--ds-font-sans);
    --font-family-mono: var(--ds-font-mono);
    --font-size-xs:      var(--ds-text-xs);
    --font-size-sm:      var(--ds-text-sm);
    --font-size-md:      var(--ds-text-md);
    --font-size-lg:      var(--ds-text-lg);
    --font-size-xl:      var(--ds-text-xl);
    --font-size-2xl:     var(--ds-text-2xl);
    --font-size-display: var(--ds-text-3xl);
    --line-height-tight:   var(--ds-leading-tight);
    --line-height-body:    var(--ds-leading-normal);
    --line-height-relaxed: var(--ds-leading-loose);
    --font-weight-regular:  var(--ds-weight-regular);
    --font-weight-medium:   var(--ds-weight-medium);
    --font-weight-semibold: var(--ds-weight-semibold);
    --font-weight-bold:     var(--ds-weight-bold);
    --font-weight-heavy:    var(--ds-weight-extrabold);

    /* LLM-facing effect aliases */
    --shadow-none: var(--ds-elev-0);
    --shadow-sm:   var(--ds-elev-1);
    --shadow-md:   var(--ds-elev-2);
    --shadow-lg:   var(--ds-elev-3);
    --focus-ring:  0 0 0 var(--ds-focus-ring-w) color-mix(in oklab, var(--ds-accent) 22%, transparent);

    /* LLM-facing size aliases */
    --size-icon-xs:    var(--ds-size-xs);
    --size-icon-sm:    var(--ds-size-sm);
    --size-icon-md:    var(--ds-size-md);
    --size-icon-lg:    var(--ds-size-lg);
    --size-control-sm: var(--ds-control-h);
    --size-control-md: var(--ds-touch-target);
    --size-control-lg: calc(var(--ds-touch-target) + var(--ds-space));
    --size-control-xl: calc(var(--ds-touch-target) + var(--ds-space) * 3);
    --size-avatar-sm:  var(--ds-size-md);
    --size-avatar-md:  var(--ds-size-lg);
    --size-avatar-lg:  var(--ds-size-2xl);

    /* LLM-facing layer aliases */
    --z-base:     var(--ds-z-base);
    --z-dropdown: var(--ds-z-dropdown);
    --z-sticky:   var(--ds-z-sticky);
    --z-overlay:  var(--ds-z-overlay);
    --z-modal:    var(--ds-z-modal);
    --z-toast:    var(--ds-z-toast);

    /* LLM-facing motion aliases */
    --duration-fast: var(--ds-dur-fast);
    --duration-md:   var(--ds-dur-base);
    --ease-standard:   var(--ds-ease-out);
    --ease-emphasized: var(--ds-ease-spring);
`
