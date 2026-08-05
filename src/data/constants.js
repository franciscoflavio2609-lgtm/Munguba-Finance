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

// ── Classificação de ativos para Carteira Visual e Análise de Risco ──
export const TIPO_INFO = {
  'Tesouro Direto': { setor:'Renda Fixa Pública', risco:'low', cor:'#076B3E', dyEstimado:0 },
  'CDB':             { setor:'Renda Fixa Bancária', risco:'low', cor:'#1D6FA4', dyEstimado:0 },
  'LCI/LCA':         { setor:'Renda Fixa Isenta', risco:'low', cor:'#7C3AED', dyEstimado:0 },
  'FIIs':            { setor:'Fundos Imobiliários', risco:'med', cor:'#D97706', dyEstimado:9 },
  'ETFs':            { setor:'Fundos de Índice', risco:'med', cor:'#0E7490', dyEstimado:2 },
  'Ações':           { setor:'Renda Variável', risco:'high', cor:'#D63333', dyEstimado:5 },
  'Criptomoedas':    { setor:'Cripto', risco:'high', cor:'#EC4899', dyEstimado:0 },
  'Outros':          { setor:'Outros', risco:'med', cor:'#6B8878', dyEstimado:0 },
}
export const getTipoInfo = (tp) => TIPO_INFO[tp] || TIPO_INFO['Outros']

// ── SISTEMA DE CONQUISTAS ──
export const ACHIEVEMENTS = [
  // Primeiros passos
  { id:'first_txn',    icon:'🌱', nome:'Primeira Semente',      desc:'Registrou sua primeira transação',           xp:50,  cat:'inicio' },
  { id:'first_invest', icon:'📈', nome:'Primeiro Investimento',  desc:'Registrou seu primeiro investimento',        xp:100, cat:'inicio' },
  { id:'first_dream',  icon:'✨', nome:'Primeiro Sonho',         desc:'Criou seu primeiro sonho/objetivo',          xp:80,  cat:'inicio' },
  { id:'first_budget', icon:'📋', nome:'Planejador Nato',        desc:'Configurou seu primeiro orçamento',          xp:60,  cat:'inicio' },
  { id:'onboarding',   icon:'🎯', nome:'Primeiros Passos',       desc:'Completou o onboarding do Munguba',          xp:100, cat:'inicio' },
  // Consistência
  { id:'txn_7',        icon:'📅', nome:'Uma Semana de Controle', desc:'Registrou transações por 7 dias seguidos',   xp:150, cat:'consistencia' },
  { id:'txn_30',       icon:'🔥', nome:'30 Dias de Controle',    desc:'Registrou transações por 30 dias seguidos',  xp:500, cat:'consistencia' },
  { id:'txn_10',       icon:'💪', nome:'10 Transações',          desc:'Registrou 10 transações no total',           xp:80,  cat:'consistencia' },
  { id:'txn_50',       icon:'⚡', nome:'50 Transações',          desc:'Registrou 50 transações no total',           xp:200, cat:'consistencia' },
  { id:'txn_100',      icon:'🏅', nome:'Centurião Financeiro',   desc:'Registrou 100 transações no total',          xp:400, cat:'consistencia' },
  // Finanças saudáveis
  { id:'saldo_pos',    icon:'💚', nome:'Saldo Verde',            desc:'Terminou o mês com saldo positivo',          xp:200, cat:'saude' },
  { id:'reserva_25',   icon:'🛡️', nome:'Escudo Iniciante',      desc:'Reserva de emergência atingiu 25%',          xp:150, cat:'saude' },
  { id:'reserva_100',  icon:'🏰', nome:'Escudo Financeiro',      desc:'Reserva de emergência completa!',            xp:500, cat:'saude' },
  { id:'no_debt',      icon:'🕊️', nome:'Livre de Dívidas',      desc:'Mês sem registrar nenhuma dívida',           xp:300, cat:'saude' },
  { id:'poupanca_20',  icon:'🐷', nome:'Poupador Disciplinado',  desc:'Poupou 20% ou mais da renda em um mês',     xp:250, cat:'saude' },
  // Investimentos
  { id:'invest_3',     icon:'🌿', nome:'Carteira Diversificada', desc:'Tem 3 tipos diferentes de investimentos',    xp:200, cat:'invest' },
  { id:'invest_10k',   icon:'💎', nome:'5 Dígitos',              desc:'Patrimônio investido passou de R$10.000',    xp:500, cat:'invest' },
  { id:'invest_50k',   icon:'👑', nome:'Investidor de Verdade',  desc:'Patrimônio investido passou de R$50.000',    xp:1000,cat:'invest' },
  { id:'dividendos',   icon:'💰', nome:'Renda Passiva',          desc:'Tem FIIs ou ações na carteira',              xp:150, cat:'invest' },
  // Educação
  { id:'edu_1',        icon:'📖', nome:'Aprendiz',               desc:'Completou o primeiro módulo educativo',      xp:100, cat:'edu' },
  { id:'edu_4',        icon:'🎓', nome:'Estudante Dedicado',     desc:'Completou 4 módulos educativos',             xp:300, cat:'edu' },
  { id:'edu_8',        icon:'🏆', nome:'Mestre das Finanças',    desc:'Completou todos os 8 módulos!',              xp:1000,cat:'edu' },
  // Sonhos
  { id:'dream_50',     icon:'🌙', nome:'Meio Caminho',           desc:'Um sonho chegou a 50% do objetivo',         xp:200, cat:'sonhos' },
  { id:'dream_done',   icon:'⭐', nome:'Sonho Realizado',        desc:'Completou um objetivo financeiro!',          xp:500, cat:'sonhos' },
  // Especiais
  { id:'streak_save',  icon:'🎪', nome:'Mês Perfeito',           desc:'Ficou dentro do orçamento em todas as categorias', xp:400, cat:'especial' },
  { id:'munguba_fan',  icon:'🌳', nome:'Fã do Munguba',         desc:'Usa o app há mais de 30 dias',               xp:300, cat:'especial' },
]

