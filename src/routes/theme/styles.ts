/** Theme Creator scoped CSS — [data-part="theme-creator"] 단일 스코프. */
export const themeCreatorStyles = `
  [data-part="theme-creator"] {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: var(--ds-space, 4px) calc(var(--ds-space) * 8);
    align-items: start;
    padding: calc(var(--ds-space) * 6);
    min-height: 100dvh;
  }
  [data-part="theme-creator"] > aside {
    position: sticky;
    top: calc(var(--ds-space) * 6);
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 5);
    padding: calc(var(--ds-space) * 5);
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-elev-2);
  }
  [data-part="theme-creator"] > aside > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] > aside > header > h1 {
    font-size: var(--ds-text-lg);
  }
  [data-part="theme-creator"] > aside > section {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] > aside > section > h2 {
    font-size: var(--ds-text-sm);
    color: var(--ds-muted);
    font-weight: var(--ds-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  [data-part="theme-creator"] > aside label {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="theme-creator"] > aside label > span {
    display: flex;
    justify-content: space-between;
    font-size: var(--ds-text-sm);
  }
  [data-part="theme-creator"] > aside label > small {
    color: var(--ds-muted);
    font-size: var(--ds-text-xs);
  }
  [data-part="theme-creator"] > [aria-label="Theme preview"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 8);
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
  }
  [data-part="theme-creator"] > [aria-label="Theme preview"] > section > h2 {
    font-size: var(--ds-text-lg);
    margin-bottom: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--ds-space) * 1);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li > i {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(1) > i { background: var(--ds-neutral-1); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(2) > i { background: var(--ds-neutral-2); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(3) > i { background: var(--ds-neutral-3); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(4) > i { background: var(--ds-neutral-4); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(5) > i { background: var(--ds-neutral-5); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(6) > i { background: var(--ds-neutral-6); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(7) > i { background: var(--ds-neutral-7); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(8) > i { background: var(--ds-neutral-8); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li:nth-child(9) > i { background: var(--ds-neutral-9); }
  [data-part="theme-creator"] [aria-label="neutral scale"] li > code {
    font-size: var(--ds-text-xs);
    color: var(--ds-muted);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li {
    display: flex;
    align-items: center;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li > i {
    display: inline-block;
    width: 48px;
    height: 32px;
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="base"]   > i { background: var(--ds-base); border: 1px solid var(--ds-border); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="bg"]     > i { background: var(--ds-bg);   border: 1px solid var(--ds-border); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="tone"]   > i { background: var(--ds-tone); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li[data-token="accent"] > i { background: var(--ds-accent); }
  [data-part="theme-creator"] [aria-label="surface tokens"] li > small {
    color: var(--ds-muted);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] {
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    padding: calc(var(--ds-space) * 5);
    box-shadow: var(--ds-elev-2);
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] [role="group"] {
    display: flex;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-emphasis="primary"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-emphasis="secondary"] {
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
`
