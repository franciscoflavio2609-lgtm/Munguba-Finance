import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import MungubaTree from '../ui/MungubaTree'

const QUICK = [
  'Quanto gastei este mês?',
  'Estou no caminho certo para minhas metas?',
  'Onde posso cortar gastos?',
  'O que é Tesouro Direto?',
  'Como funciona um FII?',
  'Como montar reserva de emergência?',
]

// Base de conhecimento local — usada como fallback se a IA estiver indisponível
const KB = [
  {
    keys: ['tesouro','selic','tesouro selic'],
    answer: `O **Tesouro Selic** é o título público mais seguro e líquido do Brasil — ideal para a reserva de emergência.

🏦 **Como funciona:**
Você empresta dinheiro ao governo federal e recebe juros equivalentes à taxa Selic. A rentabilidade é diária e o resgate pode ser feito a qualquer momento.

📊 **Características:**
• Risco: baixíssimo (garantido pelo governo)
• Liquidez: resgate em D+1 útil
• Valor mínimo: a partir de R$ 30
• Indicado para: reserva de emergência

Quer saber mais sobre outros títulos do Tesouro Direto?`
  },
  {
    keys: ['fii','fundos imobiliários','fundo imobiliario','fundo imobiliário'],
    answer: `Os **FIIs (Fundos de Investimento Imobiliário)** permitem investir no mercado imobiliário sem comprar um imóvel inteiro.

🏢 **Como funciona:**
Você compra cotas na bolsa (B3) e recebe dividendos mensais isentos de IR.

📊 **Tipos:** Tijolo (imóveis físicos), Papel (CRIs/LCIs), Híbrido

💰 Dividend yield médio: 8% a 12% ao ano, isentos de IR.`
  },
  {
    keys: ['reserva','emergência','emergencia'],
    answer: `A **reserva de emergência** é o alicerce de qualquer planejamento financeiro.

🎯 **Quanto guardar:**
• CLT: 3 a 6 meses de gastos
• Autônomo: 6 a 12 meses de gastos

🏦 **Onde guardar:** Tesouro Selic ou CDB com liquidez diária — nunca em ações ou poupança.`
  },
]

const findLocalAnswer = (msg) => {
  const lower = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return item.answer
    }
  }
  return null
}

const formatMsg = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

// Monta um resumo financeiro real do usuário para dar contexto à IA
function buildFinancialContext(state, calcStats) {
  const { inc, exp, bal } = calcStats()
  const txns = state.transactions || []
  const invs = state.investments || []
  const drms = state.dreams || []

  if (txns.length === 0 && invs.length === 0) {
    return null // usuário novo, sem dados ainda
  }

  const bycat = {}
  txns.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat] || 0) + Number(t.val || 0)
  })
  const gastosPorCategoria = Object.entries(bycat)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 5)
    .map(([cat, val]) => `${cat}: R$ ${val.toFixed(2)}`)
    .join(', ')

  const totInv = invs.reduce((a,i) => a + Number(i.val||0), 0)

  const metasResumo = drms.slice(0, 3).map(d => {
    const pct = d.target > 0 ? Math.round((Number(d.saved||0) / Number(d.target||1)) * 100) : 0
    return `"${d.nm}": ${pct}% concluído (R$${d.saved||0} de R$${d.target||0})`
  }).join('; ')

  return `
- Receita do mês: R$ ${inc.toFixed(2)}
- Despesas do mês: R$ ${exp.toFixed(2)}
- Saldo do mês: R$ ${bal.toFixed(2)}
- Total de transações registradas: ${txns.length}
- Maiores categorias de gasto: ${gastosPorCategoria || 'nenhuma ainda'}
- Total investido: R$ ${totInv.toFixed(2)}
- Número de investimentos diferentes: ${invs.length}
- Metas/Sonhos ativos: ${metasResumo || 'nenhum ainda'}
`.trim()
}

export default function ChatScreen() {
  const { state, calcStats } = useApp()
  const [msgs, setMsgs] = useState([{
    from:'bot',
    text:'Olá! Sou o **Assistente Munguba** 🌳\n\nAgora posso analisar seus dados financeiros reais! Pergunte sobre seus gastos, suas metas, ou qualquer dúvida sobre investimentos e educação financeira.\n\nComo posso te ajudar hoje?'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiIndisponivel, setAiIndisponivel] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const send = async (text) => {
    if (!text.trim()) return
    const question = text.trim()
    setMsgs(m => [...m, { from:'user', text:question }])
    setInput('')
    setLoading(true)

    const context = buildFinancialContext(state, calcStats)

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, context }),
      })

      if (!resp.ok) throw new Error('API indisponível')
      const data = await resp.json()
      setMsgs(m => [...m, { from:'bot', text: data.reply }])
      setAiIndisponivel(false)
    } catch (e) {
      // Fallback: tenta responder com a base local de conhecimento
      setAiIndisponivel(true)
      const localAnswer = findLocalAnswer(question)
      setMsgs(m => [...m, {
        from:'bot',
        text: localAnswer || `No momento não consigo acessar a IA completa, mas aqui vai o que sei: sou especialista em Tesouro Direto, FIIs, reserva de emergência e outros temas financeiros. Tente reformular sua pergunta ou pergunte sobre um desses temas!`
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', animation:'vIn .26s ease' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'18px 20px', color:'#fff', marginBottom:14, display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
        <MungubaTree size={44} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700 }}>Assistente Munguba</div>
          <div style={{ fontSize:11, opacity:.7, marginTop:2 }}>
            {aiIndisponivel ? '⚠️ Modo offline · Base de conhecimento local' : '● Online · Analisa seus dados reais'}
          </div>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ marginBottom:12, flexShrink:0 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:8 }}>Perguntas sugeridas</div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {QUICK.map((q,i) => (
            <button key={i} onClick={() => send(q)} disabled={loading} style={{
              padding:'7px 13px', borderRadius:20,
              border:'1.5px solid rgba(10,138,82,.25)',
              background:'#fff', color:'#076B3E',
              fontFamily:'Outfit,sans-serif', fontSize:11,
              fontWeight:600, cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition:'all .18s'
            }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingBottom:8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start', gap:8 }}>
            {m.from==='bot' && (
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#044D2C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:4 }}>
                <MungubaTree size={20} />
              </div>
            )}
            <div style={{
              maxWidth:'76%', padding:'12px 16px',
              borderRadius:m.from==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
              background:m.from==='user'?'#076B3E':'#fff',
              color:m.from==='user'?'#fff':'#0D1F17',
              fontSize:13, lineHeight:1.7,
              boxShadow:'0 1px 4px rgba(4,77,44,.08)',
              border:m.from==='bot'?'1px solid rgba(10,138,82,.12)':'none',
            }} dangerouslySetInnerHTML={{ __html: formatMsg(m.text) }}/>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#044D2C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <MungubaTree size={20} />
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'18px 18px 18px 4px', background:'#fff', border:'1px solid rgba(10,138,82,.12)' }}>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#0A8A52', animation:`pulse 1.2s ${i*0.2}s infinite` }}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid rgba(10,138,82,.12)', flexShrink:0 }}>
        <input
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && !loading && send(input)}
          placeholder="Pergunte sobre suas finanças..."
          disabled={loading}
          style={{ flex:1, border:'1.5px solid rgba(10,138,82,.25)', borderRadius:14, padding:'12px 16px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', background:'#F0F9F4', color:'#0D1F17' }}
        />
        <button onClick={()=>send(input)} disabled={loading} style={{ padding:'12px 20px', borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
