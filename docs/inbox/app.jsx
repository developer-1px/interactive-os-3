// Atlas — Figma-style one-pager
// L1 Tokens (slim) · L2 Components (expanded)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3565D3",
  "dark": false,
  "grid": false
}/*EDITMODE-END*/;

function hexToRgb(h) {
  const m = h.replace("#","").match(/.{2}/g);
  if (!m) return [50,50,50];
  return m.map(x => parseInt(x,16));
}
function relLuma([r,g,b]) {
  const f = c => { c/=255; return c<=.03928 ? c/12.92 : Math.pow((c+.055)/1.055,2.4); };
  return .2126*f(r)+.7152*f(g)+.0722*f(b);
}

function Frame({ id, num, group, title, desc, children, padded=true }) {
  return (
    <section className="frame" id={id}>
      <div className="frame-head">
        <span className="num">{String(num).padStart(2,"0")}</span>
        <h2>{title}</h2>
        {group && <span className="group">{group}</span>}
        {desc && <p className="desc">{desc}</p>}
      </div>
      <div className="frame-body" style={padded ? {} : { padding: 0 }}>
        {children}
      </div>
    </section>
  );
}

function LayerBand({ n, title, badge }) {
  return (
    <div className="layer-band">
      <span>L{n}</span>
      <h3>{title}</h3>
      <hr/>
      {badge && <span className="badge">{badge}</span>}
    </div>
  );
}

// ── Slim token frames ──────────────────────────────────────
function ColorFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Brand</div>
        <div className="color-grid">{COLORS.brand.map(s => <Swatch key={s.name} s={s}/>)}</div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Surfaces</div>
        <div className="color-grid">{COLORS.neutral.map(s => <Swatch key={s.name} s={s}/>)}</div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Text</div>
        <div className="color-grid cols-6">{COLORS.text.map(s => <Swatch key={s.name} s={s}/>)}</div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Status</div>
        <div className="color-grid">{COLORS.status.map(s => <Swatch key={s.name} s={s}/>)}</div>
      </div>
    </div>
  );
}

