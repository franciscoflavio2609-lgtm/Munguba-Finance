import { useState, useRef, useEffect } from 'react'
import MungubaTree from '../ui/MungubaTree'

const QUICK = [
  'O que é Tesouro Direto?',
  'Como funciona um FII?',
  'O que é uma ação?',
  'Como montar reserva de emergência?',
  'O que é CDI?',
  'Renda fixa x renda variável?',
  'O que é dividend yield?',
  'Como declarar investimentos no IR?',
]

const KB = [
  {
    keys: ['tesouro','selic','tesouro selic'],
    answer: `O **Tesouro Selic** é o título público mais seguro e líquido do Brasil — ideal para a reserva de emergência.

🏦 **Como funciona:**
Você empresta dinheiro ao governo federal e recebe juros equivalentes à taxa Selic, que está em torno de 13,75% ao ano. A rentabilidade é diária e o resgate pode ser feito a qualquer momento.

📊 **Características principais:**
• Risco: baixíssimo (garantido pelo governo)
• Liquidez: resgate em D+1 útil
• Valor mínimo: a partir de R$ 30
• Imposto de renda: tabela regressiva (22,5% a 15%)
• Indicado para: reserva de emergência e objetivos de curto prazo

💡 **Exemplo prático:**
R$ 10.000 no Tesouro Selic a 13,75% ao ano = aproximadamente R$ 1.375 brutos em 12 meses. Descontando IR (17,5%) = ~R$ 1.134 líquidos.

⚠️ **Atenção:** Não confunda com a Poupança, que rende menos e tem liquidez limitada. O Tesouro Selic é superior em todos os aspectos.

Quer saber mais sobre outros títulos do Tesouro Direto?`
  },
  {
    keys: ['fii','fundos imobiliários','fundo imobiliario','fundo imobiliário'],
    answer: `Os **FIIs (Fundos de Investimento Imobiliário)** são uma forma de investir no mercado imobiliário sem precisar comprar um imóvel inteiro.

🏢 **Como funciona:**
Você compra cotas na bolsa (B3) e se torna sócio de um portfólio de imóveis ou papéis imobiliários. Mensalmente recebe dividendos proporcionais às cotas que possui.

📊 **Tipos de FIIs:**
• **Tijolo:** investem em imóveis físicos (shoppings, galpões, hospitais, escritórios)
• **Papel:** investem em CRIs e LCIs (renda fixa imobiliária)
• **Híbrido:** combinam os dois tipos
• **FOF:** fundos que investem em outros FIIs

💰 **Vantagens:**
• Dividendos mensais isentos de IR para pessoa física
• Acessível a partir de R$ 10 por cota
• Alta liquidez (vende na bolsa como ação)
• Diversificação automática do portfólio

⚠️ **Riscos:**
• Valor das cotas oscila (risco de mercado)
• Vacância dos imóveis pode reduzir dividendos
• Gestão depende do administrador do fundo

🎯 **FIIs populares:**
HGLG11 (logística), MXRF11 (papel), KNRI11 (híbrido), VISC11 (shoppings)

Dividend yield médio do mercado: 8% a 12% ao ano, isentos de IR.`
  },
  {
    keys: ['ação','ações','o que é ação','o que é uma ação'],
    answer: `Uma **ação** é uma fração do capital social de uma empresa — ao comprar, você se torna sócio dela.

📈 **Como funciona:**
Empresas de capital aberto dividem seu patrimônio em milhões de ações negociadas na bolsa (B3). O preço oscila conforme desempenho da empresa, expectativas do mercado e cenário econômico.

🏷️ **Tipos de ações:**
• **ON (Ordinária):** dá direito a voto nas assembleias. Símbolo: terminam em 3 (ex: VALE3, PETR3)
• **PN (Preferencial):** prioridade no recebimento de dividendos, sem voto. Símbolo: terminam em 4 (ex: ITSA4, BBDC4)
• **Units:** combinação de ON e PN. Terminam em 11 (ex: SANB11)

💰 **Como ganhar dinheiro com ações:**
• **Valorização:** comprar barato e vender mais caro
• **Dividendos:** parte do lucro distribuída aos acionistas
• **JCP (Juros sobre Capital Próprio):** outra forma de distribuição de lucro

📊 **Indicadores importantes:**
• **P/L (Preço/Lucro):** quanto o mercado paga por R$1 de lucro
• **Dividend Yield:** dividendos ÷ preço da ação (%)
• **ROE:** retorno sobre patrimônio líquido
• **P/VP:** preço sobre valor patrimonial

⚠️ **Risco:**
Ações são renda variável — o preço pode cair. Invista apenas o que não precisará no curto prazo e diversifique sempre.`
  },
  {
    keys: ['reserva','emergência','emergencia','reserva de emergência'],
    answer: `A **reserva de emergência** é o alicerce de qualquer planejamento financeiro sólido. Sem ela, qualquer imprevisto pode destruir anos de planejamento.

🎯 **Quanto guardar:**
• **Empregado CLT:** 3 a 6 meses de gastos
• **Autônomo/MEI:** 6 a 12 meses de gastos
• **Empresário:** 12 meses de gastos

📊 **Exemplo prático:**
Gastos mensais de R$ 3.000:
• CLT: R$ 9.000 a R$ 18.000
• Autônomo: R$ 18.000 a R$ 36.000

🏦 **Onde guardar:**
1. **Tesouro Selic** — melhor opção: seguro, líquido, rentável (~13% a.a.)
2. **CDB com liquidez diária** — bancos digitais oferecem 100% do CDI
3. **Conta remunerada** — Nubank, Inter, C6 Bank

❌ **Onde NÃO guardar:**
• Poupança (rende menos que o IPCA)
• Ações ou FIIs (muito voláteis)
• CDB sem liquidez (você pode precisar antes do prazo)

🗓️ **Como construir:**
Separe 10% a 20% da renda todo mês. Com R$ 500/mês, em 18 meses você tem R$ 9.000 investidos mais os juros. Automatize a transferência para não esquecer.`
  },
  {
    keys: ['cdi','taxa cdi','o que é cdi'],
    answer: `O **CDI (Certificado de Depósito Interbancário)** é a taxa de juros que os bancos cobram entre si para empréstimos de curtíssimo prazo.

📊 **Na prática:**
O CDI acompanha de perto a taxa Selic. Se a Selic está em 13,75% ao ano, o CDI fica em torno de 13,65% ao ano. Por isso você vê investimentos como "100% do CDI" ou "110% do CDI".

💡 **Como usar o CDI como referência:**
• CDB a 100% CDI = rentabilidade similar ao Tesouro Selic
• CDB a 110% CDI = rende mais que o Tesouro Selic (mas pode ter menor liquidez)
• LCI/LCA a 90% CDI isentas de IR = equivale a ~105% CDI tributado

🧮 **Exemplo de comparação:**
Investimento A: CDB 100% CDI (com IR)
Investimento B: LCI 90% CDI (sem IR)

Para prazo de 1 ano:
• A: 13,65% × 0,825 (desconto IR 17,5%) = 11,26% líquido
• B: 13,65% × 0,90 = 12,29% líquido ← melhor!

A LCI/LCA é isenta de IR para pessoa física, então mesmo com percentual menor do CDI, pode ser mais vantajosa.

Use o CDI como régua: qualquer investimento de renda fixa deve superar 100% do CDI para valer a pena.`
  },
  {
    keys: ['renda fixa','renda variável','diferença','fixo','variável'],
    answer: `**Renda Fixa vs Renda Variável** — entender a diferença é o primeiro passo para investir bem.

📌 **Renda Fixa:**
Você sabe (ou tem boa previsão de) quanto vai receber no vencimento. O emissor promete uma taxa de retorno.

Exemplos:
• Tesouro Direto (governo)
• CDB (bancos)
• LCI / LCA (imobiliário / agronegócio)
• Debêntures (empresas)
• CRI / CRA

Características: menor risco, retorno previsível, ideal para reserva e objetivos de curto/médio prazo.

📈 **Renda Variável:**
O retorno não é garantido — pode ser positivo, negativo ou zero. O preço oscila conforme o mercado.

Exemplos:
• Ações (VALE3, ITUB4...)
• FIIs (HGLG11, MXRF11...)
• ETFs (BOVA11, IVVB11...)
• Criptomoedas
• Fundos de ações

Características: maior risco, potencial de retorno maior no longo prazo, ideal para objetivos de longo prazo (5+ anos).

🎯 **Como equilibrar:**
A proporção ideal depende do seu perfil e horizonte de tempo. Uma regra prática: subtraia sua idade de 100 — esse é o percentual sugerido em renda variável.

Exemplo: 30 anos → 70% renda variável, 30% renda fixa.`
  },
  {
    keys: ['dividend yield','dividendo','dividendos'],
    answer: `**Dividend Yield (DY)** é um dos indicadores mais importantes para investidores de renda passiva.

📊 **Fórmula:**
Dividend Yield = (Dividendos pagos no ano ÷ Preço atual da ação) × 100

**Exemplo prático:**
Ação XYZ custa R$ 20 e pagou R$ 2 em dividendos no último ano.
DY = (2 ÷ 20) × 100 = **10% ao ano**

🏢 **Por que é importante:**
Um DY alto pode indicar empresa geradora de caixa consistente — ótimo para renda passiva. Mas cuidado: DY muito alto pode indicar queda no preço da ação (o que não é positivo).

🏆 **Empresas com histórico de bons dividendos no Brasil:**
• Bancos: ITSA4, BBDC4, BBAS3
• Energia: TAEE11, ENGI11, CPFE3
• Utilities: TRPL4, EGIE3
• Seguros: BBSE3

💡 **Para FIIs:**
O DY é ainda mais relevante pois os dividendos são isentos de IR. FIIs com DY de 8% a 12% ao ano são considerados atrativos.

⚠️ **Não olhe só o DY:**
Analise também crescimento dos dividendos, payout ratio, solidez financeira da empresa e perspectivas do setor.`
  },
  {
    keys: ['imposto','ir','declarar','declaração'],
    answer: `**Como declarar investimentos no Imposto de Renda** — guia prático para não errar.

📋 **O que declarar:**
Todos os investimentos com saldo superior a R$ 140 devem ser declarados na ficha "Bens e Direitos".

🗂️ **Por tipo de investimento:**

**Tesouro Direto / CDB / LCI / LCA:**
• Ficha: Bens e Direitos → Grupo 04 (Aplicações e Investimentos)
• O imposto é retido na fonte automaticamente (exceto LCI/LCA)
• O informe de rendimentos é enviado pela corretora/banco

**Ações:**
• Vendas até R$ 20.000/mês são isentas de IR
• Acima disso: 15% sobre o lucro (swing trade) ou 20% (day trade)
• Declare na ficha "Renda Variável" → "Operações Comuns/Day Trade"
• Prejuízo pode ser compensado com lucros futuros

**FIIs:**
• Dividendos são isentos de IR para pessoa física
• Ganho de capital na venda: 20% sobre o lucro
• Declare em "Renda Variável" → "Fundos de Investimento Imobiliário"

**Dividendos de ações:**
• Atualmente isentos de IR (pode mudar com reforma tributária)

📅 **Prazo:** Normalmente de março a maio de cada ano.

💡 **Dica:** Use o programa da Receita Federal (IRPF) e importe automaticamente os informes de rendimento da sua corretora.`
  },
]

