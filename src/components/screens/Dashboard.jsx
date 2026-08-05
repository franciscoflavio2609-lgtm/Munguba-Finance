import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, getCat, INSIGHTS } from '../../data/constants'
import WeeklyInsight from '../ui/WeeklyInsight'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const BADGES = [
  { id:'primeiros_passos', icon:'🌱', titulo:'Primeiros Passos', desc:'Completou o onboarding', check: (s) => {
    const userId = s.session?.user?.id
    return userId ? localStorage.getItem(`munguba_onboarded_${userId}`) === '1' : false
  }},
  { id:'primeira_transacao', icon:'💰', titulo:'Primeira Transação', desc:'Registrou o primeiro gasto', check: (s) => s.transactions.length >= 1 },
  { id:'primeira_semana', icon:'🗓️', titulo:'Uma Semana', desc:'7 dias usando o Munguba', check: (s) => {
    const d = localStorage.getItem('munguba_first_use')
    if (!d) return false
    return (Date.now() - parseInt(d)) >= 7*24*60*60*1000
  }},
  { id:'primeiro_investimento', icon:'📈', titulo:'Primeiro Investimento', desc:'Registrou um investimento', check: (s) => s.investments.length >= 1 },
  { id:'reserva_iniciada', icon:'🛡️', titulo:'Reserva Iniciada', desc:'Investiu mais de R$1.000', check: (s) => s.investments.reduce((a,i)=>a+Number(i.val||0),0) >= 1000 },
  { id:'saldo_verde', icon:'🟢', titulo:'Saldo Verde', desc:'Receitas maiores que despesas', check: (s,inc,exp) => inc > 0 && exp < inc },
  { id:'sem_dividas', icon:'🏆', titulo:'Livre de Dívidas', desc:'Sem despesas fixas altas', check: () => false },
  { id:'educador', icon:'📚', titulo:'Estudante', desc:'Leu 3 módulos de educação', check: () => false },
]

