// Expanded component library — many more components, organized by category

// ── Buttons ────────────────────────────────────────────────
function ButtonsExpanded() {
  return (
    <div style={{display:"grid",gap:24}}>
      {[
        { v:"primary",   l:"Primary"   },
        { v:"secondary", l:"Secondary" },
        { v:"ghost",     l:"Ghost"     },
        { v:"danger",    l:"Danger"    },
      ].map(b => (
        <div key={b.v}>
          <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{b.l} <span style={{color:"var(--fg-5)",marginLeft:6}}>.btn-{b.v}</span></div>
          <div className="btn-row" style={{padding:0,border:"none"}}>
            <span className="var-label">States</span>
            {["", "hover", "active", "disabled"].map(s => (
              <div className="btn-cell" key={s||"rest"}>
                <span className="state">{s||"rest"}</span>
                <button className={`btn btn-${b.v} ${s}`}>
                  {b.v === "primary" && <Icon name="plus" size={14} stroke={2}/>}
                  {b.l}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Sizes & icon-only</div>
        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <button className="btn btn-primary btn-sm">Small</button>
          <button className="btn btn-primary">Default</button>
          <button className="btn btn-primary btn-lg">Large</button>
          <button className="btn btn-primary" style={{padding:"0 8px"}}><Icon name="plus" size={14} stroke={2}/></button>
          <button className="btn btn-secondary" style={{padding:"0 8px"}}><Icon name="more" size={14}/></button>
          <button className="btn btn-secondary">With <Icon name="chevronDown" size={12}/></button>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Button group</div>
        <div style={{display:"inline-flex"}}>
          <button className="btn btn-secondary" style={{borderRadius:"4px 0 0 4px",borderRight:"none"}}><Icon name="alignLeft" size={13}/></button>
          <button className="btn btn-secondary active" style={{borderRadius:0,borderRight:"none"}}><Icon name="alignCenter" size={13}/></button>
          <button className="btn btn-secondary" style={{borderRadius:"0 4px 4px 0"}}><Icon name="alignRight" size={13}/></button>
        </div>
      </div>
    </div>
  );
}

// ── Inputs ─────────────────────────────────────────────────
function InputsExpanded() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
        <div className="field"><label>Default</label><div className="input-w-icon"><Icon name="search" size={14}/><input className="input" placeholder="Search invoices"/></div></div>
        <div className="field"><label>Focused</label><div className="input-w-icon"><Icon name="search" size={14}/><input className="input focus" defaultValue="Acme Co"/></div></div>
        <div className="field"><label>Disabled</label><input className="input disabled" placeholder="Read only" disabled/></div>
        <div className="field"><label>Error</label><input className="input err" defaultValue="not-an-email"/><span className="err-msg">Enter a valid email.</span></div>
        <div className="field"><label>Prefix</label>
          <div style={{display:"flex",alignItems:"center",border:"1px solid var(--line-2)",borderRadius:"var(--radius-sm)",background:"var(--bg-elev)",overflow:"hidden"}}>
            <span style={{padding:"0 12px",height:36,display:"grid",placeItems:"center",borderRight:"1px solid var(--line)",fontSize:13,color:"var(--fg-4)"}}>https://</span>
            <input className="input" style={{border:0}} defaultValue="atlas.design"/>
          </div>
        </div>
        <div className="field"><label>Select</label>
          <div className="input" style={{justifyContent:"space-between"}}>San Francisco <Icon name="chevronDown" size={14}/></div>
        </div>
        <div className="field" style={{gridColumn:"span 3"}}><label>Textarea</label><textarea className="input" style={{height:80, padding:10, resize:"none"}} defaultValue="Multi-line text content with comfortable padding."/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
        <div className="field"><label>OTP</label>
          <div className="otp">
            <input defaultValue="4"/><input defaultValue="2"/><input defaultValue="9"/><input/><input/><input/>
          </div>
        </div>
        <div className="field"><label>Stepper</label>
          <div className="stepper">
            <button><Icon name="x" size={11} stroke={2}/></button>
            <span className="v">3</span>
            <button><Icon name="plus" size={11} stroke={2}/></button>
          </div>
        </div>
        <div className="field"><label>Search w/ shortcut</label>
          <div className="search-pill"><Icon name="search" size={13}/> Search system… <span className="kbd">⌘K</span></div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Selection controls</div>
        <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <span className="checkbox on"><span className="box"><Icon name="check" size={10} stroke={2.5}/></span> Selected</span>
            <span className="checkbox"><span className="box"></span> Unselected</span>
            <span className="checkbox" style={{opacity:.4}}><span className="box"></span> Disabled</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <span className="radio on"><span className="ring"></span> Selected</span>
            <span className="radio"><span className="ring"></span> Unselected</span>
            <span className="radio" style={{opacity:.4}}><span className="ring"></span> Disabled</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13}}><span className="toggle on"><span className="knob"/></span> On</span>
            <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13}}><span className="toggle"><span className="knob"/></span> Off</span>
          </div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Slider</div>
        <div style={{maxWidth:340}}>
          <div className="slider">
            <div className="track"><div className="fill" style={{width:"40%"}}/></div>
            <div className="knob" style={{left:"40%"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--fg-4)",marginTop:8}}>
            <span>$0</span><span>$2,000</span>
          </div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>File upload</div>
        <div className="dz">
          <Icon name="upload" size={20}/>
          <div className="t">Drop files or click to upload</div>
          <div className="d">PNG, JPG, PDF up to 10MB</div>
        </div>
      </div>
    </div>
  );
}

// ── Avatars ────────────────────────────────────────────────
function AvatarsFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Sizes</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span className="av av-xs">JS</span>
          <span className="av av-sm">JS</span>
          <span className="av av-md">JS</span>
          <span className="av av-lg">JS</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Stack & with status</div>
        <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
          <div className="av-stack">
            <span className="av av-sm" style={{background:"#FFE5C9",color:"#9C5B14"}}>JS</span>
            <span className="av av-sm" style={{background:"#D8EBFF",color:"#1F4F8B"}}>EM</span>
            <span className="av av-sm" style={{background:"#E5DBFF",color:"#5B33B8"}}>RK</span>
            <span className="av av-sm" style={{background:"var(--bg-sunken)",color:"var(--fg-3)"}}>+5</span>
          </div>
          <div style={{position:"relative"}}>
            <span className="av av-md">JS</span>
            <span style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:999,background:"var(--status-success)",border:"2px solid var(--bg-elev)"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="av av-md"><Icon name="user" size={16}/></span>
            <div>
              <div style={{fontSize:13,fontWeight:500}}>Jamie Sato</div>
              <div style={{fontSize:11,color:"var(--fg-4)"}}>jamie@atlas.design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Progress ───────────────────────────────────────────────
function ProgressFrame() {
  return (
    <div style={{display:"grid",gap:28}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Linear</div>
        <div style={{display:"grid",gap:10,maxWidth:400}}>
          <div><div style={{fontSize:11,color:"var(--fg-3)",marginBottom:4,display:"flex",justifyContent:"space-between"}}><span>Storage used</span><span className="mono">68%</span></div><div className="progress"><div style={{width:"68%"}}/></div></div>
          <div><div style={{fontSize:11,color:"var(--fg-3)",marginBottom:4,display:"flex",justifyContent:"space-between"}}><span>Onboarding</span><span className="mono">3 / 5</span></div><div className="progress"><div style={{width:"60%"}}/></div></div>
          <div><div style={{fontSize:11,color:"var(--fg-3)",marginBottom:4,display:"flex",justifyContent:"space-between"}}><span>Uploading</span><span className="mono">12%</span></div><div className="progress"><div style={{width:"12%"}}/></div></div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Stepper</div>
        <div className="steps">
          <div className="step done"><span className="num"><Icon name="check" size={11} stroke={2.5}/></span> Account</div>
          <div className="bar"/>
          <div className="step done"><span className="num"><Icon name="check" size={11} stroke={2.5}/></span> Workspace</div>
          <div className="bar"/>
          <div className="step active"><span className="num">3</span> Members</div>
          <div className="bar"/>
          <div className="step"><span className="num">4</span> Done</div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Ring</div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          {[25,50,75,100].map(p => {
            const r = 18, c = 2*Math.PI*r;
            return (
              <div key={p} style={{position:"relative",width:48,height:48}}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth="3"/>
                  <circle cx="24" cy="24" r={r} fill="none" stroke="var(--accent)" strokeWidth="3"
                    strokeDasharray={c} strokeDashoffset={c*(1-p/100)} strokeLinecap="round"
                    transform="rotate(-90 24 24)"/>
                </svg>
                <span style={{position:"absolute",inset:0,display:"grid",placeItems:"center",fontSize:11,fontFamily:"var(--font-mono)"}}>{p}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function SkeletonFrame() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <div className="card">
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
          <div className="skel" style={{width:36,height:36,borderRadius:999}}/>
          <div style={{flex:1,display:"grid",gap:6}}>
            <div className="skel" style={{height:10,width:"50%"}}/>
            <div className="skel" style={{height:8,width:"30%"}}/>
          </div>
        </div>
        <div className="skel" style={{height:10,marginBottom:8}}/>
        <div className="skel" style={{height:10,marginBottom:8,width:"86%"}}/>
        <div className="skel" style={{height:10,width:"60%"}}/>
      </div>
      <div className="card">
        <div className="skel" style={{height:120,marginBottom:12}}/>
        <div className="skel" style={{height:12,width:"70%",marginBottom:8}}/>
        <div className="skel" style={{height:10,width:"40%"}}/>
      </div>
    </div>
  );
}

// ── Tooltip ────────────────────────────────────────────────
function TooltipFrame() {
  return (
    <div style={{display:"flex",gap:32,alignItems:"flex-end",padding:"24px 0"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <span className="tt">Save changes</span>
        <button className="btn btn-secondary"><Icon name="download" size={13}/></button>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <span className="tt">Press <span className="kbd" style={{background:"rgba(255,255,255,.15)",borderColor:"rgba(255,255,255,.2)",color:"var(--bg)"}}>⌘ K</span> to search</span>
        <button className="btn btn-secondary"><Icon name="search" size={13}/></button>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <span className="tt">Delete invoice</span>
        <button className="btn btn-secondary"><Icon name="trash" size={13}/></button>
      </div>
    </div>
  );
}

// ── Menu ───────────────────────────────────────────────────
function MenuFrame() {
  return (
    <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
      <div className="menu">
        <div className="menu-label">Actions</div>
        <div className="menu-item"><Icon name="edit" size={13}/> Edit invoice <span className="kbd">E</span></div>
        <div className="menu-item"><Icon name="copy" size={13}/> Duplicate</div>
        <div className="menu-item"><Icon name="download" size={13}/> Download PDF</div>
        <div className="menu-sep"/>
        <div className="menu-item"><Icon name="link" size={13}/> Copy link</div>
        <div className="menu-item"><Icon name="send" size={13}/> Send to customer</div>
        <div className="menu-sep"/>
        <div className="menu-item danger"><Icon name="trash" size={13}/> Delete invoice</div>
      </div>
      <div className="menu" style={{width:180}}>
        <div className="menu-label">Sort by</div>
        <div className="menu-item"><Icon name="check" size={13} style={{color:"var(--accent)"}}/> Date created</div>
        <div className="menu-item" style={{paddingLeft:32}}>Amount</div>
        <div className="menu-item" style={{paddingLeft:32}}>Customer</div>
        <div className="menu-item" style={{paddingLeft:32}}>Status</div>
      </div>
    </div>
  );
}

// ── Accordion ──────────────────────────────────────────────
function AccordionFrame() {
  return (
    <div className="acc" style={{maxWidth:560}}>
      <div className="acc-item">
        <div className="acc-head">What is included in the Pro plan? <Icon name="chevronDown" size={14}/></div>
        <div className="acc-body">Unlimited invoices, custom branding, multi-currency support, and priority email support.</div>
      </div>
      <div className="acc-item">
        <div className="acc-head">Can I cancel my subscription? <Icon name="chevronRight" size={14}/></div>
      </div>
      <div className="acc-item">
        <div className="acc-head">Do you offer team plans? <Icon name="chevronRight" size={14}/></div>
      </div>
    </div>
  );
}

// ── Breadcrumb / Pagination ────────────────────────────────
function NavBitsFrame() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Breadcrumb</div>
        <span className="crumbs">
          <a>Atlas</a><span className="sep">/</span>
          <a>Invoices</a><span className="sep">/</span>
          <span className="here">INV-1042</span>
        </span>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Pagination</div>
        <div className="pager">
          <span className="pg dis"><Icon name="chevronRight" size={11} style={{transform:"rotate(180deg)"}}/></span>
          <span className="pg">1</span>
          <span className="pg active">2</span>
          <span className="pg">3</span>
          <span className="pg">…</span>
          <span className="pg">12</span>
          <span className="pg"><Icon name="chevronRight" size={11}/></span>
        </div>
      </div>
    </div>
  );
}

// ── Toast / Banner ─────────────────────────────────────────
function ToastBannerFrame() {
  return (
    <div style={{display:"grid",gap:20}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Toasts</div>
        <div style={{display:"grid",gap:10,maxWidth:380}}>
          <div className="toast"><Icon name="success" size={14} style={{color:"oklch(0.78 0.13 150)"}}/> Invoice saved as draft <span className="kbd" style={{background:"rgba(255,255,255,.1)",borderColor:"rgba(255,255,255,.15)",color:"var(--bg)",marginLeft:14}}>UNDO</span></div>
          <div className="toast"><Icon name="info" size={14}/> Atlas 2.4 is now available</div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Top banner</div>
        <div className="banner">
          <Icon name="zap" size={14}/>
          <span>You're on the free plan — upgrade for unlimited invoices.</span>
          <div className="right"><span style={{textDecoration:"underline",cursor:"pointer"}}>Upgrade</span> <Icon name="x" size={13}/></div>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────
function EmptyStateFrame() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div className="empty">
        <div className="ico"><Icon name="folder" size={20}/></div>
        <div className="t">No projects yet</div>
        <div className="d">Create your first project to start tracking work.</div>
        <button className="btn btn-primary btn-sm" style={{marginTop:14}}><Icon name="plus" size={12} stroke={2}/> New project</button>
      </div>
      <div className="empty">
        <div className="ico"><Icon name="search" size={20}/></div>
        <div className="t">No results for "active"</div>
        <div className="d">Try clearing filters or searching different terms.</div>
        <button className="btn btn-ghost btn-sm" style={{marginTop:14}}>Clear filters</button>
      </div>
    </div>
  );
}

// ── Toolbar ────────────────────────────────────────────────
function ToolbarFrame() {
  return (
    <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
      <div className="toolbar">
        <span className="tb active"><Icon name="bold" size={14}/></span>
        <span className="tb"><Icon name="italic" size={14}/></span>
        <span className="tb"><Icon name="underline" size={14}/></span>
        <span className="div"/>
        <span className="tb"><Icon name="alignLeft" size={14}/></span>
        <span className="tb active"><Icon name="alignCenter" size={14}/></span>
        <span className="tb"><Icon name="alignRight" size={14}/></span>
        <span className="div"/>
        <span className="tb"><Icon name="link" size={14}/></span>
        <span className="tb"><Icon name="image" size={14}/></span>
      </div>
      <div className="toolbar">
        <span className="tb"><Icon name="play" size={14}/></span>
        <span className="tb active"><Icon name="pause" size={14}/></span>
        <span className="tb"><Icon name="refresh" size={14}/></span>
      </div>
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────
function DrawerFrame() {
  return (
    <div className="drawer-frame">
      <div className="drawer-card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontWeight:600,fontSize:14}}>Invoice details</div>
          <Icon name="x" size={14} style={{color:"var(--fg-4)"}}/>
        </div>
        <div style={{display:"grid",gap:14}}>
          <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Customer</div><div style={{fontSize:13}}>Acme Co.</div></div>
          <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Amount</div><div style={{fontSize:13,fontFamily:"var(--font-mono)"}}>$2,400.00</div></div>
          <div><div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Status</div><span className="chip chip-success chip-status">Paid</span></div>
        </div>
        <div style={{position:"absolute",left:20,right:20,bottom:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn btn-ghost btn-sm">Cancel</button>
          <button className="btn btn-primary btn-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Date picker ────────────────────────────────────────────
function DatePickerFrame() {
  const days = [];
  for (let i=0;i<35;i++) days.push(i-2);
  return (
    <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>
      <div className="cal">
        <div className="cal-head">
          <Icon name="chevronRight" size={13} style={{transform:"rotate(180deg)",color:"var(--fg-4)"}}/>
          <b>April 2026</b>
          <Icon name="chevronRight" size={13} style={{color:"var(--fg-4)"}}/>
        </div>
        <div className="cal-grid">
          {["S","M","T","W","T","F","S"].map((d,i) => <div className="dow" key={i}>{d}</div>)}
          {days.map((d,i) => {
            const isMuted = d <= 0 || d > 30;
            const display = isMuted ? (d<=0 ? 31+d : d-30) : d;
            const isToday = d === 28;
            const isSel = d === 22;
            return <div key={i} className={`day ${isMuted?"muted":""} ${isToday?"today":""} ${isSel?"sel":""}`}>{display}</div>;
          })}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,paddingTop:8}}>
        <div className="field"><label>Date</label><div className="input" style={{width:200,justifyContent:"space-between"}}>Apr 22, 2026 <Icon name="calendar" size={13}/></div></div>
        <div className="field"><label>Range</label>
          <div className="input" style={{width:200,justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:12}}>04/22 — 04/28 <Icon name="calendar" size={13}/></div>
        </div>
      </div>
    </div>
  );
}

// ── Command palette ────────────────────────────────────────
function CommandFrame() {
  return (
    <div style={{maxWidth:480}}>
      <div style={{background:"var(--bg-elev)",border:"1px solid var(--line-2)",borderRadius:"var(--radius-lg)",boxShadow:"0 14px 32px rgba(0,0,0,.10), 0 4px 8px rgba(0,0,0,.06)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid var(--line)"}}>
          <Icon name="search" size={14} style={{color:"var(--fg-4)"}}/>
          <input className="input" style={{border:0,padding:0,height:"auto",fontSize:14}} defaultValue="new pro" autoFocus/>
          <span className="kbd">esc</span>
        </div>
        <div style={{padding:6}}>
          <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",padding:"6px 10px"}}>Suggestions</div>
          {[
            {i:"plus",l:"New project",k:"⌘ N",a:true},
            {i:"users",l:"New customer",k:""},
            {i:"file",l:"New invoice",k:"⌘ I"},
            {i:"folder",l:"Open project…",k:"⌘ O"},
          ].map(it=>(
            <div key={it.l} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:4,fontSize:13,background:it.a?"var(--accent-soft)":"transparent",color:it.a?"var(--accent)":"var(--fg-2)"}}>
              <Icon name={it.i} size={14}/>
              <span>{it.l}</span>
              {it.k && <span className="kbd" style={{marginLeft:"auto"}}>{it.k}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Code block ─────────────────────────────────────────────
function CodeFrame() {
  return (
    <div style={{display:"grid",gap:16}}>
      <div style={{fontSize:13,color:"var(--fg-3)"}}>Apply tokens with the <span className="code">--accent</span> CSS variable, or use <span className="code">var(--fg-2)</span> for secondary text.</div>
      <pre className="code-block">{`/* Token application */
.button-primary {
  background: var(--accent);
  color: var(--accent-fg);
  border-radius: var(--radius-sm);
  box-shadow: var(--elev-1);
}`}</pre>
    </div>
  );
}

// ── Cards (3 patterns) ─────────────────────────────────────
function CardsExpanded() {
  return (
    <div style={{display:"grid",gap:24}}>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Patterns</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          <div className="card">
            <div className="card-img"><Icon name="image" size={20}/></div>
            <div style={{marginTop:14}}>
              <div style={{fontWeight:600,marginBottom:4}}>Content card</div>
              <div style={{fontSize:12,color:"var(--fg-3)",marginBottom:14,lineHeight:1.5}}>Media, title, copy, action.</div>
              <button className="btn btn-secondary btn-sm">Open</button>
            </div>
          </div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <span style={{fontSize:11,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em"}}>Last 30 days</span>
              <Icon name="more" size={14} style={{color:"var(--fg-4)"}}/>
            </div>
            <div style={{fontFamily:"var(--font-serif)",fontSize:32,letterSpacing:"-0.02em"}}>$24,890</div>
            <div style={{fontSize:12,color:"var(--status-success)",marginTop:4}}>↑ 12.4%</div>
            <div style={{marginTop:18,display:"flex",alignItems:"flex-end",gap:3,height:40}}>
              {[6,9,5,12,8,14,11,16,9,13,17,21].map((h,i)=>(
                <div key={i} style={{flex:1,background:"var(--accent)",height:`${h*2}px`,borderRadius:1,opacity:.75}}/>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span className="av av-md">JS</span>
              <div>
                <div style={{fontWeight:500,fontSize:13}}>Jamie Sato</div>
                <div style={{fontSize:11,color:"var(--fg-4)"}}>Design lead</div>
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--fg-3)",lineHeight:1.5}}>"The new spacing scale finally makes our marketing site and product feel like one product."</div>
          </div>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Feature card</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {i:"zap",t:"Lightning fast",d:"Sub-50ms response on every action."},
            {i:"shield",t:"Secure by default",d:"SOC 2 Type II + end-to-end encryption."},
            {i:"globe",t:"Multi-region",d:"Deployed across 14 regions worldwide."},
          ].map(f=>(
            <div className="card" key={f.t}>
              <div style={{width:32,height:32,borderRadius:"var(--radius-sm)",background:"var(--accent-soft)",color:"var(--accent)",display:"grid",placeItems:"center",marginBottom:14}}>
                <Icon name={f.i} size={16}/>
              </div>
              <div style={{fontWeight:600,marginBottom:4,fontSize:13}}>{f.t}</div>
              <div style={{fontSize:12,color:"var(--fg-3)",lineHeight:1.5}}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ButtonsExpanded, InputsExpanded, AvatarsFrame, ProgressFrame, SkeletonFrame,
  TooltipFrame, MenuFrame, AccordionFrame, NavBitsFrame, ToastBannerFrame,
  EmptyStateFrame, ToolbarFrame, DrawerFrame, DatePickerFrame, CommandFrame,
  CodeFrame, CardsExpanded
});
