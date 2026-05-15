import { useState, useRef, useEffect } from 'react'
import MungubaTree from '../ui/MungubaTree'

const QUICK = ['Como organizar meu orçamento?','O que é Tesouro Direto?','Como sair das dívidas?','Vale a pena investir em FIIs?','Quanto guardar de reserva?']

const CANNED = {
  'orçamento': 'Para organizar seu orçamento, use a regra **50-30-20**: 50% para necessidades (moradia, alimentação), 30% para desejos (lazer, restaurantes) e 20% para poupança e investimentos. O Munguba Finance já tem a aba de Orçamentos para você controlar isso automaticamente! 📊',
  'tesouro': 'O Tesouro Direto é a forma mais segura de investir no Brasil — você empresta dinheiro para o governo e recebe de volta com juros. Para iniciantes, o **Tesouro Selic** é perfeito: rende ~13% ao ano, tem liquidez diária e é garantido pelo governo federal. É ideal para a reserva de emergência! 🏦',
  'dívida': 'Para sair das dívidas, existem 2 estratégias principais:\n\n**1. Avalanche**: pague primeiro a dívida com maior juros — matematicamente mais eficiente.\n**2. Bola de neve**: pague primeiro a menor dívida — psicologicamente motivante.\n\nRecomendo começar pela dívida do cartão de crédito, que costuma ter os juros mais altos (até 400% ao ano!). 💳',
  'fii': 'FIIs (Fundos de Investimento Imobiliário) são ótimos para renda passiva! Você compra "cotas" de imóveis como shoppings e galpões, e recebe **dividendos mensais isentos de IR**. O HGLG11 (logística) e MXRF11 (papel) são opções populares com yield de 9-11% ao ano. Veja na aba Investimentos! 🏢',
  'reserva': 'A reserva de emergência deve ter entre **3 e 6 meses** dos seus gastos mensais. Se você gasta R$3.000/mês, precisa de R$9.000 a R$18.000 guardados em Tesouro Selic ou CDB com liquidez diária. É a base de qualquer planejamento financeiro sólido! 🛡️',
}

const findAnswer = (msg) => {
  const lower = msg.toLowerCase()
  if (lower.includes('orçamento') || lower.includes('organizar') || lower.includes('gastar')) return CANNED['orçamento']
  if (lower.includes('tesouro') || lower.includes('invest')) return CANNED['tesouro']
  if (lower.includes('dívida') || lower.includes('divida') || lower.includes('débito')) return CANNED['dívida']
  if (lower.includes('fii') || lower.includes('imobiliário') || lower.includes('dividendo')) return CANNED['fii']
  if (lower.includes('reserva') || lower.includes('emergência') || lower.includes('guardar')) return CANNED['reserva']
  return 'Ótima pergunta! Como assistente financeiro do Munguba Finance, posso te ajudar com orçamentos, investimentos, reserva de emergência, dívidas e planejamento financeiro. Me conte mais sobre o que você quer entender! 🌳'
}

export default function ChatScreen() {
  const [msgs, setMsgs] = useState([
    { from:'bot', text:'Olá! Sou o assistente do Munguba Finance 🌳 Estou aqui para te ajudar com suas dúvidas financeiras. Como posso te ajudar hoje?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const send = (text) => {
    if (!text.trim()) return
    const question = text.trim()
    setMsgs(m => [...m, { from:'user', text:question }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMsgs(m => [...m, { from:'bot', text:findAnswer(question) }])
      setLoading(false)
    }, 900)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', animation:'vIn .26s ease' }}>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
        <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'20px 22px', color:'#fff', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
          <MungubaTree size={48} />
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>Assistente Munguba</div>
            <div style={{ fontSize:11, opacity:.7, marginTop:2 }}>● Online — resposta em segundos</div>
          </div>
        </div>

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:8 }}>Perguntas rápidas</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {QUICK.map((q,i) => (
              <button key={i} onClick={() => send(q)} style={{ padding:'7px 13px', borderRadius:20, border:'1.5px solid rgba(10,138,82,.25)', background:'#fff', color:'#076B3E', fontFamily:'Outfit,sans-serif', fontSize:11, fontWeight:600, cursor:'pointer' }}>{q}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start', gap:8 }}>
              {m.from==='bot' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#044D2C', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:4 }}>
                  <MungubaTree size={20} />
                </div>
              )}
              <div style={{
                maxWidth:'72%', padding:'11px 15px', borderRadius:m.from==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                background:m.from==='user'?'#076B3E':'#fff',
                color:m.from==='user'?'#fff':'#0D1F17',
                fontSize:13, lineHeight:1.65,
                boxShadow:'0 1px 4px rgba(4,77,44,.08)',
                border:m.from==='bot'?'1px solid rgba(10,138,82,.12)':'none',
                whiteSpace:'pre-wrap'
              }}>
                {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
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
      </div>

      <div style={{ display:'flex', gap:10, paddingTop:14, borderTop:'1px solid rgba(10,138,82,.12)' }}>
        <input
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send(input)}
          placeholder="Pergunte sobre finanças..."
          style={{ flex:1, border:'1.5px solid rgba(10,138,82,.25)', borderRadius:14, padding:'12px 16px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', background:'#F0F9F4', color:'#0D1F17' }}
        />
        <button onClick={()=>send(input)} style={{ padding:'12px 20px', borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Enviar</button>
      </div>
    </div>
  )
}
