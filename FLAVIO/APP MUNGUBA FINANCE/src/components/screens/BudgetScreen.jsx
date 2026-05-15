import { useApp } from '../../context/AppContext'
import { fmt, BUDGET_LIMITS, getCat } from '../../data/constants'

export default function BudgetScreen() {
  const { state } = useApp()
  const bycat = {}
  state.transactions.filter(t => t.type !== 'income').forEach(t => { bycat[t.cat] = (bycat[t.cat]||0) + t.val })

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  const items = Object.keys(BUDGET_LIMITS).map(cat => ({
    cat, spent: bycat[cat]||0, limit: BUDGET_LIMITS[cat],
    pct: Math.min(100, Math.round(((bycat[cat]||0) / BUDGET_LIMITS[cat]) * 100))
  })).sort((a,b) => b.pct - a.pct)

  const getColor = pct => pct >= 90 ? '#D63333' : pct >= 70 ? '#D97706' : '#0A8A52'

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Categorias no limite', val: items.filter(i=>i.pct>=90).length, col:'#D63333', bg:'#FEF2F2' },
          { label:'Dentro do orçamento', val: items.filter(i=>i.pct<70).length, col:'#076B3E', bg:'#DCFCE7' },
          { label:'Total orçado', val: fmt(Object.values(BUDGET_LIMITS).reduce((a,v)=>a+v,0)), col:'#1D6FA4', bg:'#EFF6FF' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding:'16px 18px', background:s.bg, border:'none' }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.col }}>{s.val}</div>
            <div style={{ fontSize:11, color:s.col, opacity:.8, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:18 }}>Orçamentos por categoria</div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {items.map(({ cat, spent, limit, pct }) => {
            const c = getCat(cat)
            const col = getColor(pct)
            return (
              <div key={cat}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>{c.e}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{cat}</span>
                    {pct >= 90 && <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10, background:'#FEF2F2', color:'#D63333' }}>⚠ LIMITE</span>}
                    {pct >= 70 && pct < 90 && <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10, background:'#FFF7ED', color:'#D97706' }}>ATENÇÃO</span>}
                  </div>
                  <div style={{ fontSize:12, color:'#6B8878' }}>
                    <span style={{ fontWeight:700, color:col }}>{fmt(spent)}</span> / {fmt(limit)}
                  </div>
                </div>
                <div style={{ height:8, background:'#E8F5EE', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:4, transition:'width .5s ease' }}/>
                </div>
                <div style={{ fontSize:10, color:'#6B8878', marginTop:4, textAlign:'right' }}>{pct}% usado · Resta {fmt(Math.max(0, limit-spent))}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
