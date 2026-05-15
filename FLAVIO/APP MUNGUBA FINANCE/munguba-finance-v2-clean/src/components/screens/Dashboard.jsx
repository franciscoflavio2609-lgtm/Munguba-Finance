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
  const totInv = state.investments.reduce((a,i)=>a+i.val,0)
  const ins = INSIGHTS[insIdx % INSIGHTS.length]

  const bycat = {}
  state.transactions.filter(t=>t.type!=='income').forEach(t=>{bycat[t.cat]=(bycat[t.cat]||0)+t.val})
  const catLabels = Object.keys(bycat)
  const catVals = Object.values(bycat)
  const pal = ['#0A8A52','#D63333','#D97706','#1D6FA4','#B45309','#7C3AED','#EC4899','#14B8A6']

  const flowData = {
    labels:['Jan','Fev','Mar','Abr 2026'],
    datasets:[
      {label:'Receita',data:[4200,5100,5500,inc],backgroundColor:'#0A8A52',borderRadius:8,borderSkipped:false},
      {label:'Despesa',data:[3100,3800,3200,exp],backgroundColor:'#D63333',borderRadius:8,borderSkipped:false}
    ]
  }

  const catData = {
    labels: catLabels,
    datasets:[{data:catVals,backgroundColor:pal.slice(0,catLabels.length),borderWidth:0,hoverOffset:8}]
  }

  const chartOpts = {
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{position:'top',labels:{font:{size:11,family:'Outfit,sans-serif'},boxWidth:12,padding:12}}},
    scales:{x:{grid:{display:false},ticks:{font:{size:11}}},y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v),font:{size:10}},border:{display:false}}}
  }

  const donutOpts = {
    responsive:true,maintainAspectRatio:false,cutout:'68%',
    plugins:{legend:{position:'bottom',labels:{font:{size:10,family:'Outfit,sans-serif'},boxWidth:10,padding:8}}}
  }

  const card = {background:'#fff',borderRadius:24,padding:22,boxShadow:'0 1px 4px rgba(4,77,44,.08)',border:'1px solid rgba(10,138,82,.12)'}

  const stats = [
    {icon:'↑',bg:'#DCFCE7',ic:'#076B3E',label:'Receita do Mês',val:fmt(inc),sub:'▲ Entradas',sc:'#076B3E'},
    {icon:'↓',bg:'#FEF2F2',ic:'#D63333',label:'Despesas',val:fmt(exp),sub:'▼ Saídas',sc:'#D63333'},
    {icon:'₩',bg:'#EFF6FF',ic:'#1D6FA4',label:'Saldo Líquido',val:fmt(bal),sub:'Disponível',sc:bal>=0?'#076B3E':'#D63333'},
    {icon:'↗',bg:'#FFFBEB',ic:'#B45309',label:'Patrimônio Invest.',val:fmt(totInv),sub:`Poupança: ${sav}%`,sc:'#B45309'},
  ]

  const recent = [...state.transactions].reverse().slice(0,5)

  return (
    <div style={{animation:'vIn .26s ease'}}>
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {stats.map((st,i)=>(
          <div key={i} style={{...card,padding:'18px 20px',cursor:'default',transition:'transform .18s,box-shadow .18s'}}
          onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
          onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{width:36,height:36,borderRadius:10,background:st.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,fontSize:18,color:st.ic}}>{st.icon}</div>
            <div style={{fontSize:10,color:'#6B8878',fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:5}}>{st.label}</div>
            <div style={{fontSize:21,fontWeight:800,letterSpacing:'-.02em',color:st.sc}}>{st.val}</div>
            <div style={{fontSize:11,color:st.sc,marginTop:6,fontWeight:500}}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Insight hero */}
      <div style={{background:'linear-gradient(130deg,#022818 0%,#076B3E 50%,#0A8A52 100%)',borderRadius:24,padding:'22px 26px',color:'#fff',position:'relative',overflow:'hidden',marginBottom:20}}>
        <div style={{position:'absolute',top:-40,right:-30,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,.05)'}}/>
        <div style={{fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.16em',color:'rgba(255,255,255,.55)',marginBottom:8}}>💡 Insight do Dia</div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:18,fontStyle:'italic',lineHeight:1.45,position:'relative',zIndex:1}}>{ins.m}</div>
        <div style={{fontSize:12,opacity:.72,marginTop:7,lineHeight:1.6,position:'relative',zIndex:1}}>{ins.s}</div>
        <div style={{display:'flex',gap:8,marginTop:14,position:'relative',zIndex:1}}>
          <button onClick={()=>setInsIdx(insIdx+1)} style={{background:'rgba(255,255,255,.16)',border:'1px solid rgba(255,255,255,.24)',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'Outfit,sans-serif'}}>Próxima dica ↻</button>
          <button onClick={()=>onNav('ecomp')} style={{background:'rgba(255,255,255,.16)',border:'1px solid rgba(255,255,255,.24)',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'Outfit,sans-serif'}}>Psicologia Financeira →</button>
        </div>
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1.35fr 1fr',gap:16,marginBottom:20}}>
        <div style={card}><div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:16}}>Fluxo Mensal</div><div style={{position:'relative',height:200}}><Bar data={flowData} options={chartOpts}/></div></div>
        <div style={card}><div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:16}}>Por Categoria</div><div style={{position:'relative',height:200}}>{catLabels.length>0?<Doughnut data={catData} options={donutOpts}/>:<div style={{textAlign:'center',padding:40,color:'#6B8878',fontSize:13}}>Sem despesas ainda</div>}</div></div>
      </div>

      {/* Recent transactions */}
      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878'}}>Últimas Transações</div>
          <button onClick={()=>onNav('txn')} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 11px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',background:'#fff',border:'1.5px solid rgba(0,0,0,.11)',color:'#0D1F17',fontFamily:'Outfit,sans-serif'}}>Ver todas →</button>
        </div>
        {recent.length===0 ? (
          <div style={{textAlign:'center',padding:'28px',color:'#6B8878',fontSize:13}}>Sem transações ainda.</div>
        ) : recent.map(t=>{
          const c=getCat(t.cat)
          const bg=t.type==='income'?'#DCFCE7':t.type==='fixed'?'#FEF2F2':'#FFF7ED'
          return(
            <div key={t.id} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:14,borderBottom:'1px solid #F0F4F1',transition:'background .16s'}}
            onMouseOver={e=>e.currentTarget.style.background='#d8eee2'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{width:38,height:38,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{c.e}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#0D1F17',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.desc}</div>
                <div style={{fontSize:11,color:'#6B8878',display:'flex',alignItems:'center',gap:5,marginTop:2}}>
                  <span>{t.date}</span>
                  <span style={{display:'inline-block',padding:'2px 8px',borderRadius:20,fontSize:8.5,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',background:t.type==='income'?'#E8F5EE':t.type==='fixed'?'#FEF0F0':'#FFF7ED',color:t.type==='income'?'#044D2C':t.type==='fixed'?'#D63333':'#D97706'}}>{t.type==='income'?'Receita':t.type==='fixed'?'Fixo':'Variável'}</span>
                  <span>{t.cat}</span>
                </div>
              </div>
              <div style={{fontSize:14,fontWeight:800,color:t.type==='income'?'#076B3E':'#D63333'}}>{t.type==='income'?'+':'-'}{fmt(t.val)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
