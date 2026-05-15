import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, REPORT_ANALYSES } from '../../data/constants'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const PERIODS = ['Jan 2026','Fev 2026','Mar 2026','Abr 2026','1T 2026','2T 2026','Anual 2026']
const PERIOD_KEYS = ['Janeiro 2026','Fevereiro 2026','Março 2026','Abril 2026','1º Trimestre 2026','2º Trimestre 2026','Anual 2026']

const PIE_COLORS = ['#044D2C','#0A8A52','#D97706','#1D6FA4','#7C3AED','#D63333']

export default function ReportPanel({ onClose }) {
  const { state, calcStats } = useApp()
  const [period, setPeriod] = useState(0)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  const { inc, exp, bal, sav } = calcStats()
  const totInv = state.investments.reduce((a,i)=>a+i.val,0)

  const bycat = {}
  state.transactions.filter(t=>t.type!=='income').forEach(t=>{bycat[t.cat]=(bycat[t.cat]||0)+t.val})
  const catTotal = Object.values(bycat).reduce((a,v)=>a+v,0)||1
  const topCats = Object.entries(bycat).sort((a,b)=>b[1]-a[1]).slice(0,4)

  const generate = () => {
    setAnalysis('')
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      setAnalysis(REPORT_ANALYSES[PERIOD_KEYS[period]] || 'Análise gerada com base nos dados do período.')
    }, 2400)
  }

  const chartData = {
    labels:['Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26'],
    datasets:[
      {label:'Receitas',data:[3800,4200,4600,5100,4900,5500,inc],borderColor:'#0A8A52',backgroundColor:'rgba(10,138,82,.08)',fill:true,tension:.4,borderWidth:2.5,pointBackgroundColor:'#0A8A52',pointRadius:4},
      {label:'Despesas',data:[2800,3100,3300,2900,3400,3200,exp],borderColor:'#D63333',backgroundColor:'rgba(214,51,51,.06)',fill:true,tension:.4,borderWidth:2.5,pointBackgroundColor:'#D63333',pointRadius:4}
    ]
  }
  const chartOptions = {
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{position:'top',labels:{font:{size:11,family:'Outfit,sans-serif'},boxWidth:12,padding:12}}},
    scales:{
      x:{grid:{display:false},ticks:{font:{size:11}}},
      y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v),font:{size:10}},border:{display:false}}
    }
  }

  const card = {background:'#fff',borderRadius:18,padding:'18px 20px',boxShadow:'0 1px 4px rgba(4,77,44,.08)',border:'1px solid rgba(10,138,82,.12)'}

  return (
    <div style={{position:'fixed',inset:0,zIndex:500,background:'#E6F2EC',display:'flex',flexDirection:'column',animation:'vIn .3s ease'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#022818,#076B3E)',padding:'52px 32px 24px',color:'#fff',flexShrink:0}}>
        <button onClick={onClose} style={{
          display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.14)',
          border:'none',color:'#fff',fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:700,
          padding:'8px 16px',borderRadius:10,cursor:'pointer',marginBottom:18
        }}>← Voltar ao App</button>
        <div style={{fontFamily:'Outfit,sans-serif',fontSize:24,fontWeight:900,letterSpacing:'-.02em',marginBottom:4}}>Central de Relatórios</div>
        <div style={{fontSize:13,opacity:.65}}>Período: {PERIOD_KEYS[period]}</div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:'auto',padding:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignContent:'start'}}>
        {/* Period chips */}
        <div style={{gridColumn:'1/-1',display:'flex',gap:8,overflowX:'auto',paddingBottom:4}}>
          {PERIODS.map((p,i)=>(
            <button key={i} onClick={()=>{setPeriod(i);setAnalysis('')}} style={{
              flexShrink:0,padding:'8px 18px',borderRadius:30,
              border:`1.5px solid ${i===period?'#044D2C':'rgba(10,138,82,.2)'}`,
              background:i===period?'#044D2C':'#fff',
              color:i===period?'#fff':'#2E4A3A',
              fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif',
              transition:'all .18s'
            }}>{p}</button>
          ))}
        </div>

        {/* Generate button */}
        <button onClick={generate} style={{
          gridColumn:'1/-1',background:'linear-gradient(135deg,#022818,#076B3E)',color:'#fff',
          border:'none',borderRadius:14,padding:15,fontFamily:'Outfit,sans-serif',
          fontSize:14,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 20px rgba(4,77,44,.2)'
        }}>
          ✨ &nbsp; Gerar análise inteligente para {PERIOD_KEYS[period]}
        </button>

        {/* Loading */}
        {loading && (
          <div style={{gridColumn:'1/-1',display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#076B3E'}}>
            <div style={{width:16,height:16,border:'2px solid #C0E8D2',borderTopColor:'#076B3E',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
            Analisando seus dados financeiros...
          </div>
        )}

        {/* AI Analysis box */}
        {analysis && (
          <div style={{
            gridColumn:'1/-1',background:'linear-gradient(130deg,#EBF7EF,#D4EDDA)',
            border:'1.5px solid rgba(10,138,82,.25)',borderRadius:18,padding:20
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#0A8A52',animation:'pulse 2s infinite'}}/>
              <span style={{fontSize:12,fontWeight:700,color:'#044D2C',textTransform:'uppercase',letterSpacing:'.1em'}}>Análise IA</span>
              <span style={{fontSize:11,color:'#6B8878'}}>· {PERIOD_KEYS[period]}</span>
            </div>
            <p style={{fontSize:13,color:'#2E4A3A',lineHeight:1.7}}>{analysis}</p>
          </div>
        )}

        {/* Summary */}
        <div style={card}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:16}}>Resumo Financeiro</div>
          {[
            ['Receita total', fmt(inc), '#076B3E'],
            ['Despesas totais', fmt(exp), '#D63333'],
            ['Saldo líquido', fmt(bal), bal>=0?'#076B3E':'#D63333'],
            ['Taxa de poupança', sav+'%', '#0D1F17'],
            ['Total investido', fmt(totInv), '#076B3E'],
          ].map(([lbl,val,col])=>(
            <div key={lbl} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(0,0,0,.05)'}}>
              <span style={{fontSize:12,color:'#6B8878'}}>{lbl}</span>
              <span style={{fontSize:13,fontWeight:800,color:col}}>{val}</span>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div style={card}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:16}}>Despesas por Categoria</div>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="34" fill="none" stroke="#E8F5EE" strokeWidth="20"/>
              {topCats.map(([cat,val],i)=>{
                const pct = Math.round((val/catTotal)*100)
                const total142 = 214
                const dashArr = (pct/100)*total142
                const offset = topCats.slice(0,i).reduce((a,[,v])=>a+(v/catTotal)*total142,0)
                return <circle key={cat} cx="45" cy="45" r="34" fill="none" stroke={PIE_COLORS[i]} strokeWidth="20"
                  strokeDasharray={`${dashArr} ${total142}`} strokeDashoffset={-offset} transform="rotate(-90 45 45)"/>
              })}
              <circle cx="45" cy="45" r="22" fill="#fff"/>
              <text x="45" y="49" textAnchor="middle" fontSize="9" fontWeight="800" fill="#044D2C" fontFamily="Outfit">Gastos</text>
            </svg>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
              {topCats.map(([cat,val],i)=>(
                <div key={cat} style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#2E4A3A'}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:PIE_COLORS[i],flexShrink:0}}/>
                  <span style={{flex:1}}>{cat}</span>
                  <span style={{fontWeight:800,color:'#0D1F17'}}>{Math.round((val/catTotal)*100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div style={{gridColumn:'1/-1'}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:12}}>Insights do Período</div>
          {[
            {icon:'💡',label:'Oportunidade',txt:`Taxa de poupança de ${sav}%. ${sav>=30?'Excelente — acima da meta de 30%!':'Meta é 30% — revise despesas variáveis.'}`,col:'#0A8A52'},
            {icon:'⚠️',label:'Atenção',txt:'Gastos com Delivery e Lazer tendem a crescer no 2º trimestre. Defina um limite agora.',col:'#D97706'},
            {icon:'📈',label:'Investimentos',txt:`Patrimônio de ${fmt(totInv)}. Considere diversificar em FIIs para renda passiva isenta de IR.`,col:'#1D6FA4'},
          ].map(ins=>(
            <div key={ins.label} style={{
              background:'#fff',borderLeft:`4px solid ${ins.col}`,borderRadius:'0 14px 14px 0',
              padding:'14px 16px',marginBottom:10,border:`1px solid rgba(10,138,82,.1)`,
              borderLeftWidth:4,borderLeftColor:ins.col,borderLeftStyle:'solid'
            }}>
              <div style={{fontSize:9.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>{ins.icon} {ins.label}</div>
              <div style={{fontSize:12,color:'#2E4A3A',lineHeight:1.6}}>{ins.txt}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{...card,gridColumn:'1/-1'}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#6B8878',marginBottom:16}}>
            Fluxo · {PERIODS[period]}
          </div>
          <div style={{position:'relative',height:200}}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