const findAnswer = (msg) => {
  const lower = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return item.answer
    }
  }
  if (lower.includes('orcamento') || lower.includes('orçamento') || lower.includes('organizar') || lower.includes('gastar')) {
    return `**Como organizar seu orçamento** — método 50-30-20

Este é um dos métodos mais eficazes e simples de controle financeiro:

📊 **Divisão da renda líquida:**
• **50% — Necessidades:** moradia, alimentação, transporte, saúde, contas básicas
• **30% — Desejos:** lazer, restaurantes, streaming, roupas, viagens
• **20% — Futuro:** poupança, investimentos, reserva de emergência, dívidas

**Exemplo com R$ 5.000 líquidos:**
• Necessidades: R$ 2.500
• Desejos: R$ 1.500
• Futuro: R$ 1.000

💡 **Como aplicar na prática:**
1. Registre TODAS as despesas (o Munguba Finance faz isso por você)
2. Categorize como necessidade ou desejo
3. Ajuste onde está gastando além do limite
4. Automatize os R$ 1.000 em investimentos no dia do pagamento

Se sua realidade não permite 20% no futuro, comece com 5% e aumente gradualmente. O importante é criar o hábito.`
  }
  return `Boa pergunta! Sou o assistente financeiro do Munguba Finance 🌳

Posso te ajudar com temas como:
• Tesouro Direto e títulos públicos
• FIIs (Fundos Imobiliários)
• Ações e bolsa de valores
• Renda fixa x renda variável
• CDI, Selic e indicadores econômicos
• Dividend Yield e análise de dividendos
• Reserva de emergência
• Imposto de Renda sobre investimentos
• Organização de orçamento (50-30-20)

Tente reformular sua pergunta ou escolha um dos temas acima. Estou aqui para transformar conceitos complexos em conhecimento prático!`
}

