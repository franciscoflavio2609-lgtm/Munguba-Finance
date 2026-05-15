export const CATS = {
  income: [
    {e:'💼',n:'Salário'},{e:'📈',n:'Investimentos'},{e:'🖥️',n:'Freelance'},
    {e:'🏪',n:'Vendas'},{e:'🎁',n:'Presente'},{e:'🏦',n:'Dividendos'},
    {e:'📦',n:'Aluguel Rec.'},{e:'💡',n:'Outros'}
  ],
  fixed: [
    {e:'🏠',n:'Moradia'},{e:'💊',n:'Saúde'},{e:'📚',n:'Educação'},
    {e:'🛡️',n:'Seguro'},{e:'🌐',n:'Internet'},{e:'💡',n:'Energia'},
    {e:'💧',n:'Água'},{e:'📱',n:'Telefone'},{e:'🚗',n:'Financiamento'},
    {e:'🏋️',n:'Academia'},{e:'🐾',n:'Pets'},{e:'🎓',n:'Cursos'}
  ],
  variable: [
    {e:'🛒',n:'Alimentação'},{e:'🚌',n:'Transporte'},{e:'🎬',n:'Lazer'},
    {e:'👕',n:'Vestuário'},{e:'✈️',n:'Viagem'},{e:'💄',n:'Beleza'},
    {e:'🎮',n:'Entretenimento'},{e:'🍕',n:'Delivery'},{e:'🔧',n:'Manutenção'},
    {e:'🎁',n:'Presentes'},{e:'🍷',n:'Social'},{e:'📦',n:'Online'}
  ]
}

export const BUDGET_LIMITS = {
  Alimentação:800,Moradia:2000,Transporte:300,Saúde:400,
  Educação:300,Lazer:400,Vestuário:200,Delivery:250,Energia:200,Água:80
}

export const DREAM_ICONS = ['✈️','🏠','🚗','💻','🎓','🌴','💍','🎸','🏋️','🐕','🌎','⛵','🏄','🎨','🍷']
export const BANNERS = ['bn-green','bn-blue','bn-gold','bn-rose','bn-deep','bn-sunset']

export const LEVELS = [
  {n:'Semente 🌱',min:0},{n:'Broto 🌿',min:200},{n:'Muda 🌾',min:500},
  {n:'Jovem Árvore 🌲',min:1000},{n:'Cultivadora 🌳',min:2000},
  {n:'Grande Árvore 🌲✨',min:4000},{n:'Guardiã 🏆',min:8000}
]

export const PHASES = [
  {n:'Semente',p:0,cls:'ph-seed'},{n:'Broto',p:15,cls:'ph-sprout'},
  {n:'Crescendo',p:35,cls:'ph-grow'},{n:'Florescendo',p:60,cls:'ph-bloom'},
  {n:'Colhendo',p:85,cls:'ph-harvest'}
]

export const INSIGHTS = [
  {m:'90% dos gastos não planejados são emocionais.',s:'Antes de comprar por impulso, espere 24 horas.'},
  {m:'O prazer da compra dura horas. A dívida dura meses.',s:'Crie rituais saudáveis: exercício, leitura, natureza.'},
  {m:'Riqueza é o que você acumula, não o que você gasta.',s:'— Morgan Housel, Psicologia Financeira.'},
  {m:'A reserva de emergência não é luxo — é necessidade.',s:'Guarde 3 a 6 meses de gastos em Tesouro Selic ou CDB DI.'},
  {m:'A consistência vence a inteligência no longo prazo.',s:'R$300/mês por 30 anos supera R$3.000/mês por 5 anos.'},
]

export const REPORT_ANALYSES = {
  'Janeiro 2026':'Em Janeiro/2026 sua saúde financeira foi positiva. Saldo líquido acima de 55% da renda. Fornecedores e moradia concentram 53% das despesas — vale renegociar prazos para melhorar o fluxo de caixa.',
  'Fevereiro 2026':'Fevereiro apresentou leve retração típica do pós-carnaval. Despesas fixas estáveis, mas delivery cresceu 22%. Recomendo reforçar a reserva de emergência.',
  'Março 2026':'Março foi mês de recuperação com crescimento de 18% nas receitas. Bom momento para revisar aplicações de curto prazo.',
  'Abril 2026':'Abril registrou o melhor desempenho do trimestre. Taxa de poupança acima de 55%. Ideal para iniciar posição em FII de logística.',
  '1º Trimestre 2026':'O 1T 2026 encerrou com crescimento acumulado de 24% nas receitas. Margem líquida média de 57%.',
  '2º Trimestre 2026':'Projeção 2T: o trimestre deve fechar 30% acima de 2025. Aumente aporte em renda fixa e crie fundo de reserva para expansão.',
  'Anual 2026':'Projeção 2026: receita acima de R$85k e patrimônio investido superando R$25k. Metas: elevar reserva para 5 meses, iniciar FIIs, lançar o curso.',
}

