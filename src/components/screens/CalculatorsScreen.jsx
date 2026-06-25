import { useState, useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler)

const fmt = v => (v||0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' })

const TABS = [
  { id:'juros', label:'Juros Compostos', icon:'📈' },
  { id:'comp', label:'Comparador', icon:'⚖️' },
  { id:'fire', label:'Aposentadoria', icon:'🏖️' },
  { id:'div', label:'Dividendos', icon:'💰' },
  { id:'divida', label:'Quitar Dívidas', icon:'💳' },
  { id:'analise', label:'Cotações ao Vivo', icon:'📡' },
]

export default function CalculatorsScreen() {
  const [tab, setTab] = useState('juros')

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'22px 24px', color:'#fff', marginBottom:18 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.6, marginBottom:8 }}>Ferramentas</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Calculadoras de Investimento</div>
        <div style={{ fontSize:13, opacity:.78, lineHeight:1.6 }}>Simule seus investimentos e planeje seu futuro financeiro com precisão.</div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'9px 16px', borderRadius:14, border:'1.5px solid',
            borderColor: tab===t.id ? '#076B3E' : 'rgba(10,138,82,.2)',
            background: tab===t.id ? '#076B3E' : '#fff',
            color: tab===t.id ? '#fff' : '#2E4A3A',
            fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer',
            display:'flex', alignItems:'center', gap:7
          }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === 'juros' && <JurosCompostos card={card}/>}
      {tab === 'comp' && <Comparador card={card}/>}
      {tab === 'fire' && <Aposentadoria card={card}/>}
      {tab === 'div' && <Dividendos card={card}/>}
      {tab === 'divida' && <QuitarDividas card={card}/>}
      {tab === 'analise' && <AnaliseFundamentalista card={card}/>}
    </div>
  )
}

