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
  [data-part="theme-creator"] [aria-label="type scale"],
  [data-part="theme-creator"] [aria-label="type weights"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="type scale"] li,
  [data-part="theme-creator"] [aria-label="type weights"] li {
    display: flex;
    align-items: baseline;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="type scale"] li > [data-specimen] {
    line-height: 1.05;
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-neutral-9);
    min-width: 56px;
  }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="xs"]  > [data-specimen] { font-size: var(--ds-text-xs); }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="sm"]  > [data-specimen] { font-size: var(--ds-text-sm); }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="md"]  > [data-specimen] { font-size: var(--ds-text-md); }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="lg"]  > [data-specimen] { font-size: var(--ds-text-lg); }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="xl"]  > [data-specimen] { font-size: var(--ds-text-xl); }
  [data-part="theme-creator"] [aria-label="type scale"] li[data-step="2xl"] > [data-specimen] { font-size: var(--ds-text-2xl); }
  [data-part="theme-creator"] [aria-label="type weights"] li > [data-specimen] {
    font-size: var(--ds-text-lg);
    color: var(--ds-neutral-9);
    min-width: 56px;
  }
  [data-part="theme-creator"] [aria-label="type weights"] li[data-weight="regular"]   > [data-specimen] { font-weight: var(--ds-weight-regular); }
  [data-part="theme-creator"] [aria-label="type weights"] li[data-weight="medium"]    > [data-specimen] { font-weight: var(--ds-weight-medium); }
  [data-part="theme-creator"] [aria-label="type weights"] li[data-weight="semibold"]  > [data-specimen] { font-weight: var(--ds-weight-semibold); }
  [data-part="theme-creator"] [aria-label="type weights"] li[data-weight="bold"]      > [data-specimen] { font-weight: var(--ds-weight-bold); }
  [data-part="theme-creator"] [aria-label="type weights"] li[data-weight="extrabold"] > [data-specimen] { font-weight: var(--ds-weight-extrabold); }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li {
    display: flex;
    align-items: center;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li > i {
    display: inline-block;
    height: 8px;
    background: var(--ds-tone);
    border-radius: 2px;
  }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li[data-step="atom"]    > i { width: calc(var(--ds-space) * 0.5); }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li[data-step="section"] > i { width: calc(var(--ds-space) * 1); }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li[data-step="surface"] > i { width: calc(var(--ds-space) * 2); }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li[data-step="shell"]   > i { width: calc(var(--ds-space) * 4); }
  [data-part="theme-creator"] [aria-label="spacing hierarchy"] li > small {
    color: var(--ds-muted);
  }

  [data-part="theme-creator"] [aria-label="state samples"] {
    display: flex;
    flex-direction: column;
    gap: calc(var(--ds-space) * 2);
  }
  [data-part="theme-creator"] [aria-label="state samples"] li {
    display: flex;
    align-items: center;
    gap: calc(var(--ds-space) * 3);
  }
  [data-part="theme-creator"] [aria-label="state samples"] li > [data-tile] {
    display: inline-grid;
    place-items: center;
    min-width: 88px;
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 3);
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-sm);
    font-size: var(--ds-text-sm);
    color: var(--ds-neutral-9);
  }
  [data-part="theme-creator"] [aria-label="state samples"] li[data-state="hover"]    > [data-tile] { background: var(--ds-tone); }
  [data-part="theme-creator"] [aria-label="state samples"] li[data-state="active"]   > [data-tile] { background: var(--ds-tone); border-color: var(--ds-neutral-7); }
  [data-part="theme-creator"] [aria-label="state samples"] li[data-state="focus"]    > [data-tile] { outline: var(--ds-focus-ring-w, 2px) solid var(--ds-accent); outline-offset: 2px; }
  [data-part="theme-creator"] [aria-label="state samples"] li[data-state="selected"] > [data-tile] { background: var(--ds-accent); color: var(--ds-accent-on); border-color: var(--ds-accent); }
  [data-part="theme-creator"] [aria-label="state samples"] li[data-state="disabled"] > [data-tile] { color: var(--ds-muted); border-style: dashed; }

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
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-variant="primary"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
  [data-part="theme-creator"] article[aria-label="Sample card"] button[data-variant="secondary"] {
    background: var(--ds-bg);
    border: 1px solid var(--ds-border);
    padding: calc(var(--ds-space) * 2) calc(var(--ds-space) * 4);
    border-radius: var(--ds-radius-sm);
  }
`
