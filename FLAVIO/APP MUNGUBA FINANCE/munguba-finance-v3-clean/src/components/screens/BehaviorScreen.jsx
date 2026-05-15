import { useState } from 'react'

const TRAPS = [
  { icon:'🎯', title:'Viés do Presente', desc:'Preferir R$100 hoje a R$120 daqui 30 dias, mesmo que 20% de retorno seja excelente.', tip:'Antes de gastar, pergunte: "Esse gasto serve ao meu eu futuro ou só ao meu eu agora?"' },
  { icon:'🪤', title:'Armadilha do Sunk Cost', desc:'Continuar num investimento ruim só porque já colocou dinheiro. O passado não volta.', tip:'O que importa é o futuro, não o que já gastou. Corte o prejuízo quando necessário.' },
  { icon:'📺', title:'Efeito da Ancoragem', desc:'Achar que R$500 é barato porque o produto ao lado custa R$2.000.', tip:'Compare sempre com o valor que você realmente precisaria pagar — não com o preço original.' },
  { icon:'🐑', title:'Comportamento de Manada', desc:'Comprar ações porque todos estão comprando. Na alta, a festa já acabou.', tip:'Warren Buffett: "Seja ganancioso quando os outros têm medo, e com medo quando os outros são gananciosos."' },
  { icon:'🔮', title:'Excesso de Confiança', desc:'Achar que você vai escolher as melhores ações sem estudar. 90% dos investidores perdem para o índice.', tip:'ETFs de índice batem a maioria dos investidores ativos no longo prazo. Simplicidade vence.' },
  { icon:'💊', title:'Ilusão do Dinheiro', desc:'Se preocupar com o preço nominal e esquecer a inflação. R$1.000 em 2010 ≠ R$1.000 hoje.', tip:'Sempre meça em poder de compra real. Investimento que rende menos que IPCA está perdendo valor.' },
]

const QUIZ = [
  { q:'Você recebe R$500 de bônus inesperado. O que faz?', opts:['Gasto em algo que quero há tempos','Guardo na reserva de emergência','Invisto no Tesouro Selic','Divido: 30% lazer + 70% reserva'], right:3 },
  { q:'Seu investimento caiu 15%. O que faz?', opts:['Vendo tudo imediatamente','Fico paralisado de medo','Avalio os fundamentos e mantenho se ainda faz sentido','Compro mais na baixa sem analisar'], right:2 },
  { q:'Qual a ordem certa das prioridades financeiras?', opts:['Investir → Guardar → Pagar contas','Pagar contas → Investir → Guardar','Pagar contas → Reserva de emergência → Investir','Guardar → Investir → Pagar contas'], right:2 },
]

export default function BehaviorScreen() {
  const [quizIdx, setQuizIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const pick = (i) => {
    if (chosen !== null) return
    setChosen(i)
    if (i === QUIZ[quizIdx].right) setScore(s => s+1)
  }

  const next = () => {
    if (quizIdx < QUIZ.length-1) { setQuizIdx(q=>q+1); setChosen(null) }
    else setDone(true)
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)', marginBottom:16 }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ ...card, background:'linear-gradient(130deg,#1E1B4B,#4338CA)', border:'none' }}>
        <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:6 }}>Neurociência Financeira</div>
        <div style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:6 }}>Economia Comportamental</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.72)', lineHeight:1.6 }}>Entenda como seu cérebro sabota suas finanças — e como vencer esses padrões.</div>
      </div>

      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>As 6 armadilhas mentais do dinheiro</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {TRAPS.map((t,i) => (
            <div key={i} style={{ background:'#F8FDF9', borderRadius:16, padding:14, border:'1px solid rgba(10,138,82,.1)' }}>
              <div style={{ fontSize:20, marginBottom:8 }}>{t.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0D1F17', marginBottom:4 }}>{t.title}</div>
              <div style={{ fontSize:11, color:'#6B8878', lineHeight:1.55, marginBottom:8 }}>{t.desc}</div>
              <div style={{ fontSize:11, color:'#076B3E', fontWeight:600, background:'#E8F5EE', padding:'7px 10px', borderRadius:10, lineHeight:1.5 }}>💡 {t.tip}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>
          {done ? '✅ Quiz concluído!' : `Quiz Financeiro — Pergunta ${quizIdx+1} de ${QUIZ.length}`}
        </div>
        {done ? (
          <div style={{ textAlign:'center', padding:24 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>{score===3?'🏆':score===2?'🎯':'📚'}</div>
            <div style={{ fontSize:18, fontWeight:800, color:'#0D1F17', marginBottom:6 }}>Você acertou {score} de {QUIZ.length}!</div>
            <div style={{ fontSize:13, color:'#6B8878', marginBottom:16 }}>{score===3?'Excelente! Você tem ótima mentalidade financeira.':score===2?'Bom resultado! Continue estudando.':'Continue aprendendo — o conhecimento é o melhor investimento.'}</div>
            <button onClick={()=>{setQuizIdx(0);setChosen(null);setScore(0);setDone(false)}} style={{ padding:'11px 24px', borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Fazer novamente</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize:14, fontWeight:600, color:'#0D1F17', marginBottom:14, lineHeight:1.5 }}>{QUIZ[quizIdx].q}</div>
            {QUIZ[quizIdx].opts.map((opt,i) => {
              const isRight = i === QUIZ[quizIdx].right
              const isPicked = chosen === i
              let bg = '#F8FDF9', border = '1px solid rgba(10,138,82,.12)', col = '#0D1F17'
              if (chosen !== null) {
                if (isRight) { bg='#DCFCE7'; border='1.5px solid #076B3E'; col='#076B3E' }
                else if (isPicked) { bg='#FEF2F2'; border='1.5px solid #D63333'; col='#D63333' }
              }
              return (
                <div key={i} onClick={() => pick(i)} style={{ padding:'11px 14px', borderRadius:12, marginBottom:8, background:bg, border, color:col, fontSize:13, fontWeight:500, cursor:chosen===null?'pointer':'default', transition:'all .18s' }}>
                  {isPicked && '→ '}{opt}
                  {chosen !== null && isRight && ' ✓'}
                </div>
              )
            })}
            {chosen !== null && (
              <button onClick={next} style={{ marginTop:8, width:'100%', padding:12, borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                {quizIdx < QUIZ.length-1 ? 'Próxima pergunta →' : 'Ver resultado →'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