// ════════════════════════════════════════
// 1. CALCULADORA DE JUROS COMPOSTOS
// ════════════════════════════════════════
function JurosCompostos({ card }) {
  const [inicial, setInicial] = useState(1000)
  const [mensal, setMensal] = useState(300)
  const [taxa, setTaxa] = useState(10)
  const [anos, setAnos] = useState(10)

  const result = useMemo(() => {
    const taxaMensal = Math.pow(1 + taxa/100, 1/12) - 1
    const meses = anos * 12
    let saldo = inicial
    let totalInvestido = inicial
    const evolucao = [{ mes:0, saldo, investido:totalInvestido }]
    for (let m = 1; m <= meses; m++) {
      saldo = saldo * (1 + taxaMensal) + mensal
      totalInvestido += mensal
      if (m % 12 === 0 || m === meses) {
        evolucao.push({ mes:m, saldo, investido:totalInvestido })
      }
    }
    return { saldoFinal:saldo, totalInvestido, jurosGanhos: saldo-totalInvestido, evolucao }
  }, [inicial, mensal, taxa, anos])

  const chartData = {
    labels: result.evolucao.map(e => `Ano ${Math.round(e.mes/12)}`),
    datasets: [
      { label:'Total Investido', data:result.evolucao.map(e=>e.investido), borderColor:'#6B8878', backgroundColor:'rgba(107,136,120,.08)', fill:true, tension:.3, borderWidth:2, pointRadius:3 },
      { label:'Patrimônio Total', data:result.evolucao.map(e=>e.saldo), borderColor:'#076B3E', backgroundColor:'rgba(7,107,62,.12)', fill:true, tension:.3, borderWidth:2.5, pointRadius:3 },
    ]
  }
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ position:'top', labels:{ font:{size:11,family:'Outfit,sans-serif'}, boxWidth:12, padding:12 } } },
    scales:{
      x:{ grid:{display:false}, ticks:{font:{size:10}} },
      y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{size:10} }, border:{display:false} }
    }
  }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }
  const labelStyle = { fontSize:11, fontWeight:700, color:'#6B8878', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6, display:'block' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
      {/* Inputs */}
      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:18 }}>Parâmetros da Simulação</div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Valor Inicial</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
            <input type="number" value={inicial} onChange={e=>setInicial(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Aporte Mensal</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
            <input type="number" value={mensal} onChange={e=>setMensal(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Taxa de Juros Anual: {taxa}%</label>
          <input type="range" min="1" max="30" step="0.5" value={taxa} onChange={e=>setTaxa(Number(e.target.value))} style={{ width:'100%', accentColor:'#076B3E' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#A8BDB5', marginTop:2 }}>
            <span>1%</span><span>Tesouro Selic ~13%</span><span>30%</span>
          </div>
        </div>

        <div style={{ marginBottom:6 }}>
          <label style={labelStyle}>Período: {anos} {anos===1?'ano':'anos'}</label>
          <input type="range" min="1" max="40" value={anos} onChange={e=>setAnos(Number(e.target.value))} style={{ width:'100%', accentColor:'#076B3E' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#A8BDB5', marginTop:2 }}>
            <span>1 ano</span><span>40 anos</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Resultado da Simulação</div>
        <div style={{ background:'linear-gradient(135deg,#022818,#076B3E)', borderRadius:18, padding:'18px 20px', color:'#fff', marginBottom:14 }}>
          <div style={{ fontSize:10, opacity:.6, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>Patrimônio Final</div>
          <div style={{ fontSize:26, fontWeight:800 }}>{fmt(result.saldoFinal)}</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div style={{ background:'#F0F9F4', borderRadius:14, padding:'12px 14px' }}>
            <div style={{ fontSize:9.5, color:'#6B8878', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Total Investido</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#0D1F17' }}>{fmt(result.totalInvestido)}</div>
          </div>
          <div style={{ background:'#DCFCE7', borderRadius:14, padding:'12px 14px' }}>
            <div style={{ fontSize:9.5, color:'#076B3E', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Juros Ganhos</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#076B3E' }}>{fmt(result.jurosGanhos)}</div>
          </div>
        </div>
        <div style={{ marginTop:12, padding:'10px 14px', background:'#FFFBEB', borderRadius:12, fontSize:11.5, color:'#92702A', lineHeight:1.6 }}>
          💡 Os juros representam <strong>{result.totalInvestido>0 ? Math.round((result.jurosGanhos/result.totalInvestido)*100) : 0}%</strong> a mais do que você investiu — esse é o poder dos juros compostos trabalhando para você.
        </div>
      </div>

      {/* Chart */}
      <div style={{ ...card, gridColumn:'1 / -1' }} className="card-full">
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Evolução do Patrimônio</div>
        <div style={{ height:280 }}><Line data={chartData} options={chartOpts}/></div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 2. COMPARADOR DE INVESTIMENTOS
// ════════════════════════════════════════
const ATIVOS = [
  { id:'selic', nome:'Tesouro Selic', taxa:13.65, ir:true, cor:'#076B3E', desc:'Pós-fixado, liquidez diária' },
  { id:'cdb100', nome:'CDB 100% CDI', taxa:13.65, ir:true, cor:'#1D6FA4', desc:'Garantido pelo FGC' },
  { id:'cdb120', nome:'CDB 120% CDI', taxa:16.38, ir:true, cor:'#0E7490', desc:'Bancos médios, FGC' },
  { id:'lci', nome:'LCI/LCA 90% CDI', taxa:12.29, ir:false, cor:'#7C3AED', desc:'Isento de IR' },
  { id:'poup', nome:'Poupança', taxa:7.40, ir:false, cor:'#D63333', desc:'Baixo rendimento' },
  { id:'fii', nome:'FIIs (média DY)', taxa:10.5, ir:false, cor:'#D97706', desc:'Dividendos isentos, variável' },
]

function calcIR(meses) {
  const dias = meses * 30
  if (dias <= 180) return 0.225
  if (dias <= 360) return 0.20
  if (dias <= 720) return 0.175
  return 0.15
}

function Comparador({ card }) {
  const [valor, setValor] = useState(10000)
  const [meses, setMeses] = useState(12)
  const [selecionados, setSelecionados] = useState(['selic','cdb100','lci','poup'])

  const toggleAtivo = (id) => {
    setSelecionados(prev => prev.includes(id) ? prev.filter(a=>a!==id) : [...prev, id])
  }

  const resultados = useMemo(() => {
    const ir = calcIR(meses)
    return ATIVOS.filter(a => selecionados.includes(a.id)).map(a => {
      const bruto = valor * Math.pow(1 + a.taxa/100, meses/12)
      const rendBruto = bruto - valor
      const imposto = a.ir ? rendBruto * ir : 0
      const liquido = bruto - imposto
      return { ...a, bruto, liquido, rendLiquido: liquido - valor, imposto }
    }).sort((a,b) => b.liquido - a.liquido)
  }, [valor, meses, selecionados])

  const chartData = {
    labels: resultados.map(r => r.nome),
    datasets: [{
      label:'Valor líquido final',
      data: resultados.map(r => r.liquido),
      backgroundColor: resultados.map(r => r.cor),
      borderRadius: 10, borderSkipped:false
    }]
  }
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    indexAxis:'y',
    plugins:{ legend:{ display:false } },
    scales:{
      x:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{size:10} }, border:{display:false} },
      y:{ grid:{display:false}, ticks:{font:{size:11,family:'Outfit,sans-serif'}} }
    }
  }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }
  const labelStyle = { fontSize:11, fontWeight:700, color:'#6B8878', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6, display:'block' }

  return (
    <div>
      <div style={{ ...card, marginBottom:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
          <div>
            <label style={labelStyle}>Valor a Investir</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
              <input type="number" value={valor} onChange={e=>setValor(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Prazo: {meses} {meses===1?'mês':'meses'}</label>
            <input type="range" min="1" max="60" value={meses} onChange={e=>setMeses(Number(e.target.value))} style={{ width:'100%', accentColor:'#076B3E', marginTop:11 }}/>
          </div>
        </div>

        <label style={labelStyle}>Escolha os investimentos para comparar</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {ATIVOS.map(a => (
            <button key={a.id} onClick={() => toggleAtivo(a.id)} style={{
              padding:'8px 14px', borderRadius:20, border:'1.5px solid',
              borderColor: selecionados.includes(a.id) ? a.cor : 'rgba(0,0,0,.1)',
              background: selecionados.includes(a.id) ? a.cor+'15' : '#fff',
              color: selecionados.includes(a.id) ? a.cor : '#A8BDB5',
              fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer'
            }}>{a.nome}</button>
          ))}
        </div>
      </div>

      {resultados.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'40px 20px', color:'#A8BDB5' }}>
          Selecione pelo menos um investimento para comparar
        </div>
      ) : (
        <>
          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Comparação — Valor Líquido Final</div>
            <div style={{ height:Math.max(180, resultados.length*55) }}><Bar data={chartData} options={chartOpts}/></div>
          </div>

          <div style={card}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Detalhamento</div>
            {resultados.map((r, i) => (
              <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i<resultados.length-1 ? '1px solid #F0F4F1' : 'none' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:r.cor+'18', color:r.cor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>{i+1}º</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0D1F17' }}>{r.nome}</div>
                  <div style={{ fontSize:11, color:'#6B8878' }}>{r.desc} {r.ir && `· IR: ${fmt(r.imposto)}`} {!r.ir && '· Isento de IR'}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:r.cor }}>{fmt(r.liquido)}</div>
                  <div style={{ fontSize:10.5, color:'#076B3E' }}>+{fmt(r.rendLiquido)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop:14, padding:'12px 16px', background:'#FFFBEB', borderRadius:14, fontSize:11.5, color:'#92702A', lineHeight:1.6 }}>
        ⚠️ Valores simulados com taxas médias de mercado. Rentabilidade real pode variar conforme a instituição financeira e condições de mercado.
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 3. SIMULADOR DE APOSENTADORIA / FIRE
// ════════════════════════════════════════
function Aposentadoria({ card }) {
  const [idadeAtual, setIdadeAtual] = useState(30)
  const [idadeAposentar, setIdadeAposentar] = useState(60)
  const [gastosMensais, setGastosMensais] = useState(4000)
  const [patrimonioAtual, setPatrimonioAtual] = useState(10000)
  const [aporteMensal, setAporteMensal] = useState(1000)
  const [taxa, setTaxa] = useState(8)

  const result = useMemo(() => {
    const anosAcumulo = Math.max(0, idadeAposentar - idadeAtual)
    const meses = anosAcumulo * 12
    const taxaMensal = Math.pow(1 + taxa/100, 1/12) - 1
    let saldo = patrimonioAtual
    const evolucao = [{ idade: idadeAtual, saldo }]
    for (let m = 1; m <= meses; m++) {
      saldo = saldo * (1 + taxaMensal) + aporteMensal
      if (m % 12 === 0) evolucao.push({ idade: idadeAtual + m/12, saldo })
    }
    const patrimonioNecessario = gastosMensais * 12 * 25 // regra dos 4%
    const rendaPassivaMensal = (saldo * 0.04) / 12
    const atingiuMeta = saldo >= patrimonioNecessario
    const percentualMeta = Math.min(100, Math.round((saldo/patrimonioNecessario)*100))

    return { patrimonioFinal:saldo, patrimonioNecessario, rendaPassivaMensal, atingiuMeta, percentualMeta, evolucao, anosAcumulo }
  }, [idadeAtual, idadeAposentar, gastosMensais, patrimonioAtual, aporteMensal, taxa])

  const chartData = {
    labels: result.evolucao.map(e => `${Math.round(e.idade)} anos`),
    datasets: [
      { label:'Patrimônio Projetado', data:result.evolucao.map(e=>e.saldo), borderColor:'#076B3E', backgroundColor:'rgba(7,107,62,.12)', fill:true, tension:.3, borderWidth:2.5, pointRadius:3 },
    ]
  }
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ position:'top', labels:{ font:{size:11,family:'Outfit,sans-serif'}, boxWidth:12, padding:12 } } },
    scales:{
      x:{ grid:{display:false}, ticks:{font:{size:10}, maxTicksLimit:8} },
      y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{size:10} }, border:{display:false} }
    }
  }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }
  const labelStyle = { fontSize:11, fontWeight:700, color:'#6B8878', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6, display:'block' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
      {/* Inputs */}
      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:18 }}>Seus Dados</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <div>
            <label style={labelStyle}>Idade Atual</label>
            <input type="number" value={idadeAtual} onChange={e=>setIdadeAtual(Number(e.target.value)||0)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Idade p/ Aposentar</label>
            <input type="number" value={idadeAposentar} onChange={e=>setIdadeAposentar(Number(e.target.value)||0)} style={inputStyle}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Gastos Mensais Desejados</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
            <input type="number" value={gastosMensais} onChange={e=>setGastosMensais(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Patrimônio Atual Investido</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
            <input type="number" value={patrimonioAtual} onChange={e=>setPatrimonioAtual(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Aporte Mensal</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
            <input type="number" value={aporteMensal} onChange={e=>setAporteMensal(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Retorno Anual Esperado: {taxa}%</label>
          <input type="range" min="4" max="20" step="0.5" value={taxa} onChange={e=>setTaxa(Number(e.target.value))} style={{ width:'100%', accentColor:'#076B3E' }}/>
        </div>
      </div>

      {/* Results */}
      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Sua Independência Financeira</div>

        <div style={{ background: result.atingiuMeta ? 'linear-gradient(135deg,#022818,#076B3E)' : 'linear-gradient(135deg,#7C2D12,#B45309)', borderRadius:18, padding:'18px 20px', color:'#fff', marginBottom:14 }}>
          <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>
            {result.atingiuMeta ? '🎉 Meta atingida!' : 'Patrimônio projetado aos ' + idadeAposentar + ' anos'}
          </div>
          <div style={{ fontSize:24, fontWeight:800 }}>{fmt(result.patrimonioFinal)}</div>
          <div style={{ fontSize:11, opacity:.75, marginTop:6 }}>Meta necessária: {fmt(result.patrimonioNecessario)}</div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#6B8878', marginBottom:6 }}>
            <span>Progresso até a meta</span><span style={{fontWeight:700, color:'#076B3E'}}>{result.percentualMeta}%</span>
          </div>
          <div style={{ height:8, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${result.percentualMeta}%`, background: result.atingiuMeta ? '#076B3E' : '#D97706', borderRadius:4, transition:'width .4s ease' }}/>
          </div>
        </div>

        <div style={{ background:'#F0F9F4', borderRadius:14, padding:'14px 16px', marginBottom:10 }}>
          <div style={{ fontSize:9.5, color:'#6B8878', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Renda Passiva Mensal Estimada</div>
          <div style={{ fontSize:18, fontWeight:800, color:'#076B3E' }}>{fmt(result.rendaPassivaMensal)}</div>
          <div style={{ fontSize:10.5, color:'#6B8878', marginTop:2 }}>Baseado na regra dos 4% ao ano</div>
        </div>

        <div style={{ padding:'10px 14px', background: result.atingiuMeta ? '#DCFCE7' : '#FFFBEB', borderRadius:12, fontSize:11.5, color: result.atingiuMeta ? '#076B3E' : '#92702A', lineHeight:1.6 }}>
          {result.atingiuMeta
            ? `✅ Com esse plano você atinge a independência financeira em ${result.anosAcumulo} anos, cobrindo seus gastos de ${fmt(gastosMensais)}/mês.`
            : `💡 Faltam ${fmt(result.patrimonioNecessario - result.patrimonioFinal)} para atingir sua meta. Considere aumentar o aporte mensal ou o prazo.`
          }
        </div>
      </div>

      {/* Chart */}
      <div style={{ ...card, gridColumn:'1 / -1' }} className="card-full">
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Evolução do Patrimônio até a Aposentadoria</div>
        <div style={{ height:280 }}><Line data={chartData} options={chartOpts}/></div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 4. CALCULADORA DE DIVIDENDOS
// ════════════════════════════════════════
const ATIVOS_DIV = [
  { id:'fii_tijolo', nome:'FII de Tijolo', dy:9.0, cor:'#076B3E', desc:'Imóveis físicos (galpões, shoppings)', isento:true },
  { id:'fii_papel', nome:'FII de Papel', dy:11.5, cor:'#1D6FA4', desc:'CRIs e LCIs imobiliárias', isento:true },
  { id:'acao_banco', nome:'Ações de Bancos', dy:7.5, cor:'#7C3AED', desc:'Ex: ITUB4, BBAS3, BBDC4', isento:false },
  { id:'acao_energia', nome:'Ações de Energia', dy:8.5, cor:'#D97706', desc:'Ex: TAEE11, ENGI11, CPFE3', isento:false },
]

function Dividendos({ card }) {
  const [modo, setModo] = useState('valor') // valor ou renda
  const [valorInvestido, setValorInvestido] = useState(50000)
  const [rendaDesejada, setRendaDesejada] = useState(2000)
  const [ativoSelecionado, setAtivoSelecionado] = useState('fii_tijolo')

  const ativo = ATIVOS_DIV.find(a => a.id === ativoSelecionado)

  const resultado = useMemo(() => {
    if (modo === 'valor') {
      const dividendoAnual = valorInvestido * (ativo.dy / 100)
      const dividendoMensal = dividendoAnual / 12
      return { dividendoAnual, dividendoMensal, capitalNecessario: valorInvestido }
    } else {
      const dividendoAnual = rendaDesejada * 12
      const capitalNecessario = dividendoAnual / (ativo.dy / 100)
      return { dividendoAnual, dividendoMensal: rendaDesejada, capitalNecessario }
    }
  }, [modo, valorInvestido, rendaDesejada, ativo])

  const chartData = {
    labels: ATIVOS_DIV.map(a => a.nome),
    datasets: [{
      label: 'Dividend Yield (% a.a.)',
      data: ATIVOS_DIV.map(a => a.dy),
      backgroundColor: ATIVOS_DIV.map(a => a.cor),
      borderRadius: 10, borderSkipped:false
    }]
  }
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
      x:{ grid:{display:false}, ticks:{font:{size:10,family:'Outfit,sans-serif'}} },
      y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>v+'%', font:{size:10} }, border:{display:false} }
    }
  }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }
  const labelStyle = { fontSize:11, fontWeight:700, color:'#6B8878', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6, display:'block' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:18 }}>O que você quer calcular?</div>

        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          <button onClick={()=>setModo('valor')} style={{
            flex:1, padding:'10px', borderRadius:12, border:'1.5px solid',
            borderColor: modo==='valor' ? '#076B3E' : 'rgba(0,0,0,.1)',
            background: modo==='valor' ? '#076B3E' : '#fff',
            color: modo==='valor' ? '#fff' : '#6B8878',
            fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'
          }}>Tenho um valor</button>
          <button onClick={()=>setModo('renda')} style={{
            flex:1, padding:'10px', borderRadius:12, border:'1.5px solid',
            borderColor: modo==='renda' ? '#076B3E' : 'rgba(0,0,0,.1)',
            background: modo==='renda' ? '#076B3E' : '#fff',
            color: modo==='renda' ? '#fff' : '#6B8878',
            fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'
          }}>Quero uma renda</button>
        </div>

        {modo === 'valor' ? (
          <div style={{ marginBottom:16 }}>
            <label style={labelStyle}>Valor que pretende investir</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
              <input type="number" value={valorInvestido} onChange={e=>setValorInvestido(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom:16 }}>
            <label style={labelStyle}>Renda mensal desejada</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
              <input type="number" value={rendaDesejada} onChange={e=>setRendaDesejada(Number(e.target.value)||0)} style={{...inputStyle, paddingLeft:34}}/>
            </div>
          </div>
        )}

        <label style={labelStyle}>Tipo de ativo</label>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {ATIVOS_DIV.map(a => (
            <button key={a.id} onClick={()=>setAtivoSelecionado(a.id)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'11px 14px', borderRadius:12, border:'1.5px solid',
              borderColor: ativoSelecionado===a.id ? a.cor : 'rgba(0,0,0,.08)',
              background: ativoSelecionado===a.id ? a.cor+'10' : '#fff',
              cursor:'pointer', textAlign:'left'
            }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#0D1F17' }}>{a.nome}</div>
                <div style={{ fontSize:10.5, color:'#6B8878' }}>{a.desc}</div>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:a.cor }}>{a.dy}%</div>
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Resultado</div>

        <div style={{ background:`linear-gradient(135deg,${ativo.cor}dd,${ativo.cor})`, borderRadius:18, padding:'18px 20px', color:'#fff', marginBottom:14 }}>
          <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>
            {modo==='valor' ? 'Dividendo Mensal Estimado' : 'Capital Necessário'}
          </div>
          <div style={{ fontSize:26, fontWeight:800 }}>
            {modo==='valor' ? fmt(resultado.dividendoMensal) : fmt(resultado.capitalNecessario)}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          <div style={{ background:'#F0F9F4', borderRadius:14, padding:'12px 14px' }}>
            <div style={{ fontSize:9.5, color:'#6B8878', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Dividendo Anual</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#0D1F17' }}>{fmt(resultado.dividendoAnual)}</div>
          </div>
          <div style={{ background:'#DCFCE7', borderRadius:14, padding:'12px 14px' }}>
            <div style={{ fontSize:9.5, color:'#076B3E', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Dividend Yield</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#076B3E' }}>{ativo.dy}% a.a.</div>
          </div>
        </div>

        <div style={{ height:160, marginBottom:10 }}>
          <Bar data={chartData} options={chartOpts}/>
        </div>

        <div style={{ padding:'10px 14px', background: ativo.isento ? '#DCFCE7' : '#FFFBEB', borderRadius:12, fontSize:11.5, color: ativo.isento ? '#076B3E' : '#92702A', lineHeight:1.6 }}>
          {ativo.isento
            ? '✅ Dividendos de FIIs são isentos de Imposto de Renda para pessoa física.'
            : '⚠️ Dividendos de ações geralmente são isentos hoje, mas fique atento a mudanças na legislação tributária.'
          }
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 5. SIMULADOR DE QUITAÇÃO DE DÍVIDAS
// ════════════════════════════════════════
function QuitarDividas({ card }) {
  const [dividas, setDividas] = useState([
    { id:1, nome:'Cartão de Crédito', saldo:3000, taxaMensal:12 },
  ])
  const [valorExtra, setValorExtra] = useState(500)
  const [estrategia, setEstrategia] = useState('avalanche')

  const addDivida = () => {
    setDividas(prev => [...prev, { id:Date.now(), nome:'Nova dívida', saldo:1000, taxaMensal:5 }])
  }
  const removeDivida = (id) => setDividas(prev => prev.filter(d => d.id !== id))
  const updateDivida = (id, field, val) => {
    setDividas(prev => prev.map(d => d.id===id ? {...d, [field]: val} : d))
  }

  const simulacao = useMemo(() => {
    if (dividas.length === 0) return null
    let dList = dividas.map(d => ({ ...d, saldoAtual: d.saldo }))
    const totalInicial = dList.reduce((a,d) => a + d.saldo, 0)
    let totalJurosPagos = 0
    let mes = 0
    const historico = []
    const maxMeses = 600

    while (dList.some(d => d.saldoAtual > 0.01) && mes < maxMeses) {
      mes++
      // Aplica juros
      dList = dList.map(d => {
        if (d.saldoAtual <= 0) return d
        const juros = d.saldoAtual * (d.taxaMensal/100)
        totalJurosPagos += juros
        return { ...d, saldoAtual: d.saldoAtual + juros }
      })

      // Ordena conforme estratégia
      const ativas = dList.filter(d => d.saldoAtual > 0.01)
      const ordenadas = [...ativas].sort((a,b) => {
        if (estrategia === 'avalanche') return b.taxaMensal - a.taxaMensal
        return a.saldoAtual - b.saldoAtual
      })

      let disponivel = valorExtra
      for (const alvo of ordenadas) {
        if (disponivel <= 0) break
        const idx = dList.findIndex(d => d.id === alvo.id)
        const pagamento = Math.min(disponivel, dList[idx].saldoAtual)
        dList[idx] = { ...dList[idx], saldoAtual: dList[idx].saldoAtual - pagamento }
        disponivel -= pagamento
      }

      const totalRestante = dList.reduce((a,d) => a + Math.max(0,d.saldoAtual), 0)
      if (mes % 1 === 0) historico.push({ mes, restante: totalRestante })
      if (totalRestante <= 0.01) break
    }

    return { meses: mes, totalJurosPagos, totalInicial, historico: historico.filter((_,i) => i % Math.max(1,Math.ceil(historico.length/24)) === 0 || i === historico.length-1) }
  }, [dividas, valorExtra, estrategia])

  const totalDividas = dividas.reduce((a,d) => a + d.saldo, 0)
  const totalMinimos = dividas.reduce((a,d) => a + d.saldo * 0.05, 0) // estimativa mínimo 5%

  const chartData = simulacao ? {
    labels: simulacao.historico.map(h => `Mês ${h.mes}`),
    datasets: [{
      label: 'Saldo devedor restante',
      data: simulacao.historico.map(h => h.restante),
      borderColor: '#D63333', backgroundColor:'rgba(214,51,51,.1)', fill:true, tension:.3, borderWidth:2.5, pointRadius:3
    }]
  } : null
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
      x:{ grid:{display:false}, ticks:{font:{size:10}, maxTicksLimit:8} },
      y:{ grid:{color:'rgba(0,0,0,.04)'}, ticks:{ callback:v=>'R$'+(v>=1000?Math.round(v/1000)+'k':v), font:{size:10} }, border:{display:false} }
    }
  }

  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:10, padding:'8px 11px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }
  const labelStyle = { fontSize:11, fontWeight:700, color:'#6B8878', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6, display:'block' }

  return (
    <div>
      <div style={{ ...card, marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878' }}>Suas Dívidas</div>
          <button onClick={addDivida} style={{
            fontSize:11, color:'#076B3E', background:'#DCFCE7', border:'none',
            borderRadius:8, padding:'6px 12px', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontWeight:700
          }}>+ Adicionar dívida</button>
        </div>

        {dividas.map(d => (
          <div key={d.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:10, alignItems:'end', marginBottom:12, paddingBottom:12, borderBottom:'1px solid #F0F4F1' }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input type="text" value={d.nome} onChange={e=>updateDivida(d.id,'nome',e.target.value)} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Saldo (R$)</label>
              <input type="number" value={d.saldo} onChange={e=>updateDivida(d.id,'saldo',Number(e.target.value)||0)} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Juros %/mês</label>
              <input type="number" step="0.1" value={d.taxaMensal} onChange={e=>updateDivida(d.id,'taxaMensal',Number(e.target.value)||0)} style={inputStyle}/>
            </div>
            <button onClick={()=>removeDivida(d.id)} style={{
              width:32, height:32, borderRadius:8, border:'none', background:'#FEF2F2', color:'#D63333',
              cursor:'pointer', fontSize:16, fontWeight:700
            }}>×</button>
          </div>
        ))}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:16 }}>
          <div>
            <label style={labelStyle}>Valor extra mensal para pagar dívidas</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#6B8878' }}>R$</span>
              <input type="number" value={valorExtra} onChange={e=>setValorExtra(Number(e.target.value)||0)} style={{...inputStyle, padding:'11px 14px 11px 34px', fontSize:14}}/>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Estratégia</label>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEstrategia('avalanche')} style={{
                flex:1, padding:'10px', borderRadius:10, border:'1.5px solid',
                borderColor: estrategia==='avalanche' ? '#076B3E' : 'rgba(0,0,0,.1)',
                background: estrategia==='avalanche' ? '#076B3E' : '#fff',
                color: estrategia==='avalanche' ? '#fff' : '#6B8878',
                fontFamily:'Outfit,sans-serif', fontSize:11.5, fontWeight:700, cursor:'pointer'
              }}>Avalanche</button>
              <button onClick={()=>setEstrategia('bolaDeNeve')} style={{
                flex:1, padding:'10px', borderRadius:10, border:'1.5px solid',
                borderColor: estrategia==='bolaDeNeve' ? '#076B3E' : 'rgba(0,0,0,.1)',
                background: estrategia==='bolaDeNeve' ? '#076B3E' : '#fff',
                color: estrategia==='bolaDeNeve' ? '#fff' : '#6B8878',
                fontFamily:'Outfit,sans-serif', fontSize:11.5, fontWeight:700, cursor:'pointer'
              }}>Bola de Neve</button>
            </div>
          </div>
        </div>
        <div style={{ fontSize:10.5, color:'#A8BDB5', marginTop:6 }}>
          {estrategia==='avalanche' ? 'Prioriza a dívida com maior taxa de juros — economiza mais dinheiro.' : 'Prioriza a menor dívida primeiro — gera vitórias rápidas e motivação.'}
        </div>
      </div>

      {simulacao && totalDividas > 0 && (
        <>
          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
              <div style={{ background:'#FEF2F2', borderRadius:14, padding:'14px' }}>
                <div style={{ fontSize:9.5, color:'#D63333', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Total em Dívidas</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#D63333' }}>{fmt(totalDividas)}</div>
              </div>
              <div style={{ background:'#FFFBEB', borderRadius:14, padding:'14px' }}>
                <div style={{ fontSize:9.5, color:'#92702A', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Tempo p/ Quitar</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#92702A' }}>{simulacao.meses} meses</div>
              </div>
              <div style={{ background:'#F0F9F4', borderRadius:14, padding:'14px' }}>
                <div style={{ fontSize:9.5, color:'#076B3E', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Juros Totais Pagos</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#076B3E' }}>{fmt(simulacao.totalJurosPagos)}</div>
              </div>
            </div>
            <div style={{ height:220 }}>
              {chartData && <Line data={chartData} options={chartOpts}/>}
            </div>
          </div>

          <div style={{ padding:'14px 18px', background:'#FFFBEB', borderRadius:16, fontSize:12.5, color:'#92702A', lineHeight:1.7 }}>
            💡 Com {fmt(valorExtra)}/mês extras usando a estratégia <strong>{estrategia==='avalanche'?'Avalanche':'Bola de Neve'}</strong>, você fica livre de dívidas em <strong>{simulacao.meses} meses</strong>, pagando um total de <strong>{fmt(simulacao.totalJurosPagos)}</strong> em juros. Quanto maior o valor extra mensal, mais rápido você sai do vermelho.
          </div>
        </>
      )}

      {dividas.length === 0 && (
        <div style={{ ...card, textAlign:'center', padding:'40px 20px', color:'#A8BDB5' }}>
          Adicione pelo menos uma dívida para simular
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════
// 6. ANÁLISE FUNDAMENTALISTA COMPLETA (brapi.dev)
// ════════════════════════════════════════
const TICKERS_LIVRES = ['PETR4', 'VALE3', 'MGLU3', 'ITUB4']

function avaliarIndicador(id, valor) {
  if (valor == null || isNaN(valor)) return { status:'nd', msg:'Sem dados disponíveis', cor:'#A8BDB5' }
  if (id==='pl') {
    if (valor<=0) return { status:'neg', msg:'Lucro negativo — empresa com prejuízo', cor:'#D63333' }
    if (valor<10) return { status:'ex', msg:'Excelente — ação barata em relação ao lucro', cor:'#076B3E' }
    if (valor<20) return { status:'ok', msg:'Bom — P/L dentro da faixa saudável', cor:'#0A8A52' }
    if (valor<30) return { status:'at', msg:'Atenção — ação cara em relação ao lucro', cor:'#D97706' }
    return { status:'ru', msg:'Alto — mercado paga prêmio elevado', cor:'#D63333' }
  }
  if (id==='pvp') {
    if (valor<=0) return { status:'neg', msg:'Patrimônio negativo — cuidado', cor:'#D63333' }
    if (valor<1) return { status:'ex', msg:'Excelente — abaixo do valor patrimonial', cor:'#076B3E' }
    if (valor<2) return { status:'ok', msg:'Bom — faixa comum e saudável', cor:'#0A8A52' }
    if (valor<4) return { status:'at', msg:'Atenção — prêmio sobre o patrimônio', cor:'#D97706' }
    return { status:'ru', msg:'Alto — prêmio muito elevado', cor:'#D63333' }
  }
  if (id==='dy') {
    if (valor<=0) return { status:'nd', msg:'Não pagou dividendos recentemente', cor:'#A8BDB5' }
    if (valor>=8) return { status:'ex', msg:'Excelente — dividendo muito atrativo', cor:'#076B3E' }
    if (valor>=5) return { status:'ok', msg:'Bom — dividendo acima da média', cor:'#0A8A52' }
    if (valor>=3) return { status:'at', msg:'Moderado — dividendo dentro da média', cor:'#D97706' }
    return { status:'ru', msg:'Baixo — dividendo pouco expressivo', cor:'#D63333' }
  }
  if (id==='roe') {
    if (valor<=0) return { status:'neg', msg:'ROE negativo — empresa destruindo valor', cor:'#D63333' }
    if (valor>=20) return { status:'ex', msg:'Excelente — empresa muito eficiente', cor:'#076B3E' }
    if (valor>=15) return { status:'ok', msg:'Bom — acima da média do mercado', cor:'#0A8A52' }
    if (valor>=10) return { status:'at', msg:'Moderado — eficiência razoável', cor:'#D97706' }
    return { status:'ru', msg:'Baixo — empresa pouco eficiente', cor:'#D63333' }
  }
  if (id==='divida') {
    if (valor<0) return { status:'ex', msg:'Empresa com caixa líquido positivo!', cor:'#076B3E' }
    if (valor<2) return { status:'ok', msg:'Bom — endividamento saudável', cor:'#0A8A52' }
    if (valor<3.5) return { status:'at', msg:'Atenção — endividamento moderado', cor:'#D97706' }
    return { status:'ru', msg:'Alto — endividamento preocupante', cor:'#D63333' }
  }
  if (id==='margem') {
    if (valor<=0) return { status:'neg', msg:'Margem negativa — empresa no prejuízo', cor:'#D63333' }
    if (valor>=20) return { status:'ex', msg:'Excelente — margem muito saudável', cor:'#076B3E' }
    if (valor>=10) return { status:'ok', msg:'Bom — margem dentro do esperado', cor:'#0A8A52' }
    if (valor>=5) return { status:'at', msg:'Atenção — margem apertada', cor:'#D97706' }
    return { status:'ru', msg:'Baixa — modelo de negócio pressionado', cor:'#D63333' }
  }
  return { status:'nd', msg:'—', cor:'#A8BDB5' }
}

function calcularVeredicto(checks) {
  const pontos = checks.reduce((acc, c) => {
    if (c.av.status==='ex') return acc+2
    if (c.av.status==='ok') return acc+1
    if (c.av.status==='at') return acc-0.5
    if (['ru','neg'].includes(c.av.status)) return acc-1.5
    return acc
  }, 0)
  const total = checks.filter(c=>c.av.status!=='nd').length * 2
  const pct = total>0 ? (pontos/total)*100 : 0
  const score = Math.round(Math.min(100, Math.max(0, pct)))
  if (pct>=70) return { label:'✅ Bom para Analisar', desc:'Indicadores fundamentalistas saudáveis. Aprofunde a análise antes de investir.', cor:'#076B3E', bg:'#DCFCE7', score }
  if (pct>=40) return { label:'⚠️ Atenção', desc:'Alguns indicadores preocupam. Analise os pontos negativos com cuidado.', cor:'#D97706', bg:'#FFF7ED', score }
  return { label:'🚫 Evitar por Ora', desc:'Múltiplos indicadores negativos. Não recomendado no momento.', cor:'#D63333', bg:'#FEF2F2', score }
}

function AnaliseFundamentalista({ card }) {
  const [ticker, setTicker] = useState('PETR4')
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)

  const buscar = async (tk) => {
    setLoading(true); setErro(null); setResultado(null)
    const t = tk.trim().toUpperCase()
    const headers = token ? { Authorization: 'Bearer '+token } : {}
    try {
      const [quoteResp, statsResp] = await Promise.all([
        fetch('https://brapi.dev/api/v2/stocks/quote?symbols='+t, { headers }),
        fetch('https://brapi.dev/api/v2/stocks/statistics?symbols='+t+'&mode=current', { headers }),
      ])
      const quoteJson = await quoteResp.json()
      const statsJson = statsResp.ok ? await statsResp.json() : null
      const quote = quoteJson?.results?.[0]?.data
      if (!quote) throw new Error('Ticker não encontrado. Verifique se o código está correto.')
      const stats = statsJson?.results?.[0]?.data
      const pl = stats?.trailingPE ?? null
      const pvp = stats?.priceToBook ?? null
      const roe = stats?.returnOnEquity != null ? stats.returnOnEquity*100 : null
      const dy = stats?.dividendYield ?? quote?.dividendYield ?? null
      const divEbitda = stats?.debtToEquity != null ? stats.debtToEquity/100 : null
      const margem = stats?.profitMargins != null ? stats.profitMargins*100 : null
      const checks = [
        { id:'pl', nome:'P/L — Preço / Lucro', valor:pl, un:'x', av:avaliarIndicador('pl',pl) },
        { id:'pvp', nome:'P/VP — Preço / Patrimônio', valor:pvp, un:'x', av:avaliarIndicador('pvp',pvp) },
        { id:'dy', nome:'Dividend Yield', valor:dy, un:'%', av:avaliarIndicador('dy',dy) },
        { id:'roe', nome:'ROE — Retorno sobre PL', valor:roe, un:'%', av:avaliarIndicador('roe',roe) },
        { id:'divida', nome:'Dívida Líquida / EBITDA', valor:divEbitda, un:'x', av:avaliarIndicador('divida',divEbitda) },
        { id:'margem', nome:'Margem Líquida', valor:margem, un:'%', av:avaliarIndicador('margem',margem) },
      ]
      setResultado({ quote, checks, veredicto:calcularVeredicto(checks), ticker:t })
    } catch(e) {
      setErro(e.message || 'Erro ao buscar dados. Tente novamente.')
    } finally { setLoading(false) }
  }

  const inp = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }

  return (
    <div>
      <div style={{ ...card, background:'#FFFBEB', border:'1px solid rgba(217,119,6,.2)', marginBottom:14 }}>
        <div style={{ fontSize:12.5, color:'#92702A', lineHeight:1.7 }}>
          ⚠️ Esta análise tem fins <strong>educativos</strong>. Os indicadores são referências e não constituem recomendação de compra ou venda. Realize sempre sua própria análise.
        </div>
      </div>

      <div style={{ ...card, marginBottom:14 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Análise Fundamentalista</div>
        <div style={{ display:'flex', gap:10, marginBottom:10 }}>
          <input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())} placeholder="Ticker (PETR4, MXRF11...)" maxLength={7} style={{...inp, flex:1, textTransform:'uppercase'}}/>
          <button onClick={()=>buscar(ticker)} disabled={loading} style={{ padding:'11px 24px', borderRadius:12, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:loading?'wait':'pointer', opacity:loading?0.7:1, flexShrink:0 }}>{loading ? '⏳ Analisando...' : '🔍 Analisar'}</button>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, color:'#A8BDB5', marginBottom:6 }}>Teste gratuito (sem token):</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {TICKERS_LIVRES.map(tk => (
              <button key={tk} onClick={()=>{ setTicker(tk); buscar(tk) }} style={{ padding:'5px 12px', borderRadius:16, border:'1px solid rgba(10,138,82,.2)', background:'#F0F9F4', color:'#076B3E', fontFamily:'Outfit,sans-serif', fontSize:11, fontWeight:600, cursor:'pointer' }}>{tk}</button>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid #F0F4F1', paddingTop:12 }}>
          <button onClick={()=>setShowToken(!showToken)} style={{ background:'none', border:'none', fontSize:11.5, color:'#6B8878', cursor:'pointer', fontFamily:'Outfit,sans-serif' }}>🔑 {showToken?'Ocultar':'Adicionar token brapi.dev'} — para analisar qualquer ação/FII {showToken?'▲':'▼'}</button>
          {showToken && (
            <div style={{ marginTop:10 }}>
              <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Cole seu token gratuito de brapi.dev" style={{...inp, fontSize:12}}/>
              <div style={{ fontSize:10.5, color:'#A8BDB5', marginTop:6, lineHeight:1.5 }}>Crie conta grátis em <strong>brapi.dev</strong> → gere o token → cole aqui. 500 consultas/mês no plano free — suficiente para uso diário.</div>
            </div>
          )}
        </div>
      </div>

      {erro && <div style={{ ...card, background:'#FEF2F2', border:'1px solid rgba(214,51,51,.2)', marginBottom:14 }}><div style={{ fontSize:13, color:'#D63333', fontWeight:600 }}>⚠️ {erro}</div>{!token && <div style={{ fontSize:11.5, color:'#D63333', marginTop:8, opacity:.8 }}>Adicione um token gratuito da brapi.dev para analisar qualquer ativo.</div>}</div>}

      {resultado && (
        <>
          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'#0D1F17' }}>{resultado.quote.shortName || resultado.ticker}</div>
                <div style={{ fontSize:11, color:'#6B8878', marginTop:2 }}>Ticker: {resultado.ticker}</div>
              </div>
              {resultado.quote.logourl && <img src={resultado.quote.logourl} alt="" style={{ width:44, height:44, borderRadius:12, objectFit:'contain' }}/>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div style={{ background:'linear-gradient(135deg,#022818,#076B3E)', borderRadius:14, padding:'14px 16px', color:'#fff' }}>
                <div style={{ fontSize:9.5, opacity:.6, textTransform:'uppercase', marginBottom:4 }}>Cotação Atual</div>
                <div style={{ fontSize:18, fontWeight:800 }}>R$ {Number(resultado.quote.regularMarketPrice||0).toFixed(2)}</div>
                {resultado.quote.regularMarketChangePercent!=null && <div style={{ fontSize:11, marginTop:3, color:resultado.quote.regularMarketChangePercent>=0?'#86EFAC':'#FCA5A5' }}>{resultado.quote.regularMarketChangePercent>=0?'▲':'▼'} {Math.abs(resultado.quote.regularMarketChangePercent).toFixed(2)}% hoje</div>}
              </div>
              <div style={{ background:'#EFF6FF', borderRadius:14, padding:'14px 16px' }}>
                <div style={{ fontSize:9.5, color:'#6B8878', textTransform:'uppercase', marginBottom:4 }}>Valor de Mercado</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#1D6FA4' }}>{resultado.quote.marketCap ? 'R$ '+(resultado.quote.marketCap/1e9).toFixed(1)+'bi' : '—'}</div>
              </div>
            </div>
          </div>

          <div style={{ ...card, background:resultado.veredicto.bg, border:'1.5px solid '+resultado.veredicto.cor+'40', marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontSize:15, fontWeight:800, color:resultado.veredicto.cor }}>{resultado.veredicto.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:resultado.veredicto.cor }}>{resultado.veredicto.score}/100</div>
            </div>
            <div style={{ fontSize:12.5, color:resultado.veredicto.cor, lineHeight:1.6, marginBottom:12 }}>{resultado.veredicto.desc}</div>
            <div style={{ height:8, background:'rgba(0,0,0,.08)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:resultado.veredicto.score+'%', background:resultado.veredicto.cor, borderRadius:4, transition:'width .6s ease' }}/>
            </div>
          </div>

          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>Checklist Fundamentalista</div>
            {resultado.checks.map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:i<resultado.checks.length-1?'1px solid #F0F4F1':'none' }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:c.av.cor, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'#0D1F17' }}>{c.nome}</div>
                  <div style={{ fontSize:11, color:c.av.cor, fontWeight:500, marginTop:2 }}>{c.av.msg}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:800, color:c.av.status==='nd'?'#A8BDB5':'#0D1F17', textAlign:'right', flexShrink:0 }}>
                  {c.valor!=null && !isNaN(c.valor) ? Number(c.valor).toFixed(2)+c.un : '—'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...card, padding:'14px 18px' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:10 }}>Legenda dos Indicadores</div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              {[{cor:'#076B3E',l:'Excelente'},{cor:'#0A8A52',l:'Bom'},{cor:'#D97706',l:'Atenção'},{cor:'#D63333',l:'Ruim'},{cor:'#A8BDB5',l:'Sem dados'}].map((leg,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:leg.cor }}/>
                  <span style={{ color:leg.cor, fontWeight:600 }}>{leg.l}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
