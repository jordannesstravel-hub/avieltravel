"use client";
import { useEffect, useMemo, useState } from "react";
import { supabasePublic } from "@/lib/supabase";

type Tab = "login"|"flights"|"packages"|"banners"|"leads";

export default function AdminApp() {
  const sb = useMemo(() => supabasePublic(), []);
  const [tab, setTab] = useState<Tab>("login");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setTab(data.session?.user ? "flights" : "login");
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setTab(session?.user ? "flights" : "login");
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
  }

  async function signOut() {
    await sb.auth.signOut();
  }

  return (
    <div style={{minHeight:"100vh", background:"#f8fafc"}}>
      <div style={{maxWidth:1100, margin:"0 auto", padding:16}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10}}>
          <div>
            <div style={{fontWeight:900, fontSize:20}}>Admin — Aviel Travel</div>
            <div style={{color:"#64748b"}}>Gestion des vols, packages, bannières & demandes</div>
          </div>
          {user && <button onClick={signOut} style={btnGhost()}>Déconnexion</button>}
        </div>

        {!user ? (
          <div style={card()}>
            <h2 style={{marginTop:0}}>Connexion</h2>
            <form onSubmit={signIn}>
              <div style={{display:"grid", gap:10, maxWidth:420}}>
                <input style={input()} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input style={input()} placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button style={btnOrange()} type="submit">Se connecter</button>
                {msg && <div style={{color:"#b91c1c"}}>{msg}</div>}
              </div>
            </form>
            <div style={{color:"#64748b", marginTop:12}}>
              Astuce: crée ton user admin dans Supabase → Authentication → Users.
            </div>
          </div>
        ) : (
          <>
            <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:14}}>
              <button onClick={()=>setTab("flights")} style={tabBtn(tab==="flights")}>Vols</button>
              <button onClick={()=>setTab("packages")} style={tabBtn(tab==="packages")}>Packages</button>
              <button onClick={()=>setTab("banners")} style={tabBtn(tab==="banners")}>Bannières</button>
              <button onClick={()=>setTab("leads")} style={tabBtn(tab==="leads")}>Demandes</button>
            </div>

            <div style={{marginTop:12}}>
              {tab==="flights" && <FlightsAdmin />}
              {tab==="packages" && <PackagesAdmin />}
              {tab==="banners" && <BannersAdmin />}
              {tab==="leads" && <LeadsAdmin />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function card(){ return {background:"white", border:"1px solid #e2e8f0", borderRadius:18, padding:16, marginTop:16};}
function input(){ return {padding:"10px 12px", borderRadius:12, border:"1px solid #e2e8f0", fontSize:14};}
function btnOrange(){ return {padding:"10px 12px", borderRadius:12, border:"1px solid transparent", background:"#FF6A00", color:"white", fontWeight:900, cursor:"pointer"} as any;}
function btnGhost(){ return {padding:"10px 12px", borderRadius:12, border:"1px solid #e2e8f0", background:"white", fontWeight:900, cursor:"pointer"} as any;}
function tabBtn(active:boolean){ return {...btnGhost(), background: active ? "#0A4DFF" : "white", color: active ? "white" : "#0f172a", borderColor: active ? "transparent":"#e2e8f0"} as any;}

function useSB(){
  return useMemo(()=>supabasePublic(),[]);
}

function FlightsAdmin(){
  const sb = useSB();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ route:"PARIS_TLV", trip:"RT", depart_date:"", return_date:"", price_eur:0, category:"GENERAL", active:true, priority:0, notes_fr:"", notes_en:"", notes_he:"" });

  async function refresh(){
    const { data } = await sb.from("offers_flights").select("*").order("created_at",{ascending:false}).limit(50);
    setRows(data ?? []);
  }
  useEffect(()=>{ refresh(); },[]);

  async function add(){
    await sb.from("offers_flights").insert(form);
    setForm({...form, depart_date:"", return_date:"", price_eur:0});
    refresh();
  }
  async function del(id:string){
    await sb.from("offers_flights").delete().eq("id", id);
    refresh();
  }

  return (
    <div style={card()}>
      <h2 style={{marginTop:0}}>Vols</h2>

      <div style={{display:"grid", gap:10}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <select style={input()} value={form.route} onChange={e=>setForm({...form, route:e.target.value})}>
            <option value="PARIS_TLV">PARIS_TLV</option>
            <option value="PARIS_EILAT">PARIS_EILAT</option>
          </select>
          <select style={input()} value={form.trip} onChange={e=>setForm({...form, trip:e.target.value})}>
            <option value="OW">OW</option>
            <option value="RT">RT</option>
          </select>
          <select style={input()} value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            {["PROMO","PESSAH","SUKKOT","SUMMER","WINTER","GENERAL"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <input style={input()} type="date" value={form.depart_date} onChange={e=>setForm({...form, depart_date:e.target.value})} />
          <input style={input()} type="date" value={form.return_date} onChange={e=>setForm({...form, return_date:e.target.value})} />
          <input style={input()} type="number" value={form.price_eur} onChange={e=>setForm({...form, price_eur:Number(e.target.value)})} placeholder="Prix €" />
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <input style={input()} type="number" value={form.priority} onChange={e=>setForm({...form, priority:Number(e.target.value)})} placeholder="Priorité" />
          <label style={{display:"flex", alignItems:"center", gap:8}}>
            <input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active:e.target.checked})} />
            Actif
          </label>
          <button style={btnOrange()} onClick={add}>Ajouter</button>
        </div>

        <textarea style={input()} rows={2} placeholder="Notes FR" value={form.notes_fr} onChange={e=>setForm({...form, notes_fr:e.target.value})} />
        <textarea style={input()} rows={2} placeholder="Notes EN" value={form.notes_en} onChange={e=>setForm({...form, notes_en:e.target.value})} />
        <textarea style={input()} rows={2} placeholder="Notes HE" value={form.notes_he} onChange={e=>setForm({...form, notes_he:e.target.value})} />
      </div>

      <div style={{marginTop:14, color:"#64748b"}}>Dernières 50 offres</div>
      <div style={{display:"grid", gap:10, marginTop:10}}>
        {rows.map(r => (
          <div key={r.id} style={{border:"1px solid #e2e8f0", borderRadius:14, padding:12, background:"#fff", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
            <div>
              <div style={{fontWeight:900}}>{r.route} · {r.trip} · {r.category} {r.active ? "✅": "⛔"}</div>
              <div style={{color:"#64748b"}}>{r.depart_date}{r.return_date ? " → "+r.return_date : ""} · {r.price_eur}€ · prio {r.priority}</div>
            </div>
            <button onClick={()=>del(r.id)} style={btnGhost()}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackagesAdmin(){
  const sb = useSB();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ depart_date:"", nights:4, hotel_name:"", board:"BB", price_eur:0, category:"GENERAL", active:true, priority:0, notes_fr:"", notes_en:"", notes_he:"" });

  async function refresh(){
    const { data } = await sb.from("offers_packages").select("*").order("created_at",{ascending:false}).limit(50);
    setRows(data ?? []);
  }
  useEffect(()=>{ refresh(); },[]);

  async function add(){
    await sb.from("offers_packages").insert(form);
    setForm({...form, depart_date:"", hotel_name:"", price_eur:0});
    refresh();
  }
  async function del(id:string){
    await sb.from("offers_packages").delete().eq("id", id);
    refresh();
  }

  return (
    <div style={card()}>
      <h2 style={{marginTop:0}}>Packages Eilat</h2>

      <div style={{display:"grid", gap:10}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <input style={input()} type="date" value={form.depart_date} onChange={e=>setForm({...form, depart_date:e.target.value})} />
          <input style={input()} type="number" value={form.nights} onChange={e=>setForm({...form, nights:Number(e.target.value)})} placeholder="Nuits" />
          <select style={input()} value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            {["PROMO","PESSAH","SUKKOT","SUMMER","WINTER","GENERAL"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <input style={input()} value={form.hotel_name} onChange={e=>setForm({...form, hotel_name:e.target.value})} placeholder="Nom hôtel" />
          <input style={input()} value={form.board} onChange={e=>setForm({...form, board:e.target.value})} placeholder="BB/HB/AI" />
          <input style={input()} type="number" value={form.price_eur} onChange={e=>setForm({...form, price_eur:Number(e.target.value)})} placeholder="Prix €" />
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}>
          <input style={input()} type="number" value={form.priority} onChange={e=>setForm({...form, priority:Number(e.target.value)})} placeholder="Priorité" />
          <label style={{display:"flex", alignItems:"center", gap:8}}>
            <input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active:e.target.checked})} />
            Actif
          </label>
          <button style={btnOrange()} onClick={add}>Ajouter</button>
        </div>

        <textarea style={input()} rows={2} placeholder="Notes FR" value={form.notes_fr} onChange={e=>setForm({...form, notes_fr:e.target.value})} />
        <textarea style={input()} rows={2} placeholder="Notes EN" value={form.notes_en} onChange={e=>setForm({...form, notes_en:e.target.value})} />
        <textarea style={input()} rows={2} placeholder="Notes HE" value={form.notes_he} onChange={e=>setForm({...form, notes_he:e.target.value})} />
      </div>

      <div style={{marginTop:14, color:"#64748b"}}>Derniers 50 packages</div>
      <div style={{display:"grid", gap:10, marginTop:10}}>
        {rows.map(r => (
          <div key={r.id} style={{border:"1px solid #e2e8f0", borderRadius:14, padding:12, background:"#fff", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
            <div>
              <div style={{fontWeight:900}}>{r.hotel_name} · {r.nights}N · {r.category} {r.active ? "✅": "⛔"}</div>
              <div style={{color:"#64748b"}}>{r.depart_date} · {r.board ?? ""} · {r.price_eur}€ · prio {r.priority}</div>
            </div>
            <button onClick={()=>del(r.id)} style={btnGhost()}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannersAdmin(){
  const sb = useSB();
  const [rows, setRows] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<any>({
    active:true, sort_order:0, title_fr:"", title_en:"", title_he:"",
    subtitle_fr:"", subtitle_en:"", subtitle_he:"",
    cta_fr:"Voir", cta_en:"View", cta_he:"צפייה",
    target_type:"PAGE", target_value:"/fr/promo",
  });

  async function refresh(){
    const { data } = await sb.from("home_banners").select("*").order("sort_order",{ascending:true}).limit(50);
    setRows(data ?? []);
  }
  useEffect(()=>{ refresh(); },[]);

  async function uploadAndAdd(){
    if(!file) return;
    const ext = file.name.split(".").pop() || "png";
    const path = `banner_${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage.from("public-banners").upload(path, file, { upsert:true });
    if(upErr){ alert(upErr.message); return; }
    await sb.from("home_banners").insert({
      ...form,
      image_path_desktop: path,
    });
    setFile(null);
    setForm({...form, title_fr:"", title_en:"", title_he:""});
    refresh();
  }

  async function del(id:string){
    await sb.from("home_banners").delete().eq("id", id);
    refresh();
  }

  return (
    <div style={card()}>
      <h2 style={{marginTop:0}}>Bannières accueil</h2>
      <div style={{display:"grid", gap:10}}>
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10}}>
          <input style={input()} placeholder="Titre FR" value={form.title_fr} onChange={e=>setForm({...form, title_fr:e.target.value})} />
          <input style={input()} placeholder="Titre EN" value={form.title_en} onChange={e=>setForm({...form, title_en:e.target.value})} />
        </div>
        <input style={input()} placeholder="Titre HE" value={form.title_he} onChange={e=>setForm({...form, title_he:e.target.value})} />
        <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10}}>
          <select style={input()} value={form.target_type} onChange={e=>setForm({...form, target_type:e.target.value})}>
            <option value="PAGE">PAGE</option>
            <option value="WHATSAPP">WHATSAPP</option>
            <option value="FILTER">FILTER</option>
          </select>
          <input style={input()} placeholder="target_value (ex: /fr/promo)" value={form.target_value} onChange={e=>setForm({...form, target_value:e.target.value})} />
        </div>
        <button style={btnOrange()} onClick={uploadAndAdd} disabled={!file}>Uploader + Ajouter</button>
      </div>

      <div style={{marginTop:14, color:"#64748b"}}>Bannières</div>
      <div style={{display:"grid", gap:10, marginTop:10}}>
        {rows.map(r => (
          <div key={r.id} style={{border:"1px solid #e2e8f0", borderRadius:14, padding:12, background:"#fff", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
            <div>
              <div style={{fontWeight:900}}>{r.title_fr || "(sans titre)"} · ordre {r.sort_order}</div>
              <div style={{color:"#64748b"}}>{r.target_type}:{r.target_value} · {r.active ? "✅":"⛔"}</div>
              <div style={{color:"#64748b"}}>{r.image_path_desktop}</div>
            </div>
            <button onClick={()=>del(r.id)} style={btnGhost()}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsAdmin(){
  const sb = useSB();
  const [rows, setRows] = useState<any[]>([]);

  async function refresh(){
    const { data } = await sb.from("leads").select("*").order("created_at",{ascending:false}).limit(100);
    setRows(data ?? []);
  }
  useEffect(()=>{ refresh(); },[]);

  return (
    <div style={card()}>
      <h2 style={{marginTop:0}}>Demandes (leads)</h2>
      <button onClick={refresh} style={btnGhost()}>Rafraîchir</button>
      <div style={{display:"grid", gap:10, marginTop:10}}>
        {rows.map(r => (
          <div key={r.id} style={{border:"1px solid #e2e8f0", borderRadius:14, padding:12, background:"#fff"}}>
            <div style={{fontWeight:900}}>{r.type} · {r.lang} · {new Date(r.created_at).toLocaleString()}</div>
            <pre style={{whiteSpace:"pre-wrap", margin:0, color:"#334155"}}>{JSON.stringify(r.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
