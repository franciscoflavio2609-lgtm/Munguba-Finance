import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, getCat } from '../../data/constants'

export default function TransactionsScreen() {
  const { state } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = [...state.transactions]
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()))
    .reverse()

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }
  const typeBg = { income:'#DCFCE7', fixed:'#FEF2F2', variable:'#FFF7ED' }
  const typeCol = { income:'#044D2C', fixed:'#D63333', variable:'#D97706' }
  const typeLabel = { income:'Receita', fixed:'Fixo', variable:'Variável' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={card}>
        <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por descrição ou categoria..."
            style={{ flex:1, minWidth:180, border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'10px 14px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', background:'#F0F9F4', color:'#0D1F17' }}
          />
          <div style={{ display:'flex', gap:6 }}>
            {[['all','Todas'],['income','Receitas'],['fixed','Fixas'],['variable','Variáveis']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding:'8px 14px', borderRadius:10, border:'1.5px solid',
                borderColor: filter===v ? '#076B3E' : 'rgba(0,0,0,.1)',
                background: filter===v ? '#076B3E' : '#fff',
                color: filter===v ? '#fff' : '#2E4A3A',
                fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'
              }}>{l}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#6B8878', fontSize:13 }}>Nenhuma transação encontrada.</div>
        ) : filtered.map(t => {
          const c = getCat(t.cat)
          return (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14, borderBottom:'1px solid #F0F4F1', transition:'background .16s', cursor:'default' }}
              onMouseOver={e => e.currentTarget.style.background='#E8F5EE'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:typeBg[t.type]||'#E8F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{c.e}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.desc}</div>
                <div style={{ fontSize:11, color:'#6B8878', display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                  <span>{t.date}</span>
                  <span style={{ padding:'2px 8px', borderRadius:20, fontSize:8.5, fontWeight:700, textTransform:'uppercase', background:typeBg[t.type], color:typeCol[t.type] }}>{typeLabel[t.type]}</span>
                  <span>{t.cat}</span>
                </div>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:t.type==='income'?'#076B3E':'#D63333', flexShrink:0 }}>
                {t.type==='income'?'+':'-'}{fmt(t.val)}
              </div>
            </div>
          )
        })}

        <div style={{ marginTop:14, padding:'10px 14px', background:'#E8F5EE', borderRadius:14, display:'flex', justifyContent:'space-between', fontSize:12, color:'#076B3E', fontWeight:600 }}>
          <span>{filtered.length} transação(ões)</span>
          <span>Total: {fmt(filtered.reduce((a,t) => t.type==='income' ? a+t.val : a-t.val, 0))}</span>
        </div>
      </div>
    </div>
  )
}
