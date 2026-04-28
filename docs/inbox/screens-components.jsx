// Components: Buttons, Inputs, Chips, Tabs, Navigation, Tables, Alerts, Cards, Modals

function ButtonsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <div className="eyebrow">07 / COMPONENT</div>
          <h1>Buttons</h1>
        </div>
        <p className="lede">Three intents — primary, secondary, ghost — across rest, hover, active, and disabled states.</p>
      </div>

      {[
        { variant: "primary",   label: "Primary"   },
        { variant: "secondary", label: "Secondary" },
        { variant: "ghost",     label: "Ghost"     },
        { variant: "danger",    label: "Danger"    },
      ].map(v => (
        <section className="section" key={v.variant}>
          <div className="section-head">
            <h2>{v.label}</h2>
            <span className="count">.btn-{v.variant}</span>
          </div>
          <div>
            <div className="btn-row">
              <span className="var-label">Default</span>
              {["", "hover", "active", "disabled"].map(state => (
                <div className="btn-cell" key={state || "rest"}>
                  <span className="state">{state || "rest"}</span>
                  <button className={`btn btn-${v.variant} ${state}`}>
                    {v.variant === "primary" && <Icon name="plus" size={14} stroke={2} />}
                    {v.label}
                  </button>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <span className="var-label">Sizes</span>
              <div className="btn-cell"><span className="state">small</span><button className={`btn btn-${v.variant} btn-sm`}>{v.label}</button></div>
              <div className="btn-cell"><span className="state">default</span><button className={`btn btn-${v.variant}`}>{v.label}</button></div>
              <div className="btn-cell"><span className="state">large</span><button className={`btn btn-${v.variant} btn-lg`}>{v.label}</button></div>
              <div className="btn-cell"><span className="state">icon only</span><button className={`btn btn-${v.variant}`} style={{padding:"0 8px"}}><Icon name="plus" size={14} stroke={2}/></button></div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

function InputsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">08 / COMPONENT</div><h1>Inputs &amp; Forms</h1></div>
        <p className="lede">Form controls share a 36px height and the same focus ring tied to the brand accent.</p>
      </div>

      <section className="section">
        <div className="section-head"><h2>Text input — states</h2><span className="count">.input</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <div className="field"><label>Default</label><div className="input-w-icon"><Icon name="search" size={14} /><input className="input" placeholder="Search invoices" /></div></div>
          <div className="field"><label>Focused</label><div className="input-w-icon"><Icon name="search" size={14} /><input className="input focus" defaultValue="Acme Co" /></div><span className="help">Tied to var(--accent).</span></div>
          <div className="field"><label>Disabled</label><input className="input disabled" placeholder="Read only" disabled /></div>
          <div className="field"><label>Error</label><input className="input err" defaultValue="not-an-email" /><span className="err-msg">Enter a valid email address.</span></div>
          <div className="field"><label>With prefix</label><div style={{display:"flex",alignItems:"center",border:"1px solid var(--line-2)",borderRadius:"var(--radius-sm)",background:"var(--bg-elev)",overflow:"hidden"}}><span style={{padding:"0 12px",height:36,display:"grid",placeItems:"center",borderRight:"1px solid var(--line)",fontSize:13,color:"var(--fg-4)"}}>https://</span><input className="input" style={{border:0}} defaultValue="atlas.design" /></div></div>
          <div className="field"><label>Textarea</label><textarea className="input" style={{height:80, padding:10, resize:"none"}} defaultValue="Multi-line text content with comfortable padding and the same focus treatment as single-line inputs." /></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Selection</h2></div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="checkbox on"><span className="box"><Icon name="check" size={10} stroke={2.5}/></span> Selected</span>
            <span className="checkbox"><span className="box"></span> Unselected</span>
            <span className="checkbox on" style={{opacity:.4}}><span className="box"><Icon name="check" size={10} stroke={2.5}/></span> Disabled</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="radio on"><span className="ring"></span> Selected</span>
            <span className="radio"><span className="ring"></span> Unselected</span>
            <span className="radio" style={{opacity:.4}}><span className="ring"></span> Disabled</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13}}><span className="toggle on"><span className="knob"/></span> On</span>
            <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13}}><span className="toggle"><span className="knob"/></span> Off</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChipsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">09 / COMPONENT</div><h1>Chips</h1></div>
        <p className="lede">Small, compact labels for filters, status, and metadata.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Variants</h2></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <span className="chip">Default</span>
          <span className="chip soft">Soft</span>
          <span className="chip solid">Solid</span>
          <span className="chip outline">Outline</span>
          <span className="chip">With icon <Icon name="check" size={11} stroke={2.5} /></span>
          <span className="chip soft">Removable <Icon name="x" size={11} stroke={2}/></span>
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2>Status</h2></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <span className="chip chip-success chip-status">Active</span>
          <span className="chip chip-warning chip-status">Pending</span>
          <span className="chip chip-error chip-status">Failed</span>
          <span className="chip chip-info chip-status">Draft</span>
        </div>
      </section>
    </div>
  );
}

function TabsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">10 / COMPONENT</div><h1>Tabs</h1></div>
        <p className="lede">Two patterns: underline for page-level navigation, segmented for inline view switching.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Underline</h2></div>
        <div className="tabs-underline">
          <span className="tab active">Overview</span>
          <span className="tab">Activity</span>
          <span className="tab">Members</span>
          <span className="tab">Settings</span>
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2>Segmented</h2></div>
        <div className="tabs-segmented">
          <span className="seg active">List</span>
          <span className="seg">Board</span>
          <span className="seg">Calendar</span>
          <span className="seg">Timeline</span>
        </div>
      </section>
    </div>
  );
}

function NavigationScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">11 / COMPONENT</div><h1>Navigation</h1></div>
        <p className="lede">Top bar for product-level wayfinding, side rail for in-section navigation.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Top bar</h2></div>
        <div className="nav-demo">
          <div className="nav-top">
            <span className="lg-mark">Atlas</span>
            <span className="nav-link active">Dashboard</span>
            <span className="nav-link">Projects</span>
            <span className="nav-link">Reports</span>
            <span className="nav-link">Library</span>
            <div className="right">
              <Icon name="search" size={14}/>
              <Icon name="bell" size={14}/>
              <span style={{width:24,height:24,borderRadius:999,background:"var(--accent)",color:"var(--accent-fg)",display:"grid",placeItems:"center",fontSize:11,fontWeight:600}}>JS</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head"><h2>Side rail</h2></div>
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
      </section>
    </div>
  );
}

