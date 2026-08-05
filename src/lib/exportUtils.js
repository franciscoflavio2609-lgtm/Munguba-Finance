import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { fmt, getCat } from '../data/constants'

// ── Cores da marca Munguba ──
const VERDE_ESCURO = [4, 40, 24]
const VERDE_MEDIO = [7, 107, 62]
const VERDE_CLARO = [220, 252, 231]
const CINZA_TEXTO = [60, 60, 60]

function formatarData(d) {
  const data = new Date(d)
  if (isNaN(data.getTime())) return d
  return data.toLocaleDateString('pt-BR')
}

// ═══════════════════════════════════════
// EXPORTAÇÃO CSV
// ═══════════════════════════════════════
export function exportarTransacoesCSV(transactions, nomeArquivo = 'munguba-extrato') {
  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)']
  const linhas = transactions.map(t => [
    formatarData(t.date),
    `"${(t.desc || t.descricao || '').replace(/"/g, '""')}"`,
    t.cat || '',
    t.type === 'income' ? 'Receita' : t.type === 'fixed' ? 'Despesa Fixa' : 'Despesa Variável',
    Number(t.val || 0).toFixed(2).replace('.', ',')
  ])

  const csvContent = [headers.join(';'), ...linhas.map(l => l.join(';'))].join('\n')
  const bom = '\uFEFF' // BOM para acentuação correta no Excel
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${nomeArquivo}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportarInvestimentosCSV(investments, nomeArquivo = 'munguba-investimentos') {
  const headers = ['Nome', 'Tipo', 'Valor Investido (R$)', 'Taxa Anual (%)', 'Data']
  const linhas = investments.map(i => [
    `"${(i.nm || '').replace(/"/g, '""')}"`,
    i.tp || '',
    Number(i.val || 0).toFixed(2).replace('.', ','),
    Number(i.rt || 0).toFixed(2).replace('.', ','),
    formatarData(i.date)
  ])

  const csvContent = [headers.join(';'), ...linhas.map(l => l.join(';'))].join('\n')
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${nomeArquivo}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ═══════════════════════════════════════
// EXPORTAÇÃO PDF — Relatório Profissional
// ═══════════════════════════════════════
function addHeader(doc, titulo, subtitulo) {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Faixa verde superior
  doc.setFillColor(...VERDE_ESCURO)
  doc.rect(0, 0, pageWidth, 32, 'F')

  // Logo textual (árvore + nome)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('🌳 Munguba Finance', 14, 14)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Seu Parceiro Financeiro', 14, 20)

  // Título do relatório
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(titulo, pageWidth - 14, 14, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(subtitulo, pageWidth - 14, 20, { align: 'right' })

  doc.setTextColor(...CINZA_TEXTO)
  return 40 // Y inicial após o header
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(220, 220, 220)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Gerado por Munguba Finance em ${new Date().toLocaleDateString('pt-BR')}`, 14, pageHeight - 10)
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' })
  }
}

export function exportarRelatorioPDF({ transactions, investments, dreams, mesReferencia, nomeUsuario }) {
  const doc = new jsPDF()

  const inc = transactions.filter(t => t.type === 'income').reduce((a,t) => a + Number(t.val||0), 0)
  const exp = transactions.filter(t => t.type !== 'income').reduce((a,t) => a + Number(t.val||0), 0)
  const bal = inc - exp
  const totInv = investments.reduce((a,i) => a + Number(i.val||0), 0)

  let y = addHeader(doc, 'Relatório Financeiro', mesReferencia || new Date().toLocaleDateString('pt-BR', { month:'long', year:'numeric' }))

  if (nomeUsuario) {
    doc.setFontSize(10)
    doc.setTextColor(...CINZA_TEXTO)
    doc.text(`Titular: ${nomeUsuario}`, 14, y)
    y += 10
  }

  // ── Resumo executivo ──
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...VERDE_MEDIO)
  doc.text('Resumo do Período', 14, y)
  y += 8

  const resumoCards = [
    ['Receitas', fmt(inc)],
    ['Despesas', fmt(exp)],
    ['Saldo Líquido', fmt(bal)],
    ['Patrimônio Investido', fmt(totInv)],
  ]

  autoTable(doc, {
    startY: y,
    head: [['Indicador', 'Valor']],
    body: resumoCards,
    theme: 'grid',
    headStyles: { fillColor: VERDE_ESCURO, textColor: 255, fontStyle: 'bold' },
    bodyStyles: { textColor: CINZA_TEXTO },
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  })
  y = doc.lastAutoTable.finalY + 12

  // ── Gastos por categoria ──
  const bycat = {}
  transactions.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat] || 0) + Number(t.val || 0)
  })
  const categorias = Object.entries(bycat).sort((a,b) => b[1]-a[1])

  if (categorias.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...VERDE_MEDIO)
    doc.text('Despesas por Categoria', 14, y)
    y += 8

    autoTable(doc, {
      startY: y,
      head: [['Categoria', 'Valor', '% do Total']],
      body: categorias.map(([cat, val]) => [
        cat,
        fmt(val),
        exp > 0 ? `${((val/exp)*100).toFixed(1)}%` : '0%'
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE_MEDIO, textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: CINZA_TEXTO },
      styles: { fontSize: 9, cellPadding: 3.5 },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 12
  }

  // ── Investimentos ──
  if (investments.length > 0) {
    if (y > 230) { doc.addPage(); y = 20 }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...VERDE_MEDIO)
    doc.text('Carteira de Investimentos', 14, y)
    y += 8

    autoTable(doc, {
      startY: y,
      head: [['Ativo', 'Tipo', 'Valor', 'Taxa Anual']],
      body: investments.map(i => [
        i.nm || '-',
        i.tp || '-',
        fmt(i.val),
        i.rt ? `${i.rt}% a.a.` : '-'
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE_MEDIO, textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: CINZA_TEXTO },
      styles: { fontSize: 9, cellPadding: 3.5 },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 12
  }

  // ── Sonhos/Metas ──
  if (dreams && dreams.length > 0) {
    if (y > 230) { doc.addPage(); y = 20 }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...VERDE_MEDIO)
    doc.text('Metas e Objetivos', 14, y)
    y += 8

    autoTable(doc, {
      startY: y,
      head: [['Meta', 'Valor Alvo', 'Progresso', '%']],
      body: dreams.map(d => {
        const pct = Number(d.target||0) > 0 ? Math.min(100, Math.round((Number(d.saved||0)/Number(d.target||1))*100)) : 0
        return [d.nm || '-', fmt(d.target), fmt(d.saved||0), `${pct}%`]
      }),
      theme: 'striped',
      headStyles: { fillColor: VERDE_MEDIO, textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: CINZA_TEXTO },
      styles: { fontSize: 9, cellPadding: 3.5 },
      margin: { left: 14, right: 14 },
    })
  }

  addFooter(doc)
  doc.save(`munguba-relatorio-${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportarExtratoPDF(transactions, nomeUsuario) {
  const doc = new jsPDF()
  let y = addHeader(doc, 'Extrato de Transações', `${transactions.length} lançamentos`)

  if (nomeUsuario) {
    doc.setFontSize(10)
    doc.setTextColor(...CINZA_TEXTO)
    doc.text(`Titular: ${nomeUsuario}`, 14, y)
    y += 10
  }

  const ordenadas = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date))

  autoTable(doc, {
    startY: y,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: ordenadas.map(t => [
      formatarData(t.date),
      t.desc || t.descricao || '-',
      t.cat || '-',
      t.type === 'income' ? 'Receita' : 'Despesa',
      (t.type === 'income' ? '+ ' : '- ') + fmt(t.val)
    ]),
    theme: 'striped',
    headStyles: { fillColor: VERDE_ESCURO, textColor: 255, fontStyle: 'bold' },
    bodyStyles: { textColor: CINZA_TEXTO },
    styles: { fontSize: 8.5, cellPadding: 3 },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw
        if (typeof val === 'string' && val.startsWith('+')) {
          data.cell.styles.textColor = VERDE_MEDIO
        } else if (typeof val === 'string' && val.startsWith('-')) {
          data.cell.styles.textColor = [214, 51, 51]
        }
      }
    }
  })

  addFooter(doc)
  doc.save(`munguba-extrato-${new Date().toISOString().split('T')[0]}.pdf`)
}
