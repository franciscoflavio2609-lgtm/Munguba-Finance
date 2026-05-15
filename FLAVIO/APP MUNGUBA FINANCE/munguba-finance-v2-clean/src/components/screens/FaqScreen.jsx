import { useState } from 'react'

const FAQS = [
  { q:'Como calculo minha reserva de emergência?', a:'Multiplique seus gastos mensais totais por 3 (mínimo) ou 6 (ideal). Exemplos: gastos de R$3.000/mês → reserva de R$9.000 a R$18.000. Para autônomos e empreendedores, o ideal é ter 6 a 12 meses guardados, pois a renda é mais variável.' },
  { q:'Qual a diferença entre poupar e investir?', a:'Poupar é guardar dinheiro de forma segura (poupança, Tesouro Selic) para proteger o poder de compra. Investir é alocar capital para obter retornos acima da inflação, aceitando algum grau de risco. O ideal: primeiro construa a reserva (poupar), depois invista o excedente.' },
  { q:'Devo pagar dívidas ou investir primeiro?', a:'Depende dos juros. Se a dívida tem juros acima de 12% ao ano (cartão de crédito, cheque especial), pague primeiro. Se tem juros abaixo disso (financiamento imobiliário, empréstimo pessoal barato), pode valer a pena investir em paralelo. Nunca invista com dívidas no cartão.' },
  { q:'O que é o sistema 50-30-20?', a:'É um método simples de orçamento: 50% da sua renda vai para necessidades básicas (moradia, alimentação, saúde), 30% para desejos (lazer, restaurantes, assinaturas) e 20% obrigatoriamente para poupança e investimentos. Ajuste conforme sua realidade.' },
  { q:'Tesouro Direto é seguro?', a:'É o investimento mais seguro do Brasil — garantido pelo governo federal. O Tesouro Selic é ideal para a reserva de emergência por ter liquidez diária e seguir a taxa básica de juros. Em caso de falência do banco custodiante, seu dinheiro continua protegido.' },
  { q:'O que são FIIs e como funcionam?', a:'FIIs são fundos que investem em imóveis (shoppings, galpões, hospitais) ou em papéis de dívida imobiliária. Você compra cotas na bolsa e recebe dividendos mensais isentos de IR. É uma forma de ter "renda de aluguel" sem precisar comprar um imóvel inteiro.' },
  { q:'O que é Simples Nacional?', a:'É um regime tributário simplificado para empresas com faturamento anual de até R$4,8 milhões. Unifica vários impostos em um único pagamento mensal, calculado sobre o faturamento bruto. As alíquotas variam conforme o setor (comércio, serviços, indústria).' },
  { q:'Como separar as finanças pessoais das do negócio?', a:'Abra uma conta PJ separada, pague um pró-labore fixo para si mesmo (como se fosse salário) e nunca use o dinheiro da empresa para despesas pessoais. Isso facilita o controle, o pagamento de impostos e a análise da saúde financeira do negócio.' },
]

export default function FaqScreen() {
  const [open, setOpen] = useState(null)
  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ ...card, background:'linear-gradient(130deg,#B45309,#D97706)', border:'none', color:'#fff', marginBottom:18 }}>
        <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.7, marginBottom:6 }}>Central de Dúvidas</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Tira-Dúvidas Financeiro</div>
        <div style={{ fontSize:13, opacity:.8, lineHeight:1.6 }}>Respostas claras para as perguntas mais comuns sobre dinheiro, investimentos e finanças pessoais.</div>
      </div>

      <div style={card}>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom:i<FAQS.length-1?'1px solid #F0F4F1':'none' }}>
              <div onClick={() => setOpen(open===i?null:i)} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 0', cursor:'pointer', gap:12
              }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#0D1F17', lineHeight:1.4, flex:1 }}>{faq.q}</span>
                <span style={{ fontSize:18, color:'#076B3E', flexShrink:0, transition:'transform .2s', transform:open===i?'rotate(45deg)':'rotate(0)' }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding:'0 0 14px 0', fontSize:13, color:'#2E4A3A', lineHeight:1.75, animation:'vIn .2s ease' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
