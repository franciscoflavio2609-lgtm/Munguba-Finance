import { useState } from 'react'

const FAQS = [
  { cat:'💰 Fundamentos', q:'Como calculo minha reserva de emergência?', a:'Multiplique seus gastos mensais totais por 3 (mínimo) a 12 (ideal para autônomos). Exemplo: gastos de R$3.000/mês → CLT precisa de R$9.000 a R$18.000; autônomos precisam de R$18.000 a R$36.000. Guarde sempre em Tesouro Selic ou CDB com liquidez diária — nunca em poupança.' },
  { cat:'💰 Fundamentos', q:'Qual a diferença entre poupar e investir?', a:'Poupar é proteger o poder de compra (Tesouro Selic, CDB DI). Investir é buscar retorno acima da inflação assumindo algum risco (ações, FIIs, ETFs). A ordem correta: 1) quitar dívidas caras, 2) construir reserva de emergência, 3) investir o excedente. Não pule etapas.' },
  { cat:'💰 Fundamentos', q:'Devo pagar dívidas ou investir primeiro?', a:'Depende dos juros. Dívidas com taxa acima de 12% ao ano (cartão de crédito até 400% a.a., cheque especial ~150% a.a.) — pague IMEDIATAMENTE. Dívidas abaixo de 12% a.a. (financiamento imobiliário, consignado) — pode investir em paralelo. Nunca invista enquanto tem dívida de cartão de crédito.' },
  { cat:'💰 Fundamentos', q:'O que é o sistema 50-30-20?', a:'Método criado pela senadora americana Elizabeth Warren: 50% da renda líquida vai para necessidades (moradia, alimentação, saúde, transporte), 30% para desejos (lazer, restaurantes, assinaturas) e 20% obrigatoriamente para poupança e investimentos. É um ponto de partida — adapte conforme sua realidade, mas nunca deixe o "futuro" em zero.' },
  { cat:'🏦 Renda Fixa', q:'Tesouro Direto é seguro?', a:'É o investimento mais seguro do Brasil — garantido pelo Tesouro Nacional (governo federal). Em caso de falência do banco custodiante, seu dinheiro continua protegido. O Tesouro Selic é ideal para reserva de emergência (liquidez diária), o IPCA+ 2035 protege contra inflação no longo prazo, e o Prefixado trava a taxa (bom se juros cairem).' },
  { cat:'🏦 Renda Fixa', q:'CDB, LCI e LCA: qual é o melhor?', a:'Depende do prazo e imposto. CDB tem IR regressivo (22,5% até 15%). LCI e LCA são isentas de IR para pessoa física — isso é uma vantagem enorme. Para comparar: LCI a 90% CDI equivale a um CDB de ~109% CDI (para 1 ano). Sempre compare o retorno líquido, não o percentual bruto. FGC garante até R$250k por instituição.' },
  { cat:'🏦 Renda Fixa', q:'O que é o FGC e como me protege?', a:'O FGC (Fundo Garantidor de Créditos) é uma entidade privada que garante até R$250.000 por CPF por instituição financeira em caso de falência do banco. Cobre: CDB, LCI, LCA, poupança, letras de câmbio. NÃO cobre: Tesouro Direto (garantido pelo governo), fundos de investimento, debêntures, CRI, CRA.' },
  { cat:'📈 Ações', q:'O que é uma ação?', a:'Uma ação é uma fração do capital social de uma empresa. Ao comprá-la, você se torna sócio e tem direito a parte dos lucros (dividendos) e valorização. Ações ON (ordinárias) dão direito a voto — terminam em 3 (VALE3, PETR3). Ações PN (preferenciais) têm prioridade em dividendos — terminam em 4 (ITSA4, BBDC4). Units combinam as duas — terminam em 11.' },
  { cat:'📈 Ações', q:'O que é P/L e como usar na análise?', a:'P/L (Preço/Lucro) indica quanto o mercado paga por cada R$1 de lucro da empresa. P/L = Preço da ação ÷ Lucro por ação. P/L de 10 significa que você paga R$10 para ter direito a R$1 de lucro anual. Quanto menor o P/L, mais barata a ação está em relação ao lucro. Compare sempre com empresas do mesmo setor — cada setor tem um P/L médio diferente.' },
  { cat:'📈 Ações', q:'O que é ROE e por que importa?', a:'ROE (Return on Equity) mede a eficiência com que a empresa usa o capital dos acionistas para gerar lucro. ROE = Lucro Líquido ÷ Patrimônio Líquido. Um ROE de 20% significa que a empresa gera R$0,20 de lucro para cada R$1 investido pelos acionistas. Empresas com ROE consistentemente acima de 15% tendem a ser boas geradoras de valor. Warren Buffett prioriza empresas com ROE alto e estável.' },
  { cat:'📈 Ações', q:'O que é Dividend Yield?', a:'Dividend Yield = (Dividendos pagos nos últimos 12 meses ÷ Preço atual) × 100. Exemplo: ação a R$20 que pagou R$2 em dividendos → DY de 10%. No Brasil, empresas com DY consistente acima de 5% são chamadas de "pagadoras de dividendos". Cuidado: DY muito alto pode indicar queda no preço da ação, não generosidade da empresa. Analise o histórico de pagamentos.' },
  { cat:'📈 Ações', q:'O que são ETFs e como funcionam?', a:'ETF (Exchange Traded Fund) é um fundo negociado em bolsa que replica um índice. O BOVA11 replica o Ibovespa (as maiores empresas do Brasil). O IVVB11 replica o S&P 500 americano. Vantagens: diversificação automática, baixo custo (taxa de administração ~0,2% a.a.), alta liquidez. Ideal para iniciantes que querem exposição à bolsa sem analisar empresa por empresa.' },
  { cat:'🏢 FIIs', q:'O que são FIIs e como funcionam?', a:'FIIs (Fundos de Investimento Imobiliário) permitem investir no mercado imobiliário a partir de R$10. Você compra cotas na B3 e recebe dividendos mensais isentos de IR. Tipos: Tijolo (imóveis físicos como galpões e shoppings), Papel (CRIs e LCIs) e Híbridos. Dividend yield médio: 8% a 12% a.a., isentos de IR. O valor das cotas oscila como ações — há risco de mercado.' },
  { cat:'🏢 FIIs', q:'Qual a diferença entre FII de Tijolo e Papel?', a:'FII de Tijolo: investe diretamente em imóveis físicos (galpões logísticos, shoppings, lajes corporativas, hospitais). Renda vem do aluguel. Exemplos: HGLG11 (logística), VISC11 (shoppings). FII de Papel: investe em CRIs e LCIs (dívidas imobiliárias com correção pelo IPCA ou CDI). Renda vem dos juros. Exemplos: MXRF11, KNCR11. Papel tende a ser mais estável, Tijolo tem maior potencial de valorização patrimonial.' },
  { cat:'🏢 FIIs', q:'O que é vacância em FIIs?', a:'Vacância é o percentual de área do imóvel que está desocupado (sem inquilino). Vacância física de 10% significa que 10% do imóvel está vazio. Vacância financeira impacta diretamente os dividendos — menos inquilinos = menos aluguéis = menos distribuição. Acompanhe sempre nos relatórios mensais dos FIIs. Vacância abaixo de 5% é considerada saudável para FIIs de escritórios e galpões.' },
  { cat:'🌍 Economia', q:'O que é IPCA e como afeta meus investimentos?', a:'IPCA (Índice de Preços ao Consumidor Amplo) é o índice oficial de inflação do Brasil, calculado pelo IBGE. Se o IPCA está em 5% ao ano e seu investimento rende 10%, seu ganho real é ~4,76% (não simplesmente 5%). Regra de ouro: qualquer investimento que rende menos que o IPCA está perdendo poder de compra. O Tesouro IPCA+ garante ganho real acima da inflação.' },
  { cat:'🌍 Economia', q:'O que é a taxa Selic e por que importa?', a:'A Selic é a taxa básica de juros da economia brasileira, definida pelo COPOM (Comitê de Política Monetária do Banco Central) a cada 45 dias. Ela influencia: CDB, Tesouro Selic, LCI, LCA (para cima) e financiamentos imobiliários, crédito pessoal (para baixo). Quando a Selic sobe, renda fixa fica mais atrativa e bolsa tende a cair. Quando cai, o contrário. É a bússola dos mercados.' },
  { cat:'🌍 Economia', q:'O que é o COPOM?', a:'O COPOM (Comitê de Política Monetária) é o comitê do Banco Central do Brasil responsável por definir a meta da taxa Selic. Reúne-se 8 vezes por ano (a cada ~45 dias). A decisão do COPOM move todos os mercados: ações, câmbio, renda fixa, imóveis. Fique atento às reuniões — o calendário é divulgado com antecedência no site do Banco Central.' },
  { cat:'🌍 Economia', q:'O que é dólar futuro e como afeta meus investimentos?', a:'O dólar futuro é o contrato negociado na B3 que representa o preço do dólar em uma data futura. Empresas exportadoras (Vale, Petrobras, JBS) se beneficiam quando o dólar sobe — suas receitas são em dólar. Empresas importadoras e varejistas sofrem. Para o investidor pessoa física, o ETF IVVB11 é uma forma simples de se expor ao dólar — replica o S&P 500 em reais.' },
  { cat:'📋 Impostos', q:'Como funciona o IR sobre investimentos?', a:'Renda Fixa: IR retido na fonte pela alíquota regressiva (22,5% até 180 dias → 15% acima de 720 dias). LCI, LCA, CRI, CRA e dividendos de FIIs: isentos de IR. Ações: vendas até R$20.000/mês são isentas. Acima: 15% sobre lucro (swing trade) ou 20% (day trade). FIIs: ganho de capital na venda: 20%. Prejuízos em ações podem ser compensados com lucros futuros.' },
  { cat:'📋 Impostos', q:'O que é o Simples Nacional?', a:'Regime tributário simplificado para MEIs e pequenas empresas com faturamento anual até R$4,8 milhões. Unifica 8 impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS, CPP) em um único pagamento mensal calculado sobre o faturamento bruto. Alíquotas variam por setor: Comércio (Anexo I): 4% a 19%. Serviços (Anexos III-V): 6% a 33%. Verifique se o Simples é realmente o regime mais vantajoso para o seu caso.' },
  { cat:'🏢 Empresarial', q:'Como separar finanças pessoais das do negócio?', a:'1) Abra uma conta PJ separada. 2) Defina um pró-labore fixo mensal (seu "salário" como sócio). 3) NUNCA use dinheiro da empresa para despesas pessoais nem vice-versa. 4) Registre todas as despesas da empresa separadamente. 5) Use o Munguba Finance para o pessoal e outro sistema para o empresarial. Misturar PF e PJ é o erro mais comum de empreendedores — e o mais caro na hora do IR.' },
]