export const ACH_CATS = {
  inicio:       { nome:'Primeiros Passos', icon:'🌱' },
  consistencia: { nome:'Consistência',     icon:'🔥' },
  saude:        { nome:'Saúde Financeira', icon:'💚' },
  invest:       { nome:'Investimentos',    icon:'📈' },
  edu:          { nome:'Educação',         icon:'🎓' },
  sonhos:       { nome:'Sonhos',           icon:'✨' },
  especial:     { nome:'Especiais',        icon:'🏆' },
}

// Verifica quais conquistas o usuário ganhou
export function checkAchievements(state) {
  const txns = state.transactions || []
  const invs = state.investments || []
  const drms = state.dreams || []
  const inc = txns.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.val||0),0)
  const exp = txns.filter(t=>t.type!=='income').reduce((a,t)=>a+Number(t.val||0),0)
  const totInv = invs.reduce((a,i)=>a+Number(i.val||0),0)
  const tiposInv = new Set(invs.map(i=>i.tp)).size
  const earned = new Set(state.achievements || [])

  const check = (id, cond) => { if (cond && !earned.has(id)) earned.add(id) }

  check('first_txn',    txns.length >= 1)
  check('first_invest', invs.length >= 1)
  check('first_dream',  drms.length >= 1)
  check('first_budget', state.budgetConfigured)
  check('txn_10',       txns.length >= 10)
  check('txn_50',       txns.length >= 50)
  check('txn_100',      txns.length >= 100)
  check('saldo_pos',    inc > 0 && inc > exp)
  check('reserva_25',   totInv > 0 && exp > 0 && totInv >= exp * 1.5)
  check('reserva_100',  totInv > 0 && exp > 0 && totInv >= exp * 6)
  check('poupanca_20',  inc > 0 && exp > 0 && ((inc-exp)/inc) >= 0.20)
  check('invest_3',     tiposInv >= 3)
  check('invest_10k',   totInv >= 10000)
  check('invest_50k',   totInv >= 50000)
  check('dividendos',   invs.some(i => i.tp === 'FIIs' || i.tp === 'Ações'))
  check('onboarding',   state.onboarded)

  return [...earned]
}
