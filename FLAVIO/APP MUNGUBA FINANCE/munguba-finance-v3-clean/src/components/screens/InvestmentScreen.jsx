import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, RF_INVESTMENTS, RV_INVESTMENTS } from '../../data/constants'

export default function InvestmentScreen() {
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState('portfolio')
  const [form, setForm] = useState({ tp:'', nm:'', val:'', rt:'', date: new Date().toISOString().split('T')[0] })

  const totInv = state.investments.reduce((a,i) => a+i.val, 0)
  const estAnual = state.investments.reduce((a,i) => a + (i.val * (i.rt/100)), 0)

  const save = () => {
    if (!form.val || !form.nm || !form.tp) return alert('Preencha todos os campos.')
    dispatch({ type:'ADD_INVESTMENT', payload:{ ...form, val:parseFloat(form.val), rt:parseFloat(form.rt||0), id:Date.now() } })
    setForm({ tp:'', nm:'', val:'', rt:'', date: new Date().toISOString().split('T')[0] })
    setTab('portfolio')
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }
  const riskCol = { low:'#076B3E', med:'#D97706', high:'#D63333' }
  const riskBg = { low:'#DCFCE7', med:'#FFF7ED', high:'#FEF2F2' }
  const riskLabel = { low:'Baixo', med:'Médio', high:'Alto' }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Outfit,sans-serif', background:'#F0F9F4', color:'#0D1F17', outline:'none' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Patrimônio total', val:fmt(totInv), col:'#1D6FA4', bg:'#EFF6FF' },
          { label:'Estimativa anual', val:fmt(estAnual), col:'#076B3E', bg:'#DCFCE7' },
          { label:'Posições', val:state.investments.length, col:'#7C3AED', bg:'#F5F3FF' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding:'16px 18px', background:s.bg, border:'none' }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.col }}>{s.val}</div>
            <div style={{ fontSize:11, color:s.col, opacity:.8, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {[['portfolio','Minha Carteira'],['rf','Renda Fixa'],['rv','Renda Variável'],['add','+ Adicionar']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding:'9px 16px', borderRadius:12, border:'1.5px solid',
            borderColor: tab===v ? '#076B3E' : 'rgba(0,0,0,.1)',
            background: tab===v ? '#076B3E' : '#fff',
            color: tab===v ? '#fff' : '#2E4A3A',
            fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'
          }}>{l}</button>
        ))}
      </div>

      {/* Portfolio */}
      {tab === 'portfolio' && (
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Posições ativas</div>
          {state.investments.map((inv,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #F0F4F1' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>📊</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{inv.nm}</div>
                <div style={{ fontSize:11, color:'#6B8878', marginTop:2 }}>{inv.tp} · Desde {inv.date}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#1D6FA4' }}>{fmt(inv.val)}</div>
                {inv.rt > 0 && <div style={{ fontSize:11, color:'#076B3E', fontWeight:600 }}>{inv.rt}% a.a.</div>}
              </div>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'12px 16px', background:'#EFF6FF', borderRadius:14, display:'flex', justifyContent:'space-between', fontSize:13, color:'#1D6FA4', fontWeight:700 }}>
            <span>Total investido</span><span>{fmt(totInv)}</span>
          </div>
        </div>
      )}

      {/* RF */}
      {tab === 'rf' && (
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Renda Fixa — Recomendações</div>
          {RF_INVESTMENTS.map((inv,i) => (
            <div key={i} style={{ padding:'14px', borderRadius:14, border:'1px solid rgba(10,138,82,.12)', marginBottom:10, background:'#F8FDF9' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0D1F17' }}>{inv.name}</div>
                <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:10, background:riskBg[inv.risk], color:riskCol[inv.risk] }}>Risco {riskLabel[inv.risk]}</span>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:'#076B3E', marginBottom:4 }}>{inv.rate}</div>
              <div style={{ fontSize:11, color:'#6B8878' }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      )}

      {/* RV */}
      {tab === 'rv' && (
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Renda Variável — Radar</div>
          {RV_INVESTMENTS.map((inv,i) => (
            <div key={i} style={{ padding:'14px', borderRadius:14, border:'1px solid rgba(10,138,82,.12)', marginBottom:10, background:'#F8FDF9' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0D1F17' }}>{inv.name}</div>
                <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:10, background:riskBg[inv.risk], color:riskCol[inv.risk] }}>Risco {riskLabel[inv.risk]}</span>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:'#1D6FA4', marginBottom:4 }}>{inv.rate}</div>
              <div style={{ fontSize:11, color:'#6B8878' }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add */}
      {tab === 'add' && (
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:700, color:'#0D1F17', marginBottom:18 }}>Registrar novo investimento</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:5 }}>Tipo</label>
                <select value={form.tp} onChange={e => setForm(f=>({...f,tp:e.target.value}))} style={inputStyle}>
                  <option value="">Selecione...</option>
                  {['Tesouro Direto','CDB','LCI/LCA','FIIs','ETFs','Ações','Criptomoedas','Outros'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:5 }}>Data</label>
                <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={inputStyle}/>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:5 }}>Nome do investimento</label>
              <input placeholder="Ex: Tesouro Selic 2029, HGLG11..." value={form.nm} onChange={e => setForm(f=>({...f,nm:e.target.value}))} style={inputStyle}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:5 }}>Valor (R$)</label>
                <input type="number" placeholder="0,00" value={form.val} onChange={e => setForm(f=>({...f,val:e.target.value}))} style={inputStyle}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:5 }}>Taxa anual (%)</label>
                <input type="number" placeholder="0,00" value={form.rt} onChange={e => setForm(f=>({...f,rt:e.target.value}))} style={inputStyle}/>
              </div>
            </div>
            <button onClick={save} style={{ padding:14, borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:14, fontWeight:700, cursor:'pointer' }}>✓ Registrar Investimento</button>
          </div>
        </div>
      )}
    </div>
  )
}