export default function Dashboard({ onNav }) {
  const { state, calcStats } = useApp()
  const [insIdx, setInsIdx] = useState(0)
  const [showBadges, setShowBadges] = useState(false)
  const { inc, exp, bal, sav } = calcStats()
  const totInv = state.investments.reduce((a,i) => a + Number(i.val||0), 0)
  const ins = INSIGHTS[insIdx % INSIGHTS.length]
  const hasData = state.transactions.length > 0
  const userId = state.session?.user?.id
  const chave = (nome) => userId ? `munguba_${nome}_${userId}` : `munguba_${nome}`

  // Salva primeira vez de uso
  if (!localStorage.getItem('munguba_first_use')) {
    localStorage.setItem('munguba_first_use', Date.now().toString())
  }

  // ── Termômetro financeiro ──
  const metaRenda = parseFloat(localStorage.getItem(chave('renda')) || 0)
  const metaPoupanca = metaRenda > 0 ? metaRenda * 0.20 : 0
  const objetivo = localStorage.getItem(chave('objetivo'))
  const objetivoConquistado = localStorage.getItem(chave('objetivo_conquistado')) === '1'
  const [confirmandoConquista, setConfirmandoConquista] = useState(false)

  const marcarObjetivoConquistado = () => {
    localStorage.setItem(chave('objetivo_conquistado'), '1')
    setConfirmandoConquista(false)
    // Força atualização do componente
    window.dispatchEvent(new Event('storage'))
  }

  const refazerQuestionario = () => {
    if (!userId) return
    localStorage.removeItem(`munguba_onboarded_${userId}`)
    localStorage.removeItem(chave('objetivo'))
    localStorage.removeItem(chave('perfil'))
    localStorage.removeItem(chave('renda'))
    localStorage.removeItem(chave('objetivo_conquistado'))
    window.location.reload()
  }

  const getTermometro = () => {
    if (!hasData) return {
      emoji:'💡', cor:'#1D6FA4', bg:'#EFF6FF',
      msg:'Adicione sua primeira transação para ver seu termômetro financeiro aqui!'
    }
    const sobra = inc - exp
    if (sobra > 0) {
      if (metaPoupanca > 0 && sobra >= metaPoupanca) {
        return { emoji:'🟢', cor:'#076B3E', bg:'#DCFCE7', msg:`Mês excelente! Você está ${fmt(sobra)} no azul — meta de poupança atingida! 🎉` }
      }
      if (sobra >= 100) return { emoji:'🟢', cor:'#076B3E', bg:'#DCFCE7', msg:`Você está ${fmt(sobra)} no azul este mês. Continue assim!` }
      return { emoji:'🟡', cor:'#D97706', bg:'#FFF7ED', msg:`Você está ${fmt(sobra)} no azul, mas a margem é pequena. Cuidado com gastos extras.` }
    }
    if (sobra === 0) return { emoji:'🟡', cor:'#D97706', bg:'#FFF7ED', msg:'Receitas e despesas empatadas. Tente economizar mais este mês.' }
    return { emoji:'🔴', cor:'#D63333', bg:'#FEF2F2', msg:`Atenção! Suas despesas estão ${fmt(Math.abs(sobra))} acima das receitas este mês.` }
  }
  const termometro = getTermometro()

  // Badges conquistados
  const badgesConquistados = BADGES.filter(b => b.check(state, inc, exp))

  // Gráficos
  const bycat = {}
  state.transactions.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat]||0) + Number(t.val||0)
  })
  const catLabels = Object.keys(bycat)
  const catVals = Object.values(bycat)
  const pal = ['#0A8A52','#D63333','#D97706','#1D6FA4','#B45309','#7C3AED','#EC4899','#14B8A6']

  const flowData = {
    labels: hasData ? ['Receitas','Despesas'] : ['Sem dados'],
    datasets: [{ label:'Este mês', data: hasData ? [inc,exp] : [0], backgroundColor: hasData ? ['#0A8A52','#D63333'] : ['#E0E0E0'], borderRadius:10, borderSkipped:false }]
  }
  const catData = {
    labels: catLabels.length > 0 ? catLabels : ['Sem despesas'],
    datasets: [{ data: catVals.length > 0 ? catVals : [1], backgroundColor: catVals.length > 0 ? pal.slice(0,catLabels.length) : ['#E0E0E0'], borderWidth:0, hoverOffset:8 }]
  }
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ position:'top', labels:{ font:{size:11,family:'Outfit,sans-serif'}, boxWidth:12, padding:12 } } },
    scales:{
      x:{ grid:{display:false}, ticks:{font:{size:11}} },
      y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{size:10} }, border:{display:false} }
    }
  }
  const donutOpts = {
    responsive:true, maintainAspectRatio:false, cutout:'68%',
    plugins:{ legend:{ position:'bottom', labels:{ font:{size:10,family:'Outfit,sans-serif'}, boxWidth:10, padding:8 } } }
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  const stats = [
    { icon:'↑', bg:'#DCFCE7', ic:'#076B3E', label:'Receita do Mês', val: hasData ? fmt(inc) : 'R$ 0,00', sub:'▲ Entradas', sc:'#076B3E' },
    { icon:'↓', bg:'#FEF2F2', ic:'#D63333', label:'Despesas', val: hasData ? fmt(exp) : 'R$ 0,00', sub:'▼ Saídas', sc:'#D63333' },
    { icon:'₩', bg:'#EFF6FF', ic:'#1D6FA4', label:'Saldo Líquido', val: hasData ? fmt(bal) : 'R$ 0,00', sub:'Disponível', sc: bal>=0?'#076B3E':'#D63333' },
    { icon:'↗', bg:'#FFFBEB', ic:'#B45309', label:'Patrimônio Inv.', val: totInv>0 ? fmt(totInv) : 'R$ 0,00', sub:`Poupança: ${sav}%`, sc:'#B45309' },
  ]

  const recent = [...state.transactions].reverse().slice(0,5)

  return (
    <div style={{ animation:'vIn .26s ease' }}>

      {/* ── TERMÔMETRO FINANCEIRO ── */}
      <div style={{
        background: termometro.bg, border:`1.5px solid ${termometro.cor}30`,
        borderRadius:20, padding:'14px 18px', marginBottom:16,
        display:'flex', alignItems:'center', gap:12
      }}>
        <div style={{ fontSize:26, flexShrink:0 }}>{termometro.emoji}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:termometro.cor, marginBottom:3 }}>
            Termômetro Financeiro — {new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}
          </div>
          <div style={{ fontSize:13, color:termometro.cor, fontWeight:600, lineHeight:1.5 }}>{termometro.msg}</div>
        </div>
      </div>

      {/* ── INSIGHT SEMANAL PERSONALIZADO ── */}
      <WeeklyInsight state={state} />

      {/* ── BADGES ── */}
      {badgesConquistados.length > 0 && (
        <div style={{ ...card, marginBottom:16, padding:'14px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878' }}>
              🏆 Conquistas — {badgesConquistados.length}/{BADGES.length}
            </div>
            <button onClick={() => setShowBadges(!showBadges)} style={{
              background:'none', border:'none', fontSize:11, color:'#076B3E',
              cursor:'pointer', fontFamily:'Outfit,sans-serif', fontWeight:600
            }}>{showBadges ? 'ocultar' : 'ver todas'}</button>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {(showBadges ? BADGES : badgesConquistados).map((b,i) => {
              const conquistado = badgesConquistados.some(bc => bc.id === b.id)
              return (
                <div key={i} title={b.desc} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  padding:'8px 10px', borderRadius:12,
                  background: conquistado ? '#F0F9F4' : '#F5F5F5',
                  border: `1px solid ${conquistado ? 'rgba(10,138,82,.2)' : 'rgba(0,0,0,.06)'}`,
                  opacity: conquistado ? 1 : 0.45, minWidth:60
                }}>
                  <span style={{ fontSize:20, filter: conquistado ? 'none' : 'grayscale(100%)' }}>{b.icon}</span>
                  <span style={{ fontSize:9.5, color: conquistado ? '#076B3E' : '#A8BDB5', fontWeight:600, textAlign:'center', lineHeight:1.3 }}>{b.titulo}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
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

      {/* ── OBJETIVO PERSONALIZADO ── */}
      {objetivo && (
        <div style={{ ...card, background:'linear-gradient(130deg,#022818,#076B3E)', border:'none', color:'#fff', marginBottom:18, padding:'18px 22px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
            <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', opacity:.6 }}>Seu objetivo</div>
            {objetivoConquistado && (
              <div style={{ fontSize:9.5, fontWeight:700, background:'rgba(16,201,122,.2)', color:'#86EFAC', padding:'3px 9px', borderRadius:8, whiteSpace:'nowrap' }}>✓ Conquistado</div>
            )}
          </div>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>
            {objetivo==='dividas' && '💳 Sair das dívidas'}
            {objetivo==='poupar' && '🛡️ Construir reserva de emergência'}
            {objetivo==='investir' && '📈 Começar a investir'}
            {objetivo==='aposentar' && '🏖️ Conquistar independência financeira'}
            {objetivo==='controle' && '📊 Controlar meus gastos'}
            {objetivo==='familia' && '👨‍👩‍👧 Cuidar da família'}
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {!objetivoConquistado && objetivo==='dividas' && <button onClick={()=>onNav('calc')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Simular quitação →</button>}
            {!objetivoConquistado && objetivo==='poupar' && <button onClick={()=>onNav('inv')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Ver investimentos →</button>}
            {!objetivoConquistado && objetivo==='investir' && <button onClick={()=>onNav('calc')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Calculadoras →</button>}
            {!objetivoConquistado && objetivo==='aposentar' && <button onClick={()=>onNav('calc')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Simular aposentadoria →</button>}
            {!objetivoConquistado && objetivo==='controle' && <button onClick={()=>onNav('txn')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Ver extrato →</button>}
            {!objetivoConquistado && objetivo==='familia' && <button onClick={()=>onNav('bud')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Ver orçamento →</button>}
            {!objetivoConquistado && <button onClick={()=>onNav('edu')} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>Educação →</button>}

            {!objetivoConquistado && (
              <button onClick={()=>setConfirmandoConquista(true)} style={{background:'rgba(16,201,122,.18)',border:'1px solid rgba(16,201,122,.35)',color:'#86EFAC',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:700}}>✓ Marcar como conquistado</button>
            )}
            {objetivoConquistado && (
              <button onClick={refazerQuestionario} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'7px 14px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:600}}>🔄 Definir novo objetivo</button>
            )}
          </div>

          {confirmandoConquista && (
            <div style={{ marginTop:14, padding:'14px 16px', background:'rgba(255,255,255,.1)', borderRadius:14 }}>
              <div style={{ fontSize:12.5, marginBottom:10, lineHeight:1.5 }}>🎉 Parabéns por conquistar seu objetivo! Confirmar essa conquista?</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setConfirmandoConquista(false)} style={{flex:1,background:'rgba(255,255,255,.1)',border:'none',color:'rgba(255,255,255,.8)',padding:'9px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:12,fontWeight:600}}>Cancelar</button>
                <button onClick={marcarObjetivoConquistado} style={{flex:1,background:'#10C97A',border:'none',color:'#022818',padding:'9px',borderRadius:10,cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:12,fontWeight:700}}>✓ Sim, conquistei!</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INSIGHT ── */}
      {!objetivo && (
        <div style={{ background:'linear-gradient(130deg,#022818 0%,#076B3E 50%,#0A8A52 100%)', borderRadius:24, padding:'20px 22px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:18 }}>
          <div style={{ position:'absolute', top:-40, right:-30, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
          <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:6 }}>💡 Insight do Dia</div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontStyle:'italic', lineHeight:1.45 }}>{ins.m}</div>
          <div style={{ fontSize:12, opacity:.72, marginTop:6, lineHeight:1.6 }}>{ins.s}</div>
          <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
            <button onClick={() => setInsIdx(insIdx+1)} style={{ background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.24)', color:'#fff', padding:'7px 12px', borderRadius:10, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'Outfit,sans-serif' }}>Próxima dica ↻</button>
            <button onClick={() => onNav('edu')} style={{ background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.24)', color:'#fff', padding:'7px 12px', borderRadius:10, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'Outfit,sans-serif' }}>Educação →</button>
          </div>
        </div>
      )}

      {/* ── GRÁFICOS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Fluxo Mensal</div>
          <div style={{ position:'relative', height:160 }}>
            {!hasData
              ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#A8BDB5', fontSize:12, gap:6 }}>
                  <span style={{ fontSize:24 }}>📊</span><span>Adicione transações</span>
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
                  <span style={{ fontSize:24 }}>🥧</span><span>Sem despesas</span>
                </div>
              : <Doughnut data={catData} options={donutOpts}/>
            }
          </div>
        </div>
      </div>

      {/* ── TRANSAÇÕES RECENTES ── */}
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
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.desc||t.descricao}</div>
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
