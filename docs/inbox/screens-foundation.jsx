// Foundations: Color, Type, Spacing, Radius, Elevation, Iconography

const COLORS = {
  brand: [
    { name: "Accent", token: "--accent", value: "var(--accent)", desc: "Primary brand", lg: true },
  ],
  neutral: [
    { name: "Background", token: "--bg", value: "var(--bg)" },
    { name: "Surface", token: "--bg-elev", value: "var(--bg-elev)" },
    { name: "Sunken", token: "--bg-sunken", value: "var(--bg-sunken)" },
    { name: "Hover", token: "--bg-hover", value: "var(--bg-hover)" },
  ],
  text: [
    { name: "Text Primary", token: "--fg", value: "var(--fg)" },
    { name: "Text Secondary", token: "--fg-2", value: "var(--fg-2)" },
    { name: "Text Tertiary", token: "--fg-3", value: "var(--fg-3)" },
    { name: "Text Muted", token: "--fg-4", value: "var(--fg-4)" },
    { name: "Text Disabled", token: "--fg-5", value: "var(--fg-5)" },
  ],
  border: [
    { name: "Border", token: "--line", value: "var(--line)" },
    { name: "Border Strong", token: "--line-2", value: "var(--line-2)" },
    { name: "Border Bold", token: "--line-strong", value: "var(--line-strong)" },
  ],
  status: [
    { name: "Success", token: "--status-success", value: "var(--status-success)" },
    { name: "Warning", token: "--status-warning", value: "var(--status-warning)" },
    { name: "Error", token: "--status-error", value: "var(--status-error)" },
    { name: "Info", token: "--status-info", value: "var(--status-info)" },
  ],
};

function Swatch({ s }) {
  const ref = React.useRef(null);
  const [hex, setHex] = React.useState("");
  const recompute = React.useCallback(() => {
    if (!ref.current) return;
    const c = getComputedStyle(ref.current).backgroundColor;
    const m = c.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      const [r,g,b] = m.slice(0,3).map(Number);
      setHex("#" + [r,g,b].map(n => Math.round(n).toString(16).padStart(2,"0")).join("").toUpperCase());
    } else {
      setHex("");
    }
  }, []);
  React.useLayoutEffect(() => {
    recompute();
    // Watch for accent / theme changes via MutationObserver on <html>
    const obs = new MutationObserver(() => requestAnimationFrame(recompute));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style","data-theme"] });
    return () => obs.disconnect();
  }, [recompute]);
  return (
    <div className={"swatch" + (s.lg ? " lg" : "")}>
      <div className="chip" ref={ref} style={{ background: s.value }} />
      <div className="meta">
        <span className="name">{s.name}</span>
        <span className="hex">{s.token}</span>
        <span className="hex" style={{opacity:.7}}>{hex}</span>
      </div>
    </div>
  );
}

function ColorScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">01 / FOUNDATION</div>
          <h1>Color</h1>
        </div>
        <p className="lede">A neutral, near-monochrome palette anchored by a single brand accent. Status colors stay reserved for system feedback only.</p>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Brand</h2>
          <span className="count">01</span>
          <span className="desc">Primary accent — switches via Tweaks. Drives all interactive states across the system.</span>
        </div>
        <div className="color-grid">
          {COLORS.brand.map(s => <Swatch key={s.name} s={s} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Neutrals</h2>
          <span className="count">04</span>
          <span className="desc">Layered surfaces from background to sunken state.</span>
        </div>
        <div className="color-grid">
          {COLORS.neutral.map(s => <Swatch key={s.name} s={s} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Text</h2>
          <span className="count">05</span>
          <span className="desc">Five-step contrast ladder. Use the highest contrast tier the role allows.</span>
        </div>
        <div className="color-grid cols-6">
          {COLORS.text.map(s => <Swatch key={s.name} s={s} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Borders</h2>
          <span className="count">03</span>
        </div>
        <div className="color-grid">
          {COLORS.border.map(s => <Swatch key={s.name} s={s} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Status</h2>
          <span className="count">04</span>
          <span className="desc">Reserved for system feedback. Never decorative.</span>
        </div>
        <div className="color-grid">
          {COLORS.status.map(s => <Swatch key={s.name} s={s} />)}
        </div>
      </section>
    </div>
  );
}

const TYPE_SCALE = [
  { label: "Display", text: "The quiet system", family: "var(--font-serif)", size: 64, lh: 1.05, weight: 400, tracking: "-0.025em" },
  { label: "H1",      text: "Section opener",   family: "var(--font-serif)", size: 40, lh: 1.1, weight: 400, tracking: "-0.02em" },
  { label: "H2",      text: "Title cased",      family: "var(--font-sans)",  size: 24, lh: 1.2, weight: 600, tracking: "-0.01em" },
  { label: "H3",      text: "Subhead",          family: "var(--font-sans)",  size: 18, lh: 1.3, weight: 600, tracking: "0" },
  { label: "Body Lg", text: "Comfortable reading at a relaxed pace.", family: "var(--font-sans)", size: 16, lh: 1.55, weight: 400 },
  { label: "Body",    text: "The default text used across the application UI.", family: "var(--font-sans)", size: 14, lh: 1.5, weight: 400 },
  { label: "Caption", text: "Small descriptive text", family: "var(--font-sans)", size: 12, lh: 1.45, weight: 400 },
  { label: "Mono",    text: "01:23 · acme/api/v2",  family: "var(--font-mono)", size: 12, lh: 1.4, weight: 400 },
];

function TypeScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">02 / FOUNDATION</div>
          <h1>Typography</h1>
        </div>
        <p className="lede">Two families. A serif (<span className="mono">Fraunces</span>) for editorial moments, sans (<span className="mono">Inter</span>) for everything else. Mono reserved for tokens and data.</p>
      </div>

      <section className="section">
        <div className="section-head"><h2>Scale</h2><span className="count">{TYPE_SCALE.length}</span></div>
        <div>
          {TYPE_SCALE.map(t => (
            <div className="type-row" key={t.label}>
              <div className="label">{t.label}</div>
              <div className="specimen" style={{
                fontFamily: t.family,
                fontSize: t.size,
                lineHeight: t.lh,
                fontWeight: t.weight,
                letterSpacing: t.tracking || "0",
              }}>{t.text}</div>
              <div className="specs">
                <div className="row"><span className="k">family</span><span>{t.family.includes("serif") ? "Fraunces" : t.family.includes("mono") ? "JetBrains" : "Inter"}</span></div>
                <div className="row"><span className="k">size / lh</span><span>{t.size}/{Math.round(t.size*t.lh)}</span></div>
                <div className="row"><span className="k">weight</span><span>{t.weight}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const SPACING = [
  { px: 2, key: "3xs" }, { px: 4, key: "2xs" }, { px: 8, key: "xs" },
  { px: 12, key: "sm" }, { px: 16, key: "md" }, { px: 24, key: "lg" },
  { px: 32, key: "xl" }, { px: 48, key: "2xl" }, { px: 64, key: "3xl" }, { px: 96, key: "4xl" },
];

function SpacingScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">03 / FOUNDATION</div>
          <h1>Spacing</h1>
        </div>
        <p className="lede">A modular scale with friendly names. Most layouts only need 8, 16, 24.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Scale</h2><span className="count">{SPACING.length}</span></div>
        <div className="spacing-rail">
          {SPACING.map(s => (
            <div className="sp-step" key={s.px}>
              <div className="bar" style={{ height: s.px }} />
              <span className="lbl">{s.px}</span>
              <span className="key">{s.key}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const RADII = [
  { px: 0,  key: "none" }, { px: 2, key: "xs" }, { px: 4, key: "sm" },
  { px: 8,  key: "md" }, { px: 12, key: "lg" }, { px: 999, key: "full" },
];

function RadiusScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">04 / FOUNDATION</div>
          <h1>Border Radius</h1>
        </div>
        <p className="lede">Tight geometry by default. Pills only for status & chips.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Scale</h2></div>
        <div className="radius-grid">
          {RADII.map(r => (
            <div className="radius-cell" key={r.key}>
              <div className="demo" style={{ borderRadius: r.px }} />
              <div className="lbl"><span>{r.px === 999 ? "∞" : `${r.px}px`}</span><span className="k">{r.key}</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const ELEVATIONS = [
  { name: "Level 0", spec: "none — flat surface" },
  { name: "Level 1", spec: "0 1px 2px / 6%" },
  { name: "Level 2", spec: "0 2px 6px + 1px 2px" },
  { name: "Level 3", spec: "0 6px 14px + 2px 4px" },
  { name: "Level 4", spec: "0 14px 32px + 4px 8px" },
];

function ElevationScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">05 / FOUNDATION</div>
          <h1>Elevation</h1>
        </div>
        <p className="lede">Five steps. Cards stay at L1, popovers L2, modals L3, command palette L4.</p>
      </div>
      <section className="section">
        <div className="elev-grid">
          {ELEVATIONS.map((e, i) => (
            <div className="elev-cell" key={i}>
              <div className={`demo elev-${i}`} />
              <div className="meta">
                <span className="name">{e.name}</span>
                <span className="spec">{e.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IconScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">06 / FOUNDATION</div>
          <h1>Iconography</h1>
        </div>
        <p className="lede">A 20px stroke set, 1.5px line. Built on a 2px grid, terminals always rounded.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Library</h2><span className="count">{ICON_NAMES.length}</span><span className="desc">Outlined · 20×20 · 1.5 stroke · round caps</span></div>
        <div className="icon-grid">
          {ICON_NAMES.map(n => (
            <div className="icon-cell" key={n}>
              <Icon name={n} size={20} />
              <span className="name">{n}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ColorScreen, TypeScreen, SpacingScreen, RadiusScreen, ElevationScreen, IconScreen });
