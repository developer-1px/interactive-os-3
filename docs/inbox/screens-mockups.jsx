// Mockup screens — applying the design system to real product UI

function MockChrome({ url, children }) {
  return (
    <div className="mockup">
      <div className="mock-bar">
        <div className="dots"><i/><i/><i/></div>
        <div className="url">{url}</div>
        <div style={{width:30}}/>
      </div>
      {children}
    </div>
  );
}

// ── 1. Dashboard ────────────────────────────────────────────
function MockDashboard() {
  return (
    <MockChrome url="atlas.app/dashboard">
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",minHeight:560}}>
        <div style={{borderRight:"1px solid var(--line)",padding:16,background:"var(--bg-sunken)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
            <div className="brand-mark" style={{background:"var(--accent)",color:"var(--accent-fg)"}}>A</div>
            <span style={{fontWeight:600,fontSize:13}}>Atlas</span>
          </div>
          {[
            {n:"home",l:"Home",a:true},{n:"folder",l:"Projects"},{n:"users",l:"Customers"},
            {n:"file",l:"Invoices"},{n:"calendar",l:"Calendar"},{n:"settings",l:"Settings"}
          ].map(it=>(
            <div key={it.l} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",fontSize:12,borderRadius:4,marginBottom:1,background:it.a?"var(--bg-elev)":"transparent",color:it.a?"var(--fg)":"var(--fg-3)",fontWeight:it.a?500:400}}>
              <Icon name={it.n} size={13}/> {it.l}
            </div>
          ))}
        </div>
        <div style={{padding:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div>
              <div style={{fontFamily:"var(--font-serif)",fontSize:28,letterSpacing:"-0.02em"}}>Good afternoon, Jamie</div>
              <div style={{fontSize:12,color:"var(--fg-4)",marginTop:2}}>Tuesday, April 28</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-secondary btn-sm"><Icon name="download" size={12}/> Export</button>
              <button className="btn btn-primary btn-sm"><Icon name="plus" size={12} stroke={2}/> New invoice</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[
              {l:"Outstanding",v:"$12,480",d:"+8.2%",p:true},
              {l:"Paid (30d)",v:"$48,210",d:"+12.4%",p:true},
              {l:"Overdue",v:"$3,120",d:"−2.1%",p:false},
              {l:"Customers",v:"284",d:"+4 new",p:true},
            ].map(s=>(
              <div className="card" key={s.l} style={{padding:14}}>
                <div style={{fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em"}}>{s.l}</div>
                <div style={{fontFamily:"var(--font-serif)",fontSize:22,marginTop:4,letterSpacing:"-0.02em"}}>{s.v}</div>
                <div style={{fontSize:11,color:s.p?"var(--status-success)":"var(--status-error)",marginTop:2}}>{s.d}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:"1px solid var(--line)"}}>
              <div style={{fontWeight:500,fontSize:13}}>Recent invoices</div>
              <div className="tabs-segmented" style={{transform:"scale(.85)"}}>
                <span className="seg active">All</span><span className="seg">Paid</span><span className="seg">Pending</span>
              </div>
            </div>
            <table className="tbl" style={{border:"none",borderRadius:0}}>
              <thead><tr><th>Invoice</th><th>Customer</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  {id:"INV-1042",c:"Acme Co.",a:"$2,400.00",s:"Paid"},
                  {id:"INV-1041",c:"Globex",a:"$890.00",s:"Pending"},
                  {id:"INV-1040",c:"Initech",a:"$5,120.00",s:"Paid"},
                ].map(r=>(
                  <tr key={r.id}>
                    <td className="num">{r.id}</td>
                    <td>{r.c}</td>
                    <td className="num" style={{textAlign:"right"}}>{r.a}</td>
                    <td><span className={`chip chip-${r.s==="Paid"?"success":"warning"} chip-status`}>{r.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MockChrome>
  );
}

// ── 2. Settings ─────────────────────────────────────────────
function MockSettings() {
  return (
    <MockChrome url="atlas.app/settings/profile">
      <div style={{padding:32,minHeight:560}}>
        <div style={{fontFamily:"var(--font-serif)",fontSize:32,letterSpacing:"-0.02em",marginBottom:6}}>Settings</div>
        <div style={{fontSize:13,color:"var(--fg-3)",marginBottom:24}}>Manage your account, team, and integrations.</div>
        <div className="tabs-underline" style={{marginBottom:28}}>
          <span className="tab active">Profile</span><span className="tab">Team</span><span className="tab">Billing</span><span className="tab">API</span><span className="tab">Notifications</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:48,maxWidth:760}}>
          <div>
            <div style={{fontWeight:500,fontSize:13,marginBottom:4}}>Personal info</div>
            <div style={{fontSize:12,color:"var(--fg-4)",lineHeight:1.5}}>Update your photo and personal details.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div className="field"><label>Full name</label><input className="input" defaultValue="Jamie Sato"/></div>
            <div className="field"><label>Email</label><input className="input focus" defaultValue="jamie@atlas.design"/></div>
            <div className="field"><label>Role</label>
              <div className="input" style={{justifyContent:"space-between"}}>Design Lead <Icon name="chevronDown" size={14}/></div>
            </div>
            <div className="field"><label>Bio</label><textarea className="input" style={{height:72,padding:10,resize:"none"}} defaultValue="Designing systems that make complex products feel obvious."/></div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:8}}>
              <button className="btn btn-ghost">Cancel</button>
              <button className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </MockChrome>
  );
}

// ── 3. Invoice detail ───────────────────────────────────────
function MockInvoice() {
  return (
    <MockChrome url="atlas.app/invoices/INV-1042">
      <div style={{padding:32,minHeight:560}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--fg-4)",marginBottom:14}}>
          <Icon name="chevronRight" size={11}/> Invoices <Icon name="chevronRight" size={11}/> <span style={{color:"var(--fg)"}}>INV-1042</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
              <div style={{fontFamily:"var(--font-serif)",fontSize:36,letterSpacing:"-0.02em"}}>$2,400.00</div>
              <span className="chip chip-success chip-status">Paid</span>
            </div>
            <div style={{fontSize:12,color:"var(--fg-4)"}}>Issued Apr 12 · Paid Apr 22 · Acme Co.</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={12}/> PDF</button>
            <button className="btn btn-secondary btn-sm"><Icon name="link" size={12}/> Share</button>
            <button className="btn btn-secondary btn-sm" style={{padding:"0 8px"}}><Icon name="more" size={14}/></button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
          <div className="card" style={{padding:0}}>
            <table className="tbl" style={{border:"none"}}>
              <thead><tr><th>Item</th><th style={{textAlign:"right"}}>Qty</th><th style={{textAlign:"right"}}>Rate</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
              <tbody>
                <tr><td>Design system audit</td><td className="num" style={{textAlign:"right"}}>1</td><td className="num" style={{textAlign:"right"}}>$1,800.00</td><td className="num" style={{textAlign:"right"}}>$1,800.00</td></tr>
                <tr><td>Component library handoff</td><td className="num" style={{textAlign:"right"}}>4</td><td className="num" style={{textAlign:"right"}}>$150.00</td><td className="num" style={{textAlign:"right"}}>$600.00</td></tr>
              </tbody>
            </table>
            <div style={{padding:"14px 16px",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"flex-end",gap:48,fontSize:13}}>
              <div style={{display:"flex",flexDirection:"column",gap:4,color:"var(--fg-3)",textAlign:"right"}}>
                <div>Subtotal</div><div>Tax (0%)</div><div style={{color:"var(--fg)",fontWeight:500}}>Total</div>
              </div>
              <div className="num" style={{display:"flex",flexDirection:"column",gap:4,textAlign:"right"}}>
                <div>$2,400.00</div><div>$0.00</div><div style={{fontWeight:500}}>$2,400.00</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card">
              <div style={{fontSize:11,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Customer</div>
              <div style={{fontWeight:500,fontSize:13}}>Acme Co.</div>
              <div style={{fontSize:12,color:"var(--fg-3)",marginTop:2}}>billing@acme.example<br/>San Francisco, CA</div>
            </div>
            <div className="alert alert-success">
              <span className="icon"><Icon name="success" size={16}/></span>
              <div className="body"><div className="title">Payment received</div><div className="msg">via ACH on Apr 22, 2026.</div></div>
            </div>
          </div>
        </div>
      </div>
    </MockChrome>
  );
}

// ── 4. Onboarding ───────────────────────────────────────────
function MockOnboarding() {
  return (
    <MockChrome url="atlas.app/welcome">
      <div style={{padding:"56px 32px",minHeight:560,display:"grid",placeItems:"center",background:"var(--bg-sunken)"}}>
        <div style={{width:480}}>
          <div style={{display:"flex",gap:6,marginBottom:32}}>
            <div style={{height:3,flex:1,background:"var(--accent)",borderRadius:2}}/>
            <div style={{height:3,flex:1,background:"var(--accent)",borderRadius:2}}/>
            <div style={{height:3,flex:1,background:"var(--line-2)",borderRadius:2}}/>
            <div style={{height:3,flex:1,background:"var(--line-2)",borderRadius:2}}/>
          </div>
          <div className="card" style={{padding:32,boxShadow:"0 14px 32px rgba(0,0,0,.06), 0 4px 8px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:11,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Step 2 of 4</div>
            <div style={{fontFamily:"var(--font-serif)",fontSize:28,letterSpacing:"-0.02em",marginBottom:8}}>Set up your workspace</div>
            <div style={{fontSize:13,color:"var(--fg-3)",marginBottom:24,lineHeight:1.55}}>This is where your team will collaborate. You can change these later.</div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="field"><label>Workspace name</label><input className="input focus" defaultValue="Atlas Studio"/></div>
              <div className="field"><label>Workspace URL</label>
                <div style={{display:"flex",alignItems:"center",border:"1px solid var(--line-2)",borderRadius:"var(--radius-sm)",background:"var(--bg-elev)",overflow:"hidden"}}>
                  <span style={{padding:"0 12px",height:36,display:"grid",placeItems:"center",borderRight:"1px solid var(--line)",fontSize:13,color:"var(--fg-4)",fontFamily:"var(--font-mono)"}}>atlas.app/</span>
                  <input className="input" style={{border:0}} defaultValue="atlas-studio"/>
                </div>
              </div>
              <div className="field"><label>Industry</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["Design","Engineering","Finance","Healthcare","Education","Other"].map((t,i)=>(
                    <span key={t} className={i===0?"chip soft":"chip"}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:28}}>
              <button className="btn btn-ghost">Back</button>
              <button className="btn btn-primary">Continue <Icon name="arrowRight" size={13}/></button>
            </div>
          </div>
        </div>
      </div>
    </MockChrome>
  );
}

// ── 5. Empty + command palette ──────────────────────────────
function MockCommand() {
  return (
    <MockChrome url="atlas.app/projects">
      <div style={{padding:32,minHeight:560,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div style={{fontFamily:"var(--font-serif)",fontSize:32,letterSpacing:"-0.02em"}}>Projects</div>
          <button className="btn btn-primary"><Icon name="plus" size={13} stroke={2}/> New project</button>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:24}}>
          <span className="chip soft">All <Icon name="x" size={11} stroke={2}/></span>
          <span className="chip">Active 12</span>
          <span className="chip">Archived 4</span>
        </div>
        <div style={{display:"grid",placeItems:"center",padding:"60px 0",border:"1px dashed var(--line-2)",borderRadius:"var(--radius)",color:"var(--fg-4)",textAlign:"center"}}>
          <Icon name="folder" size={28}/>
          <div style={{fontSize:14,color:"var(--fg-2)",marginTop:12,fontWeight:500}}>No projects match "active"</div>
          <div style={{fontSize:12,marginTop:4}}>Try clearing filters or starting a new project.</div>
        </div>
        {/* command palette */}
        <div style={{position:"absolute",left:"50%",top:64,transform:"translateX(-50%)",width:440,background:"var(--bg-elev)",border:"1px solid var(--line-2)",borderRadius:"var(--radius-lg)",boxShadow:"0 14px 32px rgba(0,0,0,.10), 0 4px 8px rgba(0,0,0,.06)",overflow:"hidden"}}>
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
    </MockChrome>
  );
}

// ── 6. Login ────────────────────────────────────────────────
function MockLogin() {
  return (
    <MockChrome url="atlas.app/login">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:560}}>
        <div style={{padding:48,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
            <div className="brand-mark" style={{background:"var(--accent)",color:"var(--accent-fg)"}}>A</div>
            <span style={{fontWeight:600,fontSize:14}}>Atlas</span>
          </div>
          <div style={{fontFamily:"var(--font-serif)",fontSize:32,letterSpacing:"-0.02em",marginBottom:6}}>Welcome back</div>
          <div style={{fontSize:13,color:"var(--fg-3)",marginBottom:28}}>Sign in to continue to your workspace.</div>
          <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:340}}>
            <button className="btn btn-secondary" style={{height:38,justifyContent:"center"}}><Icon name="globe" size={14}/> Continue with SSO</button>
            <div style={{display:"flex",alignItems:"center",gap:10,color:"var(--fg-4)",fontSize:11}}>
              <hr className="hr" style={{flex:1}}/> OR <hr className="hr" style={{flex:1}}/>
            </div>
            <div className="field"><label>Email</label><input className="input" defaultValue="jamie@atlas.design"/></div>
            <div className="field">
              <div style={{display:"flex",justifyContent:"space-between"}}><label>Password</label><span style={{fontSize:11,color:"var(--accent)"}}>Forgot?</span></div>
              <input className="input focus" type="password" defaultValue="••••••••••••"/>
            </div>
            <span className="checkbox on" style={{marginTop:4}}><span className="box"><Icon name="check" size={10} stroke={2.5}/></span> Keep me signed in</span>
            <button className="btn btn-primary" style={{height:38,justifyContent:"center",marginTop:6}}>Sign in</button>
            <div style={{fontSize:12,color:"var(--fg-4)",textAlign:"center",marginTop:6}}>New here? <span style={{color:"var(--accent)"}}>Create an account</span></div>
          </div>
        </div>
        <div style={{background:"var(--accent-soft)",position:"relative",overflow:"hidden",borderLeft:"1px solid var(--line)"}}>
          <div style={{position:"absolute",inset:32,border:"1px solid var(--accent)",opacity:.25,borderRadius:"var(--radius-lg)"}}/>
          <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",padding:48}}>
            <div style={{maxWidth:280}}>
              <div style={{fontFamily:"var(--font-serif)",fontSize:22,lineHeight:1.3,letterSpacing:"-0.01em",color:"var(--accent)"}}>"The new spacing scale finally makes our marketing site and product feel like one product."</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:20}}>
                <span style={{width:28,height:28,borderRadius:999,background:"var(--accent)",color:"var(--accent-fg)",display:"grid",placeItems:"center",fontWeight:600,fontSize:11}}>JS</span>
                <div style={{fontSize:12,color:"var(--accent)"}}>
                  <div style={{fontWeight:600}}>Jamie Sato</div>
                  <div style={{opacity:.7}}>Design Lead, Atlas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockChrome>
  );
}

function MockupsScreen() {
  const mocks = [
    { t: "Dashboard", d: "Workspace landing — surfaces stats, recent activity, primary actions.", c: <MockDashboard/> },
    { t: "Settings",  d: "Two-column profile form using the full input grammar.", c: <MockSettings/> },
    { t: "Invoice detail", d: "Document-centric view with status, table, sidebar metadata.", c: <MockInvoice/> },
    { t: "Onboarding", d: "Guided flow with progress, focused card, primary action.", c: <MockOnboarding/> },
    { t: "Empty state + command palette", d: "Filtered empty state with a layered command palette overlay.", c: <MockCommand/> },
    { t: "Login", d: "Two-pane authentication with SSO, social proof.", c: <MockLogin/> },
  ];
  return (
    <div className="screen">
      <div className="screen-head">
        <div><div className="eyebrow">16 / APPLIED</div><h1>Mockups</h1></div>
        <p className="lede">The system in use across six representative product surfaces. Flip dark mode and switch the brand color above to see them respond.</p>
      </div>
      {mocks.map((m,i)=>(
        <section className="section" key={i}>
          <div className="section-head">
            <h2>{String(i+1).padStart(2,"0")} · {m.t}</h2>
            <span className="desc">{m.d}</span>
          </div>
          {m.c}
        </section>
      ))}
    </div>
  );
}

Object.assign(window, { MockupsScreen });
