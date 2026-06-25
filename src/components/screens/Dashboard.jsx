import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, getCat, INSIGHTS } from '../../data/constants'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard({ onNav }) {
  const { state, calcStats } = useApp()
  const [insIdx, setInsIdx] = useState(0)
  const { inc, exp, bal, sav } = calcStats()
  const totInv = state.investments.reduce((a,i) => a + Number(i.val||0), 0)
  const ins = INSIGHTS[insIdx % INSIGHTS.length]

  // Only real data from user transactions
  const bycat = {}
  state.transactions.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat]||0) + Number(t.val||0)
  })
  const catLabels = Object.keys(bycat)
  const catVals = Object.values(bycat)
  const pal = ['#0A8A52','#D63333','#D97706','#1D6FA4','#B45309','#7C3AED','#EC4899','#14B8A6']
  const hasData = state.transactions.length > 0

  const flowData = {
    labels: hasData ? ['Receitas','Despesas'] : ['Sem dados'],
    datasets: [{
      label: 'Este mês',
      data: hasData ? [inc, exp] : [0],
      backgroundColor: hasData ? ['#0A8A52','#D63333'] : ['#E0E0E0'],
      borderRadius: 10,
      borderSkipped: false
    }]
  }

  const catData = {
    labels: catLabels.length > 0 ? catLabels : ['Sem despesas'],
    datasets: [{ data: catVals.length > 0 ? catVals : [1], backgroundColor: catVals.length > 0 ? pal.slice(0, catLabels.length) : ['#E0E0E0'], borderWidth:0, hoverOffset:8 }]
  }

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position:'top', labels: { font:{ size:11, family:'Outfit,sans-serif' }, boxWidth:12, padding:12 } } },
    scales: {
      x: { grid:{ display:false }, ticks:{ font:{ size:11 } } },
      y: { grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ callback: v => 'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{ size:10 } }, border:{ display:false } }
    }
  }
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout:'68%',
    plugins: { legend: { position:'bottom', labels:{ font:{ size:10, family:'Outfit,sans-serif' }, boxWidth:10, padding:8 } } }
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  const stats = [
    { icon:'↑', bg:'#DCFCE7', ic:'#076B3E', label:'Receita do Mês', val: hasData ? fmt(inc) : 'R$ 0,00', sub:'▲ Entradas', sc:'#076B3E' },
    { icon:'↓', bg:'#FEF2F2', ic:'#D63333', label:'Despesas',      val: hasData ? fmt(exp) : 'R$ 0,00', sub:'▼ Saídas',  sc:'#D63333' },
    { icon:'₩', bg:'#EFF6FF', ic:'#1D6FA4', label:'Saldo Líquido', val: hasData ? fmt(bal) : 'R$ 0,00', sub:'Disponível', sc: bal>=0?'#076B3E':'#D63333' },
    { icon:'↗', bg:'#FFFBEB', ic:'#B45309', label:'Patrimônio Inv.',val: totInv>0 ? fmt(totInv) : 'R$ 0,00', sub:`Poupança: ${sav}%`, sc:'#B45309' },
  ]

  const recent = [...state.transactions].reverse().slice(0,5)

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:18 }}>
        {stats.map((st,i) => (
          <div key={i} style={{ ...card, padding:'16px 18px' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:st.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, fontSize:16, color:st.ic }}>{st.icon}</div>
            <div style={{ fontSize:9.5, color:'#6B8878', fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>{st.label}</div>
            <div style={{ fontSize:18, fontWeight:800, letterSpacing:'-.02em', color:st.sc }}>{st.val}</div>
            <div style={{ fontSize:11, color:st.sc, marginTop:4, fontWeight:500 }}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div style={{ background:'linear-gradient(130deg,#022818 0%,#076B3E 50%,#0A8A52 100%)', borderRadius:24, padding:'20px 22px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:18 }}>
        <div style={{ position:'absolute', top:-40, right:-30, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
        <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:6 }}>💡 Insight do Dia</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontStyle:'italic', lineHeight:1.45, position:'relative', zIndex:1 }}>{ins.m}</div>
        <div style={{ fontSize:12, opacity:.72, marginTop:6, lineHeight:1.6, position:'relative', zIndex:1 }}>{ins.s}</div>
        <div style={{ display:'flex', gap:8, marginTop:12, position:'relative', zIndex:1, flexWrap:'wrap' }}>
          <button onClick={() => setInsIdx(insIdx+1)} style={{ background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.24)', color:'#fff', padding:'7px 12px', borderRadius:10, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'Outfit,sans-serif' }}>Próxima dica ↻</button>
          <button onClick={() => onNav('edu')} style={{ background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.24)', color:'#fff', padding:'7px 12px', borderRadius:10, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'Outfit,sans-serif' }}>Educação →</button>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Fluxo Mensal</div>
          <div style={{ position:'relative', height:160 }}>
            {!hasData
              ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#A8BDB5', fontSize:12, gap:6 }}>
                  <span style={{ fontSize:24 }}>📊</span>
                  <span>Adicione transações</span>
                </div>
              : <Bar data={flowData} options={chartOpts}/>
            }
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Por Categoria</div>
          <div style={{ position:'relative', height:160 }}>
            {catLabels.length === 0
              ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#A8BDB5', fontSize:12, gap:6 }}>
                  <span style={{ fontSize:24 }}>🥧</span>
                  <span>Sem despesas</span>
                </div>
              : <Doughnut data={catData} options={donutOpts}/>
            }
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878' }}>Últimas Transações</div>
          <button onClick={() => onNav('txn')} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 11px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', background:'#fff', border:'1.5px solid rgba(0,0,0,.11)', color:'#0D1F17', fontFamily:'Outfit,sans-serif' }}>Ver todas →</button>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'28px', color:'#A8BDB5' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🌱</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#6B8878', marginBottom:4 }}>Nenhuma transação ainda</div>
            <div style={{ fontSize:12, color:'#A8BDB5' }}>Clique em + para registrar sua primeira transação</div>
          </div>
        ) : recent.map(t => {
          const c = getCat(t.cat)
          const bg = t.type==='income'?'#DCFCE7':t.type==='fixed'?'#FEF2F2':'#FFF7ED'
          return (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F0F4F1' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{c.e}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.desc || t.descricao}</div>
                <div style={{ fontSize:11, color:'#6B8878', marginTop:2 }}>{t.date} · {t.cat}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:t.type==='income'?'#076B3E':'#D63333', flexShrink:0 }}>
                {t.type==='income'?'+':'-'}{fmt(t.val)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