const CATS = [...new Set(FAQS.map(f => f.cat))]

export default function FaqScreen() {
  const [open, setOpen] = useState(null)
  const [activeCat, setActiveCat] = useState('Todas')

  const filtered = activeCat === 'Todas' ? FAQS : FAQS.filter(f => f.cat === activeCat)

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ ...card, background:'linear-gradient(130deg,#B45309,#D97706)', border:'none', color:'#fff', marginBottom:18 }}>
        <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.7, marginBottom:6 }}>Central de Conhecimento</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Tira-Dúvidas Financeiro</div>
        <div style={{ fontSize:13, opacity:.8, lineHeight:1.6 }}>{FAQS.length} perguntas sobre finanças pessoais, investimentos, mercado financeiro e economia.</div>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {['Todas', ...CATS].map(cat => (
          <button key={cat} onClick={() => { setActiveCat(cat); setOpen(null) }} style={{
            padding:'7px 14px', borderRadius:20, border:'1.5px solid',
            borderColor: activeCat===cat ? '#076B3E' : 'rgba(10,138,82,.2)',
            background: activeCat===cat ? '#076B3E' : '#fff',
            color: activeCat===cat ? '#fff' : '#2E4A3A',
            fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer'
          }}>{cat}</button>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:4 }}>
          {filtered.length} pergunta{filtered.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {filtered.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < filtered.length-1 ? '1px solid #F0F4F1' : 'none' }}>
              <div onClick={() => setOpen(open===i?null:i)} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 0', cursor:'pointer', gap:12
              }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#6B8878', marginBottom:3 }}>{faq.cat}</div>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0D1F17', lineHeight:1.5 }}>{faq.q}</span>
                </div>
                <span style={{ fontSize:20, color:'#076B3E', flexShrink:0, transition:'transform .2s', transform:open===i?'rotate(45deg)':'rotate(0)' }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding:'0 0 16px 0', fontSize:13, color:'#2E4A3A', lineHeight:1.8, animation:'vIn .2s ease', whiteSpace:'pre-wrap' }}>
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
