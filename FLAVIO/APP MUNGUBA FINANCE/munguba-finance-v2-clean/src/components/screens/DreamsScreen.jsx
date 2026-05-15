import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, DREAM_ICONS, BANNERS } from '../../data/constants'

export default function DreamsScreen() {
  const { state, dispatch } = useApp()
  const [adding, setAdding] = useState(false)
  const [depositing, setDepositing] = useState(null)
  const [depAmt, setDepAmt] = useState('')
  const [form, setForm] = useState({ name:'', icon:'✈️', target:'', why:'', banner:'bn-green' })

  const bannerBg = { 'bn-green':'linear-gradient(135deg,#022818,#076B3E)', 'bn-blue':'linear-gradient(135deg,#0C447C,#1D6FA4)', 'bn-gold':'linear-gradient(135deg,#633806,#D97706)', 'bn-rose':'linear-gradient(135deg,#7C1D4A,#D63395)', 'bn-deep':'linear-gradient(135deg,#1E1B4B,#4338CA)', 'bn-sunset':'linear-gradient(135deg,#7C2D12,#EA580C)' }

  const save = () => {
    if (!form.name || !form.target) return alert('Preencha nome e valor alvo.')
    dispatch({ type:'ADD_DREAM', payload:{ id:Date.now(), ...form, target:parseFloat(form.target), current:0 } })
    setForm({ name:'', icon:'✈️', target:'', why:'', banner:'bn-green' })
    setAdding(false)
  }

  const deposit = (idx) => {
    const amt = parseFloat(depAmt)
    if (!amt || amt <= 0) return alert('Informe um valor válido.')
    dispatch({ type:'DEPOSIT_DREAM', idx, amount:amt })
    setDepositing(null)
    setDepAmt('')
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button onClick={() => setAdding(!adding)} style={{ padding:'10px 20px', borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {adding ? '✕ Cancelar' : '+ Novo Sonho'}
        </button>
      </div>

      {adding && (
        <div style={{ ...card, marginBottom:18, border:'1.5px solid rgba(10,138,82,.3)' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#0D1F17', marginBottom:14 }}>🌟 Defina seu sonho</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            {DREAM_ICONS.map(ic => (
              <button key={ic} onClick={() => setForm(f=>({...f,icon:ic}))} style={{ width:36, height:36, borderRadius:10, border:`2px solid ${form.icon===ic?'#076B3E':'rgba(0,0,0,.1)'}`, background:form.icon===ic?'#E8F5EE':'#fff', fontSize:18, cursor:'pointer' }}>{ic}</button>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <input placeholder="Nome do sonho (ex: Viagem para Europa)" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{ border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Outfit,sans-serif', background:'#F0F9F4', color:'#0D1F17', outline:'none' }}/>
            <input type="number" placeholder="Valor alvo (R$)" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} style={{ border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Outfit,sans-serif', background:'#F0F9F4', color:'#0D1F17', outline:'none' }}/>
            <input placeholder="Por que esse sonho é importante para mim?" value={form.why} onChange={e=>setForm(f=>({...f,why:e.target.value}))} style={{ border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Outfit,sans-serif', background:'#F0F9F4', color:'#0D1F17', outline:'none' }}/>
            <div>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:6 }}>Cor do cartão</div>
              <div style={{ display:'flex', gap:8 }}>
                {Object.entries(bannerBg).map(([k,v]) => (
                  <button key={k} onClick={()=>setForm(f=>({...f,banner:k}))} style={{ width:28, height:28, borderRadius:8, background:v.split(',').pop().trim().replace(')',''), border:`3px solid ${form.banner===k?'#0D1F17':'transparent'}`, cursor:'pointer' }}/>
                ))}
              </div>
            </div>
            <button onClick={save} style={{ padding:13, borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:14, fontWeight:700, cursor:'pointer' }}>✓ Criar Sonho</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {state.dreams.map((d, idx) => {
          const pct = Math.min(100, Math.round((d.current/d.target)*100))
          return (
            <div key={d.id} style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 2px 8px rgba(4,77,44,.12)' }}>
              <div style={{ background:bannerBg[d.banner]||bannerBg['bn-green'], padding:'20px 20px 24px', position:'relative' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{d.icon}</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-.01em' }}>{d.name}</div>
                {d.why && <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:4, lineHeight:1.4 }}>{d.why}</div>}
              </div>
              <div style={{ background:'#fff', padding:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                  <span style={{ fontWeight:800, color:'#076B3E' }}>{fmt(d.current)}</span>
                  <span style={{ color:'#6B8878' }}>de {fmt(d.target)}</span>
                </div>
                <div style={{ height:8, background:'#E8F5EE', borderRadius:4, marginBottom:6 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct>=100?'#B45309':'#0A8A52', borderRadius:4, transition:'width .5s ease' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:11, color:'#6B8878' }}>{pct}% concluído</span>
                  {pct >= 100 && <span style={{ fontSize:10, fontWeight:700, color:'#B45309', padding:'2px 8px', background:'#FFFBEB', borderRadius:10 }}>🏆 META ATINGIDA!</span>}
                </div>

                {depositing === idx ? (
                  <div style={{ display:'flex', gap:8, marginTop:12 }}>
                    <input type="number" placeholder="Valor (R$)" value={depAmt} onChange={e=>setDepAmt(e.target.value)} style={{ flex:1, border:'1.5px solid rgba(10,138,82,.25)', borderRadius:10, padding:'9px 12px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', background:'#F0F9F4' }}/>
                    <button onClick={()=>deposit(idx)} style={{ padding:'9px 14px', borderRadius:10, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer' }}>✓</button>
                    <button onClick={()=>{setDepositing(null);setDepAmt('')}} style={{ padding:'9px 12px', borderRadius:10, border:'1px solid rgba(0,0,0,.1)', background:'#fff', color:'#0D1F17', fontFamily:'Outfit,sans-serif', fontSize:12, cursor:'pointer' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={()=>setDepositing(idx)} style={{ width:'100%', marginTop:12, padding:10, borderRadius:12, border:'1.5px solid rgba(10,138,82,.3)', background:'#E8F5EE', color:'#076B3E', fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    + Depositar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {state.dreams.length === 0 && !adding && (
        <div style={{ ...card, textAlign:'center', padding:48, color:'#6B8878' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🌟</div>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Nenhum sonho ainda</div>
          <div style={{ fontSize:12 }}>Crie seu primeiro objetivo financeiro!</div>
        </div>
      )}
    </div>
  )
}
