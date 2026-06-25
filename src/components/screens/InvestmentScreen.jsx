import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, RF_INVESTMENTS, RV_INVESTMENTS, getTipoInfo } from '../../data/constants'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function InvestmentScreen() {
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState('portfolio')
  const [form, setForm] = useState({ tp:'', nm:'', val:'', rt:'', date: new Date().toISOString().split('T')[0] })
  const [goalForm, setGoalForm] = useState({ nome:'', alvo:'', prazo:'' })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [metas, setMetas] = useState([])

  const investments = state.investments || []
  const transactions = state.transactions || []

  const totInv = investments.reduce((a,i) => a+Number(i.val||0), 0)
  const estAnual = investments.reduce((a,i) => a + (Number(i.val||0) * (Number(i.rt||0)/100)), 0)

  const save = () => {
    if (!form.val || !form.nm || !form.tp) return alert('Preencha todos os campos.')
    dispatch({ type:'ADD_INVESTMENT', payload:{ ...form, val:parseFloat(form.val), rt:parseFloat(form.rt||0), id:Date.now() } })
    setForm({ tp:'', nm:'', val:'', rt:'', date: new Date().toISOString().split('T')[0] })
    setTab('portfolio')
  }

  const addMeta = () => {
    if (!goalForm.nome || !goalForm.alvo) return alert('Preencha nome e valor alvo.')
    setMetas(prev => [...prev, { id:Date.now(), nome:goalForm.nome, alvo:parseFloat(goalForm.alvo), prazo:goalForm.prazo }])
    setGoalForm({ nome:'', alvo:'', prazo:'' })
    setShowGoalForm(false)
  }
  const removeMeta = (id) => setMetas(prev => prev.filter(m => m.id !== id))

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }
  const riskCol = { low:'#076B3E', med:'#D97706', high:'#D63333' }
  const riskBg = { low:'#DCFCE7', med:'#FFF7ED', high:'#FEF2F2' }
  const riskLabel = { low:'Baixo', med:'Médio', high:'Alto' }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10, padding:'11px 13px', fontSize:14, fontFamily:'Outfit,sans-serif', background:'#F0F9F4', color:'#0D1F17', outline:'none' }

  const bySetor = useMemo(() => {
    const map = {}
    investments.forEach(inv => {
      const info = getTipoInfo(inv.tp)
      map[info.setor] = (map[info.setor]||0) + Number(inv.val||0)
    })
    return map
  }, [investments])

  const setorChartData = {
    labels: Object.keys(bySetor),
    datasets: [{
      data: Object.values(bySetor),
      backgroundColor: Object.keys(bySetor).map(s => {
        const entry = investments.find(i => getTipoInfo(i.tp).setor === s)
        return entry ? getTipoInfo(entry.tp).cor : '#6B8878'
      }),
      borderWidth: 0, hoverOffset: 8
    }]
  }
  const donutOpts = {
    responsive:true, maintainAspectRatio:false, cutout:'65%',
    plugins:{ legend:{ position:'bottom', labels:{ font:{size:10,family:'Outfit,sans-serif'}, boxWidth:10, padding:10 } } }
  }

  const dividendosMensais = useMemo(() => {
    return investments.reduce((acc, inv) => {
      const info = getTipoInfo(inv.tp)
      const dy = info.dyEstimado || 0
      if (dy > 0) {
        const anual = Number(inv.val||0) * (dy/100)
        acc.total += anual / 12
        acc.ativos.push({ nome: inv.nm, tipo: inv.tp, mensal: anual/12, cor: info.cor })
      }
      return acc
    }, { total: 0, ativos: [] })
  }, [investments])

  const scoreData = useMemo(() => {
    const inc = transactions.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.val||0),0)
    const exp = transactions.filter(t=>t.type!=='income').reduce((a,t)=>a+Number(t.val||0),0)
    const taxaPoupanca = inc > 0 ? Math.max(0, (inc-exp)/inc) : 0
    const temReserva = totInv > 0 ? Math.min(1, totInv / Math.max(1, exp*6)) : 0
    const diversificacao = Math.min(1, Object.keys(bySetor).length / 4)
    const temMetas = metas.length > 0 ? 1 : 0.3
    const temInvestimento = investments.length > 0 ? 1 : 0

    const score = Math.round(
      (taxaPoupanca * 300) +
      (temReserva * 250) +
      (diversificacao * 200) +
      (temMetas * 100) +
      (temInvestimento * 150)
    )
    const scoreFinal = Math.min(1000, score)

    let classificacao, cor
    if (scoreFinal >= 800) { classificacao = 'Excelente'; cor = '#076B3E' }
    else if (scoreFinal >= 600) { classificacao = 'Muito Bom'; cor = '#0A8A52' }
    else if (scoreFinal >= 400) { classificacao = 'Bom'; cor = '#D97706' }
    else if (scoreFinal >= 200) { classificacao = 'Regular'; cor = '#D97706' }
    else { classificacao = 'Iniciante'; cor = '#D63333' }

    return { scoreFinal, classificacao, cor, taxaPoupanca, temReserva, diversificacao }
  }, [transactions, totInv, bySetor, metas, investments])

  const riskAnalysis = useMemo(() => {
    if (investments.length === 0) return null
    let lowVal=0, medVal=0, highVal=0
    investments.forEach(inv => {
      const info = getTipoInfo(inv.tp)
      const v = Number(inv.val||0)
      if (info.risco === 'low') lowVal += v
      else if (info.risco === 'med') medVal += v
      else highVal += v
    })
    const total = lowVal+medVal+highVal
    const pctHigh = total > 0 ? (highVal/total)*100 : 0
    const pctMed = total > 0 ? (medVal/total)*100 : 0
    const pctLow = total > 0 ? (lowVal/total)*100 : 0

    let perfil, cor, recomendacao
    if (pctHigh >= 60) { perfil = 'Arrojado'; cor = '#D63333'; recomendacao = 'Carteira concentrada em renda variável. Considere parte em renda fixa para reduzir volatilidade.' }
    else if (pctHigh >= 30) { perfil = 'Moderado'; cor = '#D97706'; recomendacao = 'Boa mistura entre segurança e crescimento. Continue diversificando entre setores.' }
    else { perfil = 'Conservador'; cor = '#076B3E'; recomendacao = 'Carteira priorizando segurança. Para crescer patrimônio no longo prazo, considere uma parcela em renda variável.' }

    return { lowVal, medVal, highVal, pctLow, pctMed, pctHigh, perfil, cor, recomendacao }
  }, [investments])

  const riskChartData = riskAnalysis ? {
    labels: ['Baixo Risco', 'Médio Risco', 'Alto Risco'],
    datasets: [{
      data: [riskAnalysis.lowVal, riskAnalysis.medVal, riskAnalysis.highVal],
      backgroundColor: ['#076B3E','#D97706','#D63333'],
      borderWidth: 0, hoverOffset: 8
    }]
  } : null

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Patrimônio total', val:fmt(totInv), col:'#1D6FA4', bg:'#EFF6FF' },
          { label:'Estimativa anual', val:fmt(estAnual), col:'#076B3E', bg:'#DCFCE7' },
          { label:'Posições', val:investments.length, col:'#7C3AED', bg:'#F5F3FF' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding:'16px 18px', background:s.bg, border:'none' }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.col }}>{s.val}</div>
            <div style={{ fontSize:11, color:s.col, opacity:.8, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {[['portfolio','Minha Carteira'],['visual','Carteira Visual'],['div','Dividendos'],['score','Score'],['risco','Risco'],['metas','Metas'],['rf','Renda Fixa'],['rv','Renda Variável'],['add','+ Adicionar']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding:'9px 14px', borderRadius:12, border:'1.5px solid',
            borderColor: tab===v ? '#076B3E' : 'rgba(0,0,0,.1)',
            background: tab===v ? '#076B3E' : '#fff',
            color: tab===v ? '#fff' : '#2E4A3A',
            fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'
          }}>{l}</button>
        ))}
      </div>

      {tab === 'portfolio' && (
        <div style={card}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Posições ativas</div>
          {investments.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:'#A8BDB5' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
              <div style={{ fontSize:13 }}>Nenhum investimento registrado ainda</div>
            </div>
          ) : investments.map((inv,i) => (
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
          {investments.length > 0 && (
            <div style={{ marginTop:14, padding:'12px 16px', background:'#EFF6FF', borderRadius:14, display:'flex', justifyContent:'space-between', fontSize:13, color:'#1D6FA4', fontWeight:700 }}>
              <span>Total investido</span><span>{fmt(totInv)}</span>
            </div>
          )}
        </div>
      )}

      {tab === 'visual' && (
        <div>
          {investments.length === 0 ? (
            <div style={{ ...card, textAlign:'center', padding:'40px 20px', color:'#A8BDB5' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🥧</div>
              <div>Adicione investimentos para visualizar sua carteira</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
              <div style={card}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Alocação por Setor</div>
                <div style={{ height:240 }}><Doughnut data={setorChartData} options={donutOpts}/></div>
              </div>
              <div style={card}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Detalhamento</div>
                {Object.entries(bySetor).sort((a,b)=>b[1]-a[1]).map(([setor, val], i) => {
                  const entry = investments.find(inv => getTipoInfo(inv.tp).setor === setor)
                  const cor = entry ? getTipoInfo(entry.tp).cor : '#6B8878'
                  const pct = totInv > 0 ? Math.round((val/totInv)*100) : 0
                  return (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:10, height:10, borderRadius:3, background:cor }}/>
                          <span style={{ fontSize:12.5, fontWeight:600, color:'#0D1F17' }}>{setor}</span>
                        </div>
                        <span style={{ fontSize:12.5, fontWeight:700, color:cor }}>{pct}%</span>
                      </div>
                      <div style={{ height:6, background:'#F0F4F1', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:cor, borderRadius:3 }}/>
                      </div>
                      <div style={{ fontSize:11, color:'#6B8878', marginTop:4 }}>{fmt(val)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'div' && (
        <div>
          <div style={{ ...card, background:'linear-gradient(135deg,#022818,#076B3E)', border:'none', color:'#fff', marginBottom:14 }}>
            <div style={{ fontSize:10, opacity:.6, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Dividendos Mensais Estimados</div>
            <div style={{ fontSize:26, fontWeight:800 }}>{fmt(dividendosMensais.total)}</div>
            <div style={{ fontSize:12, opacity:.75, marginTop:6 }}>Projeção anual: {fmt(dividendosMensais.total*12)}</div>
          </div>

          {dividendosMensais.ativos.length === 0 ? (
            <div style={{ ...card, textAlign:'center', padding:'32px 0', color:'#A8BDB5' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💰</div>
              <div style={{ fontSize:13 }}>Adicione FIIs ou Ações para acompanhar dividendos</div>
            </div>
          ) : (
            <div style={card}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Por Ativo</div>
              {dividendosMensais.ativos.sort((a,b)=>b.mensal-a.mensal).map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #F0F4F1' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:a.cor+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>💰</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{a.nome}</div>
                    <div style={{ fontSize:11, color:'#6B8878' }}>{a.tipo}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:a.cor }}>{fmt(a.mensal)}/mês</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop:14, padding:'12px 16px', background:'#FFFBEB', borderRadius:14, fontSize:11.5, color:'#92702A', lineHeight:1.6 }}>
            💡 Valores estimados com base no Dividend Yield médio de mercado para cada tipo de ativo. Os valores reais podem variar.
          </div>
        </div>
      )}

      {tab === 'score' && (
        <div>
          <div style={{ ...card, textAlign:'center', padding:'32px 20px', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Seu Score Financeiro</div>
            <div style={{ position:'relative', width:180, height:180, margin:'0 auto 16px' }}>
              <svg viewBox="0 0 180 180" style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="78" fill="none" stroke="#F0F4F1" strokeWidth="14"/>
                <circle cx="90" cy="90" r="78" fill="none" stroke={scoreData.cor} strokeWidth="14"
                  strokeDasharray={(scoreData.scoreFinal/1000)*490 + ' 490'} strokeLinecap="round"/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontSize:36, fontWeight:800, color:scoreData.cor }}>{scoreData.scoreFinal}</div>
                <div style={{ fontSize:11, color:'#6B8878' }}>de 1000</div>
              </div>
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:scoreData.cor }}>{scoreData.classificacao}</div>
          </div>

          <div style={card}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>O que compõe seu score</div>
            {[
              { l:'Taxa de Poupança', v:Math.round(scoreData.taxaPoupanca*100), desc:'% da renda que você consegue guardar' },
              { l:'Reserva de Emergência', v:Math.round(scoreData.temReserva*100), desc:'Comparado a 6 meses de despesas' },
              { l:'Diversificação', v:Math.round(scoreData.diversificacao*100), desc:'Variedade de setores na carteira' },
            ].map((item,i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12.5, fontWeight:600, color:'#0D1F17' }}>{item.l}</span>
                  <span style={{ fontSize:12.5, fontWeight:700, color:'#076B3E' }}>{item.v}%</span>
                </div>
                <div style={{ height:7, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:item.v+'%', background:'#076B3E', borderRadius:4 }}/>
                </div>
                <div style={{ fontSize:10.5, color:'#A8BDB5', marginTop:3 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'risco' && (
        <div>
          {!riskAnalysis ? (
            <div style={{ ...card, textAlign:'center', padding:'40px 20px', color:'#A8BDB5' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
              <div>Adicione investimentos para analisar o risco da sua carteira</div>
            </div>
          ) : (
            <>
              <div style={{ ...card, background:'linear-gradient(135deg,'+riskAnalysis.cor+'dd,'+riskAnalysis.cor+')', border:'none', color:'#fff', marginBottom:14 }}>
                <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Perfil da sua Carteira</div>
                <div style={{ fontSize:24, fontWeight:800, marginBottom:10 }}>{riskAnalysis.perfil}</div>
                <div style={{ fontSize:12.5, opacity:.85, lineHeight:1.6 }}>{riskAnalysis.recomendacao}</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
                <div style={card}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Distribuição por Risco</div>
                  <div style={{ height:200 }}>{riskChartData && <Doughnut data={riskChartData} options={donutOpts}/>}</div>
                </div>
                <div style={card}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Detalhamento</div>
                  {[
                    { l:'Baixo Risco', pct:riskAnalysis.pctLow, val:riskAnalysis.lowVal, cor:'#076B3E' },
                    { l:'Médio Risco', pct:riskAnalysis.pctMed, val:riskAnalysis.medVal, cor:'#D97706' },
                    { l:'Alto Risco', pct:riskAnalysis.pctHigh, val:riskAnalysis.highVal, cor:'#D63333' },
                  ].map((r,i) => (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ fontSize:12.5, fontWeight:600, color:'#0D1F17' }}>{r.l}</span>
                        <span style={{ fontSize:12.5, fontWeight:700, color:r.cor }}>{Math.round(r.pct)}%</span>
                      </div>
                      <div style={{ height:6, background:'#F0F4F1', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:r.pct+'%', background:r.cor, borderRadius:3 }}/>
                      </div>
                      <div style={{ fontSize:11, color:'#6B8878', marginTop:4 }}>{fmt(r.val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'metas' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878' }}>Suas Metas de Investimento</div>
            <button onClick={() => setShowGoalForm(true)} style={{
              fontSize:11, color:'#fff', background:'#076B3E', border:'none',
              borderRadius:10, padding:'8px 16px', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontWeight:700
            }}>+ Nova meta</button>
          </div>

          {metas.length === 0 ? (
            <div style={{ ...card, textAlign:'center', padding:'40px 20px', color:'#A8BDB5' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
              <div style={{ marginBottom:6 }}>Nenhuma meta de investimento criada</div>
              <div style={{ fontSize:12 }}>Defina um valor alvo e acompanhe seu progresso</div>
            </div>
          ) : metas.map(meta => {
            const pct = meta.alvo > 0 ? Math.min(100, Math.round((totInv/meta.alvo)*100)) : 0
            const atingiu = totInv >= meta.alvo
            return (
              <div key={meta.id} style={{ ...card, marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0D1F17' }}>{meta.nome}</div>
                    {meta.prazo && <div style={{ fontSize:11, color:'#6B8878', marginTop:2 }}>Prazo: {meta.prazo}</div>}
                  </div>
                  <button onClick={()=>removeMeta(meta.id)} style={{ background:'none', border:'none', color:'#D63333', fontSize:18, cursor:'pointer', fontWeight:700 }}>×</button>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:12.5, color:'#6B8878' }}>{fmt(totInv)} de {fmt(meta.alvo)}</span>
                  <span style={{ fontSize:13, fontWeight:800, color: atingiu ? '#076B3E' : '#D97706' }}>{pct}%</span>
                </div>
                <div style={{ height:8, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:pct+'%', background: atingiu ? '#076B3E' : '#D97706', borderRadius:4, transition:'width .4s ease' }}/>
                </div>
                {atingiu && <div style={{ marginTop:8, fontSize:12, color:'#076B3E', fontWeight:600 }}>🎉 Meta atingida!</div>}
              </div>
            )
          })}

          {showGoalForm && (
            <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
              <div style={{ background:'#fff', borderRadius:24, padding:24, width:'100%', maxWidth:400 }}>
                <div style={{ fontSize:16, fontWeight:800, color:'#0D1F17', marginBottom:18 }}>Nova meta de investimento</div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:5 }}>Nome da meta</label>
                  <input placeholder="Ex: Carteira de R$100mil" value={goalForm.nome} onChange={e=>setGoalForm(f=>({...f,nome:e.target.value}))} style={inputStyle}/>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:5 }}>Valor alvo (R$)</label>
                  <input type="number" placeholder="100000" value={goalForm.alvo} onChange={e=>setGoalForm(f=>({...f,alvo:e.target.value}))} style={inputStyle}/>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:5 }}>Prazo (opcional)</label>
                  <input placeholder="Ex: Dezembro 2027" value={goalForm.prazo} onChange={e=>setGoalForm(f=>({...f,prazo:e.target.value}))} style={inputStyle}/>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={()=>setShowGoalForm(false)} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid rgba(0,0,0,.1)', background:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer', color:'#0D1F17' }}>Cancelar</button>
                  <button onClick={addMeta} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Criar meta</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