function TablesScreen() {
  const rows = [
    { id: "INV-1042", customer: "Acme Co.", amount: "$2,400.00", status: "Paid", due: "Apr 22" },
    { id: "INV-1041", customer: "Globex",   amount: "$890.00",   status: "Pending", due: "Apr 28" },
    { id: "INV-1040", customer: "Initech",  amount: "$5,120.00", status: "Paid", due: "Apr 18" },
    { id: "INV-1039", customer: "Hooli",    amount: "$340.00",   status: "Failed", due: "Apr 15" },
    { id: "INV-1038", customer: "Pied Piper", amount:"$1,210.00",status: "Draft", due: "—" },
  ];
  const map = { Paid: "success", Pending: "warning", Failed: "error", Draft: "info" };
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">12 / COMPONENT</div><h1>Tables</h1></div>
        <p className="lede">Dense data with tabular numerics, soft row hover, and status pills.</p>
      </div>
      <section className="section">
        <table className="tbl">
          <thead><tr><th>Invoice</th><th>Customer</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th><th>Due</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="num">{r.id}</td>
                <td>{r.customer}</td>
                <td className="num" style={{textAlign:"right"}}>{r.amount}</td>
                <td><span className={`chip chip-${map[r.status]} chip-status`}>{r.status}</span></td>
                <td className="num">{r.due}</td>
                <td style={{textAlign:"right",color:"var(--fg-4)"}}><Icon name="more" size={16}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function AlertsScreen() {
  const alerts = [
    { kind: "success", icon: "success", title: "Payment received", msg: "$2,400 from Acme Co. has been deposited to your account." },
    { kind: "warning", icon: "warning", title: "Subscription expiring", msg: "Your plan renews in 3 days. Update payment method to avoid interruption." },
    { kind: "error",   icon: "error",   title: "Sync failed",    msg: "Could not connect to the upstream service. We'll retry automatically." },
    { kind: "info",    icon: "info",    title: "New release",    msg: "Atlas 2.4 introduces command palette, improved tables, and dark mode." },
  ];
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">13 / COMPONENT</div><h1>Alerts</h1></div>
        <p className="lede">Status-bound messaging. Use sparingly — never decoratively.</p>
      </div>
      <section className="section">
        <div style={{display:"grid",gap:12}}>
          {alerts.map(a => (
            <div className={`alert alert-${a.kind}`} key={a.kind}>
              <span className="icon"><Icon name={a.icon} size={16} stroke={1.75}/></span>
              <div className="body">
                <div className="title">{a.title}</div>
                <div className="msg">{a.msg}</div>
              </div>
              <Icon name="x" size={14} style={{opacity:.5,cursor:"pointer"}}/>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CardsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">14 / COMPONENT</div><h1>Cards</h1></div>
        <p className="lede">Three patterns covering the majority of layout needs.</p>
      </div>
      <section className="section">
        <div className="section-head"><h2>Patterns</h2></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          <div className="card">
            <div className="card-img"><Icon name="image" size={20}/></div>
            <div style={{marginTop:14}}>
              <div style={{fontWeight:600,marginBottom:4}}>Content card</div>
              <div style={{fontSize:12,color:"var(--fg-3)",marginBottom:14,lineHeight:1.5}}>A simple card with media, title, supporting copy, and a single action.</div>
              <button className="btn btn-secondary btn-sm">Open</button>
            </div>
          </div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <span style={{fontSize:11,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em"}}>Last 30 days</span>
              <Icon name="more" size={14} style={{color:"var(--fg-4)"}}/>
            </div>
            <div style={{fontFamily:"var(--font-serif)",fontSize:32,letterSpacing:"-0.02em"}}>$24,890</div>
            <div style={{fontSize:12,color:"var(--status-success)",marginTop:4}}>↑ 12.4% vs prev period</div>
            <div style={{marginTop:18,display:"flex",alignItems:"flex-end",gap:3,height:40}}>
              {[6,9,5,12,8,14,11,16,9,13,17,21].map((h,i)=>(
                <div key={i} style={{flex:1,background:"var(--accent)",height:`${h*2}px`,borderRadius:1,opacity:.75}}/>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span style={{width:32,height:32,borderRadius:999,background:"var(--accent-soft)",color:"var(--accent)",display:"grid",placeItems:"center",fontWeight:600,fontSize:12}}>JS</span>
              <div>
                <div style={{fontWeight:500,fontSize:13}}>Jamie Sato</div>
                <div style={{fontSize:11,color:"var(--fg-4)"}}>Design lead · Atlas team</div>
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--fg-3)",lineHeight:1.5}}>"The new spacing scale finally makes our marketing site and product feel like one product."</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModalsScreen() {
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">15 / COMPONENT</div><h1>Modals &amp; Dialogs</h1></div>
        <p className="lede">Centered, max 480px, elevation L3. Always dismissible.</p>
      </div>
      <section className="section">
        <div className="modal-frame">
          <div className="modal-card">
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>Delete invoice INV-1042?</div>
                <div style={{fontSize:12,color:"var(--fg-3)",marginTop:4,lineHeight:1.5}}>This action cannot be undone. The invoice will be removed from records.</div>
              </div>
              <Icon name="x" size={14} style={{color:"var(--fg-4)",cursor:"pointer",marginTop:2}}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18}}>
              <button className="btn btn-ghost">Cancel</button>
              <button className="btn btn-danger">Delete invoice</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ButtonsScreen, InputsScreen, ChipsScreen, TabsScreen, NavigationScreen, TablesScreen, AlertsScreen, CardsScreen, ModalsScreen });