function ElevationFrame() {
  return (
    <div className="elev-grid">
      {ELEVATIONS.map((e, i) => (
        <div className="elev-cell" key={i}>
          <div className={`demo elev-${i}`}/>
          <div className="meta">
            <span className="name">{e.name}</span>
            <span className="spec">{e.spec}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DividerFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Border weights</div>
        <div className="color-grid">
          {COLORS.border.map(s => <Swatch key={s.name} s={s}/>)}
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>In context</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div style={{padding:18,border:"1px solid var(--line)",borderRadius:"var(--radius)",fontSize:12,color:"var(--fg-3)"}}>1px <span className="code">--line</span></div>
          <div style={{padding:18,border:"1px solid var(--line-2)",borderRadius:"var(--radius)",fontSize:12,color:"var(--fg-3)"}}>1px <span className="code">--line-2</span></div>
          <div style={{padding:18,border:"1px solid var(--line-strong)",borderRadius:"var(--radius)",fontSize:12,color:"var(--fg-3)"}}>1px <span className="code">--line-strong</span></div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Horizontal rule</div>
        <hr className="hr"/>
      </div>
    </div>
  );
}

// existing stuff that's still referenced from L2 components
function TypeFrame() {
  return (
    <div>
      {TYPE_SCALE.map(t => (
        <div className="type-row" key={t.label}>
          <div className="label">{t.label}</div>
          <div className="specimen" style={{ fontFamily:t.family, fontSize:t.size, lineHeight:t.lh, fontWeight:t.weight, letterSpacing:t.tracking||"0" }}>{t.text}</div>
          <div className="specs">
            <div className="row"><span className="k">family</span><span>{t.family.includes("serif")?"Fraunces":t.family.includes("mono")?"JetBrains":"Inter"}</span></div>
            <div className="row"><span className="k">size / lh</span><span>{t.size}/{Math.round(t.size*t.lh)}</span></div>
            <div className="row"><span className="k">weight</span><span>{t.weight}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingFrame() {
  return (
    <div className="spacing-rail" style={{border:"none",padding:0,background:"transparent"}}>
      {SPACING.map(s => (
        <div className="sp-step" key={s.px}>
          <div className="bar" style={{ height: s.px }}/>
          <span className="lbl">{s.px}</span>
          <span className="key">{s.key}</span>
        </div>
      ))}
    </div>
  );
}

function RadiusFrame() {
  return (
    <div className="radius-grid">
      {RADII.map(r => (
        <div className="radius-cell" key={r.key}>
          <div className="demo" style={{ borderRadius: r.px }}/>
          <div className="lbl"><span>{r.px === 999 ? "∞" : `${r.px}px`}</span><span className="k">{r.key}</span></div>
        </div>
      ))}
    </div>
  );
}

function IconFrame() {
  return (
    <div className="icon-grid" style={{border:"none"}}>
      {ICON_NAMES.map(n => (
        <div className="icon-cell" key={n}>
          <Icon name={n} size={20}/>
          <span className="name">{n}</span>
        </div>
      ))}
    </div>
  );
}

// existing component frames (chips/tabs/tables/alerts/modals/nav)
function ChipsFrame() {
  return (
    <div style={{display:"grid",gap:18}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Variants</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <span className="chip">Default</span>
          <span className="chip soft">Soft</span>
          <span className="chip solid">Solid</span>
          <span className="chip outline">Outline</span>
          <span className="chip">With icon <Icon name="check" size={11} stroke={2.5}/></span>
          <span className="chip soft">Removable <Icon name="x" size={11} stroke={2}/></span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Status</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <span className="chip chip-success chip-status">Active</span>
          <span className="chip chip-warning chip-status">Pending</span>
          <span className="chip chip-error chip-status">Failed</span>
          <span className="chip chip-info chip-status">Draft</span>
        </div>
      </div>
    </div>
  );
}

function TabsFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Underline</div>
        <div className="tabs-underline">
          <span className="tab active">Overview</span><span className="tab">Activity</span><span className="tab">Members</span><span className="tab">Settings</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Segmented</div>
        <div className="tabs-segmented">
          <span className="seg active">List</span><span className="seg">Board</span><span className="seg">Calendar</span><span className="seg">Timeline</span>
        </div>
      </div>
    </div>
  );
}

function NavFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div className="nav-demo">
        <div className="nav-top">
          <span className="lg-mark">Atlas</span>
          <span className="nav-link active">Dashboard</span><span className="nav-link">Projects</span><span className="nav-link">Reports</span><span className="nav-link">Library</span>
          <div className="right">
            <Icon name="search" size={14}/><Icon name="bell" size={14}/>
            <span className="av av-sm">JS</span>
          </div>
        </div>
      </div>
      <div className="nav-demo">
        <div className="nav-side">
          <div className="nav-side-rail">
            <div className="it"><Icon name="home" size={14}/> Home</div>
            <div className="it active"><Icon name="folder" size={14}/> Projects</div>
            <div className="it"><Icon name="users" size={14}/> Team</div>
            <div className="it"><Icon name="calendar" size={14}/> Calendar</div>
            <div className="it"><Icon name="settings" size={14}/> Settings</div>
          </div>
          <div style={{flex:1, padding:24, color:"var(--fg-4)", fontSize:12}}>Content area</div>
        </div>
      </div>
    </div>
  );
}

function TablesFrame() {
  const rows = [
    { id:"INV-1042", c:"Acme Co.", a:"$2,400.00", s:"Paid", d:"Apr 22" },
    { id:"INV-1041", c:"Globex", a:"$890.00", s:"Pending", d:"Apr 28" },
    { id:"INV-1040", c:"Initech", a:"$5,120.00", s:"Paid", d:"Apr 18" },
    { id:"INV-1039", c:"Hooli", a:"$340.00", s:"Failed", d:"Apr 15" },
  ];
  const map = { Paid:"success", Pending:"warning", Failed:"error", Draft:"info" };
  return (
    <table className="tbl">
      <thead><tr><th>Invoice</th><th>Customer</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th><th>Due</th></tr></thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.id}>
            <td className="num">{r.id}</td><td>{r.c}</td>
            <td className="num" style={{textAlign:"right"}}>{r.a}</td>
            <td><span className={`chip chip-${map[r.s]} chip-status`}>{r.s}</span></td>
            <td className="num">{r.d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AlertsFrame() {
  const alerts = [
    { kind:"success", icon:"success", title:"Payment received", msg:"$2,400 from Acme Co." },
    { kind:"warning", icon:"warning", title:"Subscription expiring", msg:"Renews in 3 days." },
    { kind:"error", icon:"error", title:"Sync failed", msg:"Could not connect. Retrying." },
    { kind:"info", icon:"info", title:"New release", msg:"Atlas 2.4 is now available." },
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {alerts.map(a=>(
        <div className={`alert alert-${a.kind}`} key={a.kind}>
          <span className="icon"><Icon name={a.icon} size={16} stroke={1.75}/></span>
          <div className="body"><div className="title">{a.title}</div><div className="msg">{a.msg}</div></div>
          <Icon name="x" size={14} style={{opacity:.5}}/>
        </div>
      ))}
    </div>
  );
}

function ModalsFrame() {
  return (
    <div className="modal-frame" style={{height:280}}>
      <div className="modal-card">
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div>
            <div style={{fontWeight:600,fontSize:15}}>Delete invoice INV-1042?</div>
            <div style={{fontSize:12,color:"var(--fg-3)",marginTop:4,lineHeight:1.5}}>This action cannot be undone.</div>
          </div>
          <Icon name="x" size={14} style={{color:"var(--fg-4)",marginTop:2}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18}}>
          <button className="btn btn-ghost">Cancel</button>
          <button className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

function MockupsFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>01 · Dashboard</div><MockDashboard/></div>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>02 · Settings</div><MockSettings/></div>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>03 · Invoice detail</div><MockInvoice/></div>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>04 · Onboarding</div><MockOnboarding/></div>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>05 · Empty + command palette</div><MockCommand/></div>
      <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>06 · Login</div><MockLogin/></div>
    </div>
  );
}

// ── Frame manifest ─────────────────────────────────────────
const FRAMES = [
  // L1 — Tokens (slim, modern: color, elevation, divider only)
  { layer:1, id:"color",     group:"Token", title:"Color",         desc:"Brand, surfaces, text, status. Semantic only — no raw palette exposure.", c:<ColorFrame/> },
  { layer:1, id:"elevation", group:"Token", title:"Elevation",     desc:"Five-step shadow scale. Cards L1, popovers L2, modals L3, command L4.", c:<ElevationFrame/> },
  { layer:1, id:"divider",   group:"Token", title:"Divider",       desc:"Three border weights for subtle separation, structural lines, and emphasis.", c:<DividerFrame/> },
  // L1 supplemental (still tokens but secondary)
  { layer:1, id:"type",      group:"Token", title:"Typography",    desc:"Role-based scale: display / heading / body / mono.", c:<TypeFrame/> },
  { layer:1, id:"spacing",   group:"Token", title:"Spacing",       desc:"xs/sm/md/lg/xl scale; most layouts only need 8 / 16 / 24.", c:<SpacingFrame/> },
  { layer:1, id:"radius",    group:"Token", title:"Border radius", desc:"Tight geometry by default. Pills only for status & chips.", c:<RadiusFrame/> },
  { layer:1, id:"icons",     group:"Token", title:"Iconography",   desc:"20×20, 1.5px stroke, rounded terminals.", c:<IconFrame/>, padded:false },

  // L2 — Components (much expanded)
  { layer:2, id:"buttons",   group:"Action",     title:"Buttons",        desc:"Four intents × four states + sizes + group.", c:<ButtonsExpanded/> },
  { layer:2, id:"toolbar",   group:"Action",     title:"Toolbar",        desc:"Compact icon clusters for editor and media controls.", c:<ToolbarFrame/> },
  { layer:2, id:"menu",      group:"Action",     title:"Menu / Dropdown", desc:"Action menus and selection menus with shortcuts.", c:<MenuFrame/> },
  { layer:2, id:"command",   group:"Action",     title:"Command palette", desc:"Search-driven launcher with grouped suggestions.", c:<CommandFrame/> },

  { layer:2, id:"inputs",    group:"Form",       title:"Inputs",         desc:"Text, prefix, select, OTP, stepper, slider, dropzone, search.", c:<InputsExpanded/> },
  { layer:2, id:"datepicker",group:"Form",       title:"Date picker",    desc:"Calendar with selected day, today, range support.", c:<DatePickerFrame/> },

  { layer:2, id:"chips",     group:"Display",    title:"Chips & badges", desc:"Filters, status, metadata.", c:<ChipsFrame/> },
  { layer:2, id:"avatar",    group:"Display",    title:"Avatar",         desc:"Sizes, stack, status indicator, with metadata.", c:<AvatarsFrame/> },
  { layer:2, id:"progress",  group:"Display",    title:"Progress",       desc:"Linear, stepper, ring.", c:<ProgressFrame/> },
  { layer:2, id:"skeleton",  group:"Display",    title:"Skeleton",       desc:"Loading placeholders that match content shape.", c:<SkeletonFrame/> },
  { layer:2, id:"tooltip",   group:"Display",    title:"Tooltip",        desc:"Brief contextual hints with optional shortcut.", c:<TooltipFrame/> },

  { layer:2, id:"tabs",      group:"Navigation", title:"Tabs",           desc:"Underline for page-level, segmented for inline switching.", c:<TabsFrame/> },
  { layer:2, id:"navigation",group:"Navigation", title:"Top & side nav", desc:"Top bar for product wayfinding, side rail for in-section.", c:<NavFrame/> },
  { layer:2, id:"navbits",   group:"Navigation", title:"Breadcrumb & pagination", desc:"Trail and page-step navigation primitives.", c:<NavBitsFrame/> },
  { layer:2, id:"accordion", group:"Navigation", title:"Accordion",      desc:"Stacked disclosure for FAQs and settings groups.", c:<AccordionFrame/> },

  { layer:2, id:"tables",    group:"Data",       title:"Tables",         desc:"Tabular numerics, soft hover, status pills.", c:<TablesFrame/>, padded:false },
  { layer:2, id:"cards",     group:"Data",       title:"Cards",          desc:"Content, metric, quote, feature.", c:<CardsExpanded/> },
  { layer:2, id:"code",      group:"Data",       title:"Code",           desc:"Inline tokens and block samples for documentation.", c:<CodeFrame/> },

  { layer:2, id:"alerts",    group:"Feedback",   title:"Alerts",         desc:"Status-bound inline messaging.", c:<AlertsFrame/> },
  { layer:2, id:"toasts",    group:"Feedback",   title:"Toast & banner", desc:"Transient toast, persistent banner.", c:<ToastBannerFrame/> },
  { layer:2, id:"empty",     group:"Feedback",   title:"Empty state",    desc:"Zero-data and zero-result patterns with recovery action.", c:<EmptyStateFrame/> },

  { layer:2, id:"modals",    group:"Overlay",    title:"Modals",         desc:"Centered dialogs, max 480px, elevation L3.", c:<ModalsFrame/>, padded:false },
  { layer:2, id:"drawer",    group:"Overlay",    title:"Drawer",         desc:"Side-anchored panel for detail editing without losing context.", c:<DrawerFrame/>, padded:false },

  // L3 — Applied
  { layer:3, id:"mockups",   group:"Applied", title:"Product mockups", desc:"The system in use across six representative surfaces.", c:<MockupsFrame/> },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    const [r,g,b] = hexToRgb(t.accent);
    root.style.setProperty("--accent-soft", `rgba(${r},${g},${b},0.10)`);
    root.style.setProperty("--accent-fg", relLuma([r,g,b]) > 0.5 ? "#0E0E0C" : "#FFFFFF");
    root.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t.accent, t.dark]);

  const layers = [
    { n:1, title:"Tokens",     badge:"Foundation" },
    { n:2, title:"Components", badge:"Library" },
    { n:3, title:"Applied",    badge:"Mockups" },
  ];

  // group L2 frames by their group field for visual rhythm
  const l2Groups = ["Action","Form","Display","Navigation","Data","Feedback","Overlay"];

  return (
    <div className="app-onepager" data-grid={t.grid ? "true" : "false"}>
      <div className="canvas-page">
        <header className="canvas-hero">
          <div>
            <div className="eyebrow">Design system · v1.0</div>
            <h1>Atlas</h1>
            <div style={{fontSize:14,color:"var(--fg-3)",marginTop:14,maxWidth:520,lineHeight:1.55}}>
              A tool for sharing and presenting a design system — semantic tokens, a deep component library, and applied product surfaces, on a single canvas.
            </div>
          </div>
          <div className="meta">
            <div><b>{FRAMES.filter(f=>f.layer===1).length}</b> tokens</div>
            <div><b>{FRAMES.filter(f=>f.layer===2).length}</b> components</div>
            <div><b>{FRAMES.filter(f=>f.layer===3).length}</b> mockups</div>
            <div>updated · today</div>
          </div>
        </header>

        <nav className="canvas-toc">
          {FRAMES.map((f, i) => (
            <React.Fragment key={f.id}>
              <a href={`#${f.id}`}>
                <span className="num">{String(i+1).padStart(2,"0")}</span>{f.title}
              </a>
              {i < FRAMES.length - 1 && <span className="sep">·</span>}
            </React.Fragment>
          ))}
        </nav>

        {layers.map(L => {
          const frames = FRAMES.filter(f => f.layer === L.n);
          // For L2, render with subgroup labels
          if (L.n === 2) {
            return (
              <React.Fragment key={L.n}>
                <LayerBand n={L.n} title={L.title} badge={L.badge}/>
                {l2Groups.map(g => {
                  const items = frames.filter(f => f.group === g);
                  if (!items.length) return null;
                  return (
                    <React.Fragment key={g}>
                      <div style={{margin:"36px 0 18px",display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".12em"}}>{g}</span>
                        <hr style={{flex:1,border:"none",borderTop:"1px dashed var(--line)"}}/>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--fg-5)"}}>{items.length}</span>
                      </div>
                      {items.map(f => {
                        const idx = FRAMES.findIndex(x => x.id === f.id);
                        return (
                          <Frame key={f.id} id={f.id} num={idx+1} group={f.group}
                                 title={f.title} desc={f.desc} padded={f.padded !== false}>
                            {f.c}
                          </Frame>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={L.n}>
              <LayerBand n={L.n} title={L.title} badge={L.badge}/>
              {frames.map(f => {
                const idx = FRAMES.findIndex(x => x.id === f.id);
                return (
                  <Frame key={f.id} id={f.id} num={idx+1} group={f.group}
                         title={f.title} desc={f.desc} padded={f.padded !== false}>
                    {f.c}
                  </Frame>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand"/>
        <TweakColor label="Accent" value={t.accent} onChange={v => setTweak("accent", v)}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginTop:4}}>
          {["#3565D3","#0F8B5C","#C2453A","#7C3AED","#0E0E0C","#D97757"].map(c=>(
            <button key={c} onClick={()=>setTweak("accent",c)}
                    style={{height:22,borderRadius:4,border:"1px solid rgba(0,0,0,.12)",background:c,cursor:"pointer",outline:t.accent===c?"2px solid #0E0E0C":"none",outlineOffset:1}}/>
          ))}
        </div>
        <TweakSection label="Theme"/>
        <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak("dark", v)}/>
        <TweakToggle label="Grid overlay" value={t.grid} onChange={v => setTweak("grid", v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