export const RF_INVESTMENTS = [
  {name:'Tesouro Selic 2029',rate:'13,15% a.a.',detail:'Reserva de emergência. Liquidez diária.',risk:'low',badge:'ib-best',badgeLabel:'⭐ Recomendado'},
  {name:'CDB 100% CDI',rate:'~13,00% a.a.',detail:'Coberto FGC até R$250k.',risk:'low',badge:'ib-fixed',badgeLabel:'Renda Fixa'},
  {name:'CDB 110% CDI',rate:'~14,30% a.a.',detail:'Maior rentabilidade. Carência 1-2 anos.',risk:'low',badge:'ib-fixed',badgeLabel:'Renda Fixa'},
  {name:'LCI / LCA',rate:'90-100% CDI',detail:'Isentos de IR.',risk:'low',badge:'ib-fixed',badgeLabel:'Isento IR'},
  {name:'Tesouro IPCA+ 2035',rate:'IPCA + 6,2% a.a.',detail:'Protege contra inflação.',risk:'med',badge:'ib-fixed',badgeLabel:'Proteção Inflação'},
  {name:'Tesouro Prefixado',rate:'12,80% a.a.',detail:'Taxa travada. Bom se juros caírem.',risk:'med',badge:'ib-fixed',badgeLabel:'Prefixado'},
]

export const RV_INVESTMENTS = [
  {name:'ETF BOVA11',rate:'Segue Ibovespa',detail:'Exposição ampla à bolsa.',risk:'med',badge:'ib-var',badgeLabel:'ETF'},
  {name:'ETF IVVB11',rate:'Segue S&P 500 USA',detail:'Mercado americano em reais.',risk:'med',badge:'ib-best',badgeLabel:'⭐ Popular'},
  {name:'Ações VALE3',rate:'Dividendos ~8% a.a.',detail:'Maior mineradora do mundo.',risk:'high',badge:'ib-var',badgeLabel:'Ação'},
  {name:'Ações ITSA4',rate:'Dividendos ~4% a.a.',detail:'Holding do Itaú.',risk:'med',badge:'ib-var',badgeLabel:'Ação'},
  {name:'FII HGLG11',rate:'Dividendos ~9% a.a.',detail:'Logística. Dividendos mensais isentos IR.',risk:'med',badge:'ib-best',badgeLabel:'⭐ FII'},
  {name:'FII MXRF11',rate:'Dividendos ~11% a.a.',detail:'FII de papel (CRI).',risk:'med',badge:'ib-var',badgeLabel:'FII Papel'},
]

export const INITIAL_TRANSACTIONS = [
  {id:1,date:'2026-04-01',desc:'Salário Principal',cat:'Salário',val:5500,type:'income'},
  {id:2,date:'2026-04-03',desc:'Aluguel Apartamento',cat:'Moradia',val:1800,type:'fixed'},
  {id:3,date:'2026-04-05',desc:'Supermercado',cat:'Alimentação',val:620,type:'variable'},
  {id:4,date:'2026-04-08',desc:'Academia',cat:'Saúde',val:120,type:'fixed'},
  {id:5,date:'2026-04-10',desc:'iFood',cat:'Delivery',val:185,type:'variable'},
  {id:6,date:'2026-04-12',desc:'Curso de Inglês',cat:'Educação',val:197,type:'fixed'},
  {id:7,date:'2026-04-14',desc:'Uber',cat:'Transporte',val:95,type:'variable'},
  {id:8,date:'2026-04-16',desc:'Cinema',cat:'Lazer',val:110,type:'variable'},
  {id:9,date:'2026-04-18',desc:'Freelance Design',cat:'Freelance',val:1200,type:'income'},
  {id:10,date:'2026-04-20',desc:'Farmácia',cat:'Saúde',val:68,type:'variable'},
]

export const INITIAL_INVESTMENTS = [
  {tp:'Tesouro Selic',nm:'Tesouro Selic 2029',val:8000,rt:13.15,date:'2025-08-01'},
  {tp:'CDB',nm:'CDB Nubank 100% CDI',val:5000,rt:13.0,date:'2025-10-01'},
  {tp:'FIIs',nm:'HGLG11',val:3000,rt:9.0,date:'2026-01-15'},
  {tp:'ETFs',nm:'IVVB11',val:2500,rt:0,date:'2026-02-10'},
]

export const INITIAL_DREAMS = [
  {id:1,name:'Viagem para Europa',icon:'✈️',target:15000,current:4800,why:'Sempre sonhei em ver Paris e Roma.',banner:'bn-blue'},
  {id:2,name:'Casa Própria',icon:'🏠',target:80000,current:12000,why:'Quero meu próprio lar.',banner:'bn-green'},
  {id:3,name:'Notebook Novo',icon:'💻',target:5000,current:3800,why:'Crescer profissionalmente.',banner:'bn-gold'},
]

export const fmt = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})
export const getAllCats = () => [...CATS.income,...CATS.fixed,...CATS.variable]
export const getCat = (name) => getAllCats().find(c=>c.n===name)||{e:'💰',n:name}
export const getPhase = (pct) => { let r=PHASES[0]; for(const x of PHASES) if(pct>=x.p) r=x; return r }
export const getLevel = (xp) => { let r=LEVELS[0],i=0; LEVELS.forEach((l,j)=>{if(xp>=l.min){r=l;i=j}}); return{...r,i} }
