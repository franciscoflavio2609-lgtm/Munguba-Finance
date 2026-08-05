import { useState, useMemo } from 'react'
import { fmt, getCat } from '../../data/constants'

const DIAS_MS = 24 * 60 * 60 * 1000

function parseDate(dateStr) {
  // Aceita formatos "YYYY-MM-DD" ou similares já usados no app
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function computeWeeklyStats(transactions, investments, dreams) {
  const hoje = new Date()
  const inicioSemanaAtual = new Date(hoje.getTime() - 7 * DIAS_MS)
  const inicioSemanaAnterior = new Date(hoje.getTime() - 14 * DIAS_MS)

  const semanaAtual = transactions.filter(t => {
    const d = parseDate(t.date)
    return d && d >= inicioSemanaAtual && d <= hoje
  })
  const semanaAnterior = transactions.filter(t => {
    const d = parseDate(t.date)
    return d && d >= inicioSemanaAnterior && d < inicioSemanaAtual
  })

  const gastoAtual = semanaAtual.filter(t => t.type !== 'income').reduce((a,t) => a + Number(t.val||0), 0)
  const gastoAnterior = semanaAnterior.filter(t => t.type !== 'income').reduce((a,t) => a + Number(t.val||0), 0)
  const receitaAtual = semanaAtual.filter(t => t.type === 'income').reduce((a,t) => a + Number(t.val||0), 0)

  const diferenca = gastoAnterior - gastoAtual // positivo = economizou
  const temComparativo = semanaAnterior.length > 0

  // Maior categoria de gasto na semana
  const bycat = {}
  semanaAtual.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat] || 0) + Number(t.val || 0)
  })
  const categorias = Object.entries(bycat).sort((a,b) => b[1]-a[1])
  const maiorCategoria = categorias[0] || null

  // Meta/sonho com maior progresso
  const metaAtiva = dreams
    .filter(d => Number(d.target||0) > 0)
    .map(d => ({ ...d, pct: Math.min(100, Math.round((Number(d.saved||0) / Number(d.target||1)) * 100)) }))
    .sort((a,b) => b.pct - a.pct)[0] || null

  return {
    gastoAtual, gastoAnterior, receitaAtual, diferenca, temComparativo,
    maiorCategoria, metaAtiva, qtdTransacoesSemana: semanaAtual.length
  }
}

function buildMessage(stats) {
  const msgs = []

  // Comparativo de gastos
  if (stats.temComparativo) {
    if (stats.diferenca > 0) {
      msgs.push({
        icon: '✅',
        texto: `Você economizou ${fmt(stats.diferenca)} em relação à semana passada. Continue assim!`,
        cor: '#076B3E'
      })
    } else if (stats.diferenca < 0) {
      msgs.push({
        icon: '⚠️',
        texto: `Seus gastos aumentaram ${fmt(Math.abs(stats.diferenca))} em relação à semana passada.`,
        cor: '#D97706'
      })
    } else {
      msgs.push({
        icon: '➖',
        texto: `Seus gastos ficaram estáveis em relação à semana passada.`,
        cor: '#1D6FA4'
      })
    }
  } else if (stats.qtdTransacoesSemana > 0) {
    msgs.push({
      icon: '📊',
      texto: `Você registrou ${stats.qtdTransacoesSemana} transaç${stats.qtdTransacoesSemana === 1 ? 'ão' : 'ões'} esta semana.`,
      cor: '#1D6FA4'
    })
  }

  // Maior categoria
  if (stats.maiorCategoria) {
    const [cat, val] = stats.maiorCategoria
    const c = getCat(cat)
    msgs.push({
      icon: c.e || '💸',
      texto: `Maior gasto da semana: ${cat} (${fmt(val)}).`,
      cor: '#6B8878'
    })
  }

  // Meta ativa
  if (stats.metaAtiva) {
    if (stats.metaAtiva.pct >= 100) {
      msgs.push({
        icon: '🎉',
        texto: `Parabéns! Sua meta "${stats.metaAtiva.nm}" foi concluída!`,
        cor: '#076B3E'
      })
    } else {
      msgs.push({
        icon: '🎯',
        texto: `Sua meta "${stats.metaAtiva.nm}" está em ${stats.metaAtiva.pct}% — faltam ${fmt(Math.max(0, Number(stats.metaAtiva.target) - Number(stats.metaAtiva.saved||0)))}.`,
        cor: '#B45309'
      })
    }
  }

  return msgs
}

export default function WeeklyInsight({ state }) {
  const [expanded, setExpanded] = useState(false)

  const stats = useMemo(
    () => computeWeeklyStats(state.transactions || [], state.investments || [], state.dreams || []),
    [state.transactions, state.investments, state.dreams]
  )

  const mensagens = useMemo(() => buildMessage(stats), [stats])
  const semDados = stats.qtdTransacoesSemana === 0 && mensagens.length === 0

  if (semDados) return null // não mostra nada se não há atividade recente

  const hoje = new Date()
  const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' })

  return (
    <div style={{
      background: 'linear-gradient(135deg,#022818,#076B3E)',
      borderRadius: 24, padding: '20px 22px', color: '#fff',
      marginBottom: 18, position: 'relative', overflow: 'hidden', cursor: 'pointer'
    }} onClick={() => setExpanded(!expanded)}>
      <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expanded ? 16 : 0 }}>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', opacity: .6, marginBottom: 4 }}>
            📅 Resumo da Semana
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Sua semana financeira</div>
        </div>
        <div style={{ fontSize: 18, opacity: .6, transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</div>
      </div>

      {!expanded && mensagens[0] && (
        <div style={{ fontSize: 12.5, opacity: .85, marginTop: 8, lineHeight: 1.6 }}>
          {mensagens[0].icon} {mensagens[0].texto}
          <span style={{ opacity: .6, marginLeft: 6 }}>· toque para ver mais</span>
        </div>
      )}

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
          {mensagens.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: '12px 14px'
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{m.icon}</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.6, opacity: .9 }}>{m.texto}</span>
            </div>
          ))}
          <div style={{ fontSize: 10.5, opacity: .5, textAlign: 'center', marginTop: 4 }}>
            Atualizado toda {diaSemana} · Baseado nos seus dados reais
          </div>
        </div>
      )}
    </div>
  )
}