const formatMsg = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

export default function ChatScreen() {
  const [msgs, setMsgs] = useState([{
    from:'bot',
    text:'Olá! Sou o **Assistente Munguba** 🌳\n\nEstou aqui para transformar conceitos financeiros complexos em conhecimento prático e acessível. Pergunte sobre investimentos, orçamento, impostos, mercado financeiro e muito mais!\n\nComo posso te ajudar hoje?'
  }])
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
    }, 800)
  }

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', animation:'vIn .26s ease' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'18px 20px', color:'#fff', marginBottom:14, display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
        <MungubaTree size={44} />
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>Assistente Munguba</div>
          <div style={{ fontSize:11, opacity:.7, marginTop:2 }}>● Online · Especialista em Finanças</div>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ marginBottom:12, flexShrink:0 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:8 }}>Perguntas frequentes</div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {QUICK.map((q,i) => (
            <button key={i} onClick={() => send(q)} style={{
              padding:'7px 13px', borderRadius:20,
              border:'1.5px solid rgba(10,138,82,.25)',
              background:'#fff', color:'#076B3E',
              fontFamily:'Outfit,sans-serif', fontSize:11,
              fontWeight:600, cursor:'pointer',
              transition:'all .18s'
            }}
            onMouseOver={e=>{e.currentTarget.style.background='#E8F5EE'}}
            onMouseOut={e=>{e.currentTarget.style.background='#fff'}}>
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
          onKeyDown={e=>e.key==='Enter'&&send(input)}
          placeholder="Pergunte sobre finanças, investimentos..."
          style={{ flex:1, border:'1.5px solid rgba(10,138,82,.25)', borderRadius:14, padding:'12px 16px', fontSize:13, fontFamily:'Outfit,sans-serif', outline:'none', background:'#F0F9F4', color:'#0D1F17' }}
        />
        <button onClick={()=>send(input)} style={{ padding:'12px 20px', borderRadius:14, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Enviar</button>
      </div>
    </div>
  )
}
