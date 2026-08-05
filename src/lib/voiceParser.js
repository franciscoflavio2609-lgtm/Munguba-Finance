import { CATS } from '../data/constants'

// Palavras-chave para identificar categoria a partir do texto falado
const CATEGORY_KEYWORDS = {
  income: {
    'Salário': ['salario', 'salário', 'pagamento do trabalho', 'holerite'],
    'Freelance': ['freelance', 'freela', 'bico', 'trabalho extra'],
    'Vendas': ['venda', 'vendi', 'vendas'],
    'Presente': ['presente', 'ganhei', 'doacao', 'doação'],
    'Dividendos': ['dividendo', 'dividendos', 'proventos'],
    'Aluguel Rec.': ['aluguel recebido', 'recebi aluguel'],
    'Investimentos': ['resgate', 'rendimento'],
  },
  fixed: {
    'Moradia': ['aluguel', 'condominio', 'condomínio', 'financiamento da casa', 'iptu'],
    'Saúde': ['plano de saude', 'plano de saúde', 'remedio', 'remédio', 'farmacia', 'farmácia', 'medico', 'médico', 'consulta'],
    'Educação': ['escola', 'faculdade', 'mensalidade', 'curso'],
    'Seguro': ['seguro'],
    'Internet': ['internet', 'wifi', 'wi-fi'],
    'Energia': ['luz', 'energia', 'conta de luz'],
    'Água': ['agua', 'água', 'conta de agua', 'conta de água'],
    'Telefone': ['celular', 'telefone', 'plano de celular'],
    'Financiamento': ['financiamento do carro', 'prestacao', 'prestação'],
    'Academia': ['academia', 'gym'],
    'Pets': ['pet', 'racao', 'ração', 'veterinario', 'veterinário'],
  },
  variable: {
    'Alimentação': ['mercado', 'supermercado', 'feira', 'padaria', 'comida', 'acougue', 'açougue'],
    'Transporte': ['uber', '99', 'gasolina', 'combustivel', 'combustível', 'onibus', 'ônibus', 'estacionamento'],
    'Lazer': ['cinema', 'passeio', 'lazer', 'diversao', 'diversão'],
    'Vestuário': ['roupa', 'sapato', 'tenis', 'tênis', 'loja de roupa'],
    'Viagem': ['viagem', 'passagem', 'hotel', 'pousada'],
    'Beleza': ['salao', 'salão', 'cabeleireiro', 'manicure', 'barbearia'],
    'Entretenimento': ['jogo', 'netflix', 'spotify', 'streaming', 'assinatura'],
    'Delivery': ['ifood', 'delivery', 'lanche', 'pizza', 'entrega de comida'],
    'Manutenção': ['conserto', 'manutencao', 'manutenção', 'reparo'],
    'Presentes': ['presente', 'aniversario', 'aniversário'],
    'Social': ['bar', 'balada', 'restaurante', 'jantar', 'happy hour'],
    'Online': ['compra online', 'site', 'amazon', 'shopee', 'mercado livre'],
  }
}

// Palavras que indicam RECEITA vs DESPESA
const INCOME_SIGNALS = ['recebi', 'ganhei', 'entrou', 'salario', 'salário', 'venda', 'vendi', 'me pagaram', 'caiu na conta']
const EXPENSE_SIGNALS = ['gastei', 'paguei', 'comprei', 'saiu', 'foi', 'custou']

function normalizar(txt) {
  return txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Extrai valor numérico do texto falado
// Exemplos: "cinquenta reais", "50 reais", "vinte e cinco reais e trinta centavos", "R$ 150"
function extrairValor(texto) {
  const normalizado = normalizar(texto)

  // Tenta primeiro achar um número escrito em dígitos: "50", "150,90", "R$ 50"
  const matchDigito = normalizado.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:reais|real|conto|contos)?/)
  if (matchDigito) {
    const valor = parseFloat(matchDigito[1].replace(',', '.'))
    if (!isNaN(valor) && valor > 0) return valor
  }

  // Números por extenso (mapeamento básico para 0-100)
  const numerosPalavra = {
    'zero':0,'um':1,'uma':1,'dois':2,'duas':2,'tres':3,'quatro':4,'cinco':5,
    'seis':6,'sete':7,'oito':8,'nove':9,'dez':10,'onze':11,'doze':12,'treze':13,
    'quatorze':14,'catorze':14,'quinze':15,'dezesseis':16,'dezessete':17,
    'dezoito':18,'dezenove':19,'vinte':20,'trinta':30,'quarenta':40,
    'cinquenta':50,'sessenta':60,'setenta':70,'oitenta':80,'noventa':90,
    'cem':100,'cento':100,'duzentos':200,'trezentos':300,
    'quatrocentos':400,'quinhentos':500,'seiscentos':600,'setecentos':700,
    'oitocentos':800,'novecentos':900,'mil':1000
  }

  const palavras = normalizado.split(/\s+/)
  let total = 0
  let encontrouNumero = false
  let i = 0
  while (i < palavras.length) {
    const p = palavras[i].replace(/[^a-z]/g, '')
    if (numerosPalavra[p] !== undefined) {
      encontrouNumero = true
      if (numerosPalavra[p] === 1000) {
        total = (total || 1) * 1000
      } else if (numerosPalavra[p] >= 100 && palavras[i+1] && numerosPalavra[normalizar(palavras[i+1]).replace(/[^a-z]/g,'')] !== undefined) {
        total += numerosPalavra[p]
      } else {
        total += numerosPalavra[p]
      }
    }
    i++
  }
  if (encontrouNumero && total > 0) return total

  return null
}

// Identifica se é receita ou despesa
function identificarTipo(texto) {
  const normalizado = normalizar(texto)
  if (INCOME_SIGNALS.some(s => normalizado.includes(normalizar(s)))) return 'income'
  if (EXPENSE_SIGNALS.some(s => normalizado.includes(normalizar(s)))) return 'variable'
  return 'variable' // padrão: assume despesa variável (mais comum no dia a dia)
}

// Identifica categoria com base em palavras-chave
function identificarCategoria(texto, tipo) {
  const normalizado = normalizar(texto)
  const categorias = CATEGORY_KEYWORDS[tipo] || CATEGORY_KEYWORDS.variable

  for (const [catName, keywords] of Object.entries(categorias)) {
    if (keywords.some(kw => normalizado.includes(normalizar(kw)))) {
      return catName
    }
  }
  return null
}

// Extrai uma descrição limpa removendo valor e palavras de ação
function extrairDescricao(texto, tipo) {
  let limpo = texto

  // Remove padrões de valor
  limpo = limpo.replace(/\d+(?:[.,]\d{1,2})?\s*(?:reais|real|conto|contos)?/gi, '')

  // Remove palavras de ação comuns
  const acoes = tipo === 'income'
    ? INCOME_SIGNALS
    : EXPENSE_SIGNALS
  acoes.forEach(a => {
    limpo = limpo.replace(new RegExp(a, 'gi'), '')
  })

  // Remove preposições soltas e espaços duplicados
  limpo = limpo.replace(/\b(no|na|em|de|do|da|com|e)\b/gi, ' ')
  limpo = limpo.replace(/\s+/g, ' ').trim()

  // Capitaliza primeira letra
  if (limpo.length > 0) {
    limpo = limpo.charAt(0).toUpperCase() + limpo.slice(1)
  }

  return limpo || null
}

// Função principal: processa o texto falado e retorna os campos identificados
export function parseVoiceTransaction(texto) {
  if (!texto || typeof texto !== 'string') {
    return { sucesso: false, erro: 'Nenhum texto reconhecido.' }
  }

  const tipo = identificarTipo(texto)
  const valor = extrairValor(texto)
  const categoria = identificarCategoria(texto, tipo)
  const descricao = extrairDescricao(texto, tipo)

  if (!valor) {
    return {
      sucesso: false,
      erro: 'Não identifiquei o valor. Tente falar algo como "Gastei 50 reais no mercado".',
      textoOriginal: texto
    }
  }

  return {
    sucesso: true,
    tipo,
    valor,
    categoria: categoria || (CATS[tipo]?.[CATS[tipo].length - 1]?.n) || 'Outros',
    descricao: descricao || 'Transação por voz',
    textoOriginal: texto
  }
}

// Verifica se o navegador suporta reconhecimento de voz
export function verificarSuporteVoz() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

// Cria uma instância configurada do reconhecimento de voz em português
export function criarReconhecimentoVoz() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'pt-BR'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  return recognition
}
