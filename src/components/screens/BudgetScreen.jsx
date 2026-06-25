import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, getCat } from '../../data/constants'

const DEFAULT_CATS = ['Alimentação','Moradia','Transporte','Saúde','Educação','Lazer','Vestuário','Delivery','Energia','Água']

export default function BudgetScreen() {
  const { state } = useApp()
  const [limits, setLimits] = useState({})
  const [editing, setEditing] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [showSetup, setShowSetup] = useState(false)

  const transactions = state.transactions || []

  // Calcula gastos reais por categoria
  const bycat = {}
  transactions.filter(t => t.type !== 'income').forEach(t => {
    bycat[t.cat] = (bycat[t.cat] || 0) + Number(t.val || 0)
  })

  const hasLimits = Object.keys(limits).length > 0
  const hasTransactions = transactions.length > 0

  const totalOrcado = Object.values(limits).reduce((a, v) => a + v, 0)
  const totalGasto = Object.values(bycat).reduce((a, v) => a + v, 0)
  const totalDisp = Math.max(0, totalOrcado - totalGasto)

  const saveLimit = (cat) => {
    const v = parseFloat(inputVal.replace(',', '.'))
    if (!isNaN(v) && v >= 0) {
      setLimits(prev => ({ ...prev, [cat]: v }))
    }
    setEditing(null)
    setInputVal('')
  }

  const removeLimit = (cat) => {
    setLimits(prev => { const n = { ...prev }; delete n[cat]; return n })
  }

  const card = { background: '#fff', borderRadius: 20, padding: '18px 20px', boxShadow: '0 1px 4px rgba(4,77,44,.08)', border: '1px solid rgba(10,138,82,.12)' }

  // Tela de boas-vindas — sem limites configurados ainda
  if (!hasLimits) {
    return (
      <div style={{ animation: 'vIn .26s ease' }}>
        <div style={{ ...card, background: 'linear-gradient(130deg,#022818,#076B3E)', border: 'none', color: '#fff', marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', opacity: .6, marginBottom: 8 }}>Orçamentos</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Monte seu orçamento</div>
          <div style={{ fontSize: 13, opacity: .8, lineHeight: 1.6 }}>Defina limites de gastos por categoria e acompanhe se está dentro do planejado.</div>
        </div>

        {/* Estado vazio */}
        <div style={{ ...card, textAlign: 'center', padding: '40px 24px', marginBottom: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0D1F17', marginBottom: 8 }}>Nenhum orçamento configurado</div>
          <div style={{ fontSize: 13, color: '#6B8878', lineHeight: 1.7, marginBottom: 24 }}>
            Você ainda não definiu limites de gastos.<br/>
            Clique no botão abaixo para começar a montar seu orçamento personalizado.
          </div>
          <button onClick={() => setShowSetup(true)} style={{
            background: 'linear-gradient(135deg,#044D2C,#076B3E)', color: '#fff', border: 'none',
            borderRadius: 14, padding: '13px 28px', fontFamily: 'Outfit,sans-serif',
            fontSize: 14, fontWeight: 700, cursor: 'pointer'
          }}>+ Configurar meu orçamento</button>
        </div>

        {/* Resumo das despesas reais mesmo sem orçamento */}
        {hasTransactions && (
          <div style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: '#6B8878', marginBottom: 14 }}>
              Seus gastos reais (sem limite definido)
            </div>
            {Object.entries(bycat).map(([cat, spent]) => {
              const c = getCat(cat)
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F4F1' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.e}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F17' }}>{cat}</div>
                    <div style={{ fontSize: 11, color: '#6B8878' }}>sem limite definido</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#D63333' }}>{fmt(spent)}</div>
                  <button onClick={() => { setEditing(cat); setInputVal(''); setShowSetup(false) }} style={{
                    fontSize: 11, color: '#076B3E', background: '#DCFCE7', border: 'none',
                    borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600
                  }}>Definir limite</button>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de setup */}
        {showSetup && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0D1F17', marginBottom: 4 }}>Definir limites de orçamento</div>
              <div style={{ fontSize: 12, color: '#6B8878', marginBottom: 20 }}>Defina o limite mensal para cada categoria. Deixe em 0 para não limitar.</div>
              {DEFAULT_CATS.map(cat => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1, fontSize: 13, color: '#0D1F17', fontWeight: 500 }}>{cat}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#6B8878' }}>R$</span>
                    <input
                      type="number" placeholder="0"
                      value={limits[cat] || ''}
                      onChange={e => setLimits(prev => ({ ...prev, [cat]: parseFloat(e.target.value) || 0 }))}
                      style={{ width: 80, border: '1.5px solid rgba(10,138,82,.2)', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setShowSetup(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0D1F17' }}>Cancelar</button>
                <button onClick={() => setShowSetup(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#044D2C,#076B3E)', color: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Salvar orçamento</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de limite individual */}
        {editing && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 360 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#0D1F17' }}>Limite para {editing}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 16, color: '#6B8878' }}>R$</span>
                <input autoFocus type="number" placeholder="Ex: 500" value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveLimit(editing)}
                  style={{ flex: 1, border: '1.5px solid rgba(10,138,82,.3)', borderRadius: 10, padding: '11px 14px', fontSize: 16, fontFamily: 'Outfit,sans-serif', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setEditing(null); setInputVal('') }} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0D1F17' }}>Cancelar</button>
                <button onClick={() => saveLimit(editing)} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#044D2C,#076B3E)', color: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Tela com orçamentos configurados
  const items = Object.keys(limits).filter(cat => limits[cat] > 0).map(cat => ({
    cat, spent: bycat[cat] || 0, limit: limits[cat],
    pct: Math.min(100, Math.round(((bycat[cat] || 0) / limits[cat]) * 100))
  }))

  return (
    <div style={{ animation: 'vIn .26s ease' }}>
      {/* Header */}
      <div style={{ ...card, background: 'linear-gradient(130deg,#022818,#076B3E)', border: 'none', color: '#fff', marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', opacity: .6, marginBottom: 8 }}>Orçamentos</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>Controle de Gastos</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { l: 'Total orçado', v: fmt(totalOrcado), c: '#60C9A0', bg: 'rgba(255,255,255,.12)' },
            { l: 'Gasto até agora', v: fmt(totalGasto), c: '#FCA5A5', bg: 'rgba(255,255,255,.12)' },
            { l: 'Disponível', v: fmt(totalDisp), c: '#FDE68A', bg: 'rgba(255,255,255,.12)' },
          ].map((st, i) => (
            <div key={i} style={{ flex: 1, minWidth: 90, background: st.bg, borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, opacity: .7, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>{st.l}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: st.c }}>{st.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão editar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={() => setShowSetup(true)} style={{
          fontSize: 12, color: '#076B3E', background: '#DCFCE7', border: '1px solid rgba(10,138,82,.2)',
          borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600
        }}>✏️ Editar limites</button>
      </div>

      {/* Categorias */}
      <div style={card}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: '#6B8878', marginBottom: 16 }}>Por categoria</div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#A8BDB5' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🌱</div>
            <div style={{ fontSize: 13 }}>Nenhum gasto registrado ainda</div>
          </div>
        ) : items.map(it => {
          const c = getCat(it.cat)
          const over = it.pct >= 100
          const warn = it.pct >= 80
          const col = over ? '#D63333' : warn ? '#D97706' : '#076B3E'
          return (
            <div key={it.cat} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F0F4F1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: over ? '#FEF2F2' : '#F0F9F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.e}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F17' }}>{it.cat}</div>
                  <div style={{ fontSize: 11, color: '#6B8878' }}>{fmt(it.spent)} de {fmt(it.limit)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: col }}>{it.pct}%</div>
                  {over && <div style={{ fontSize: 9.5, color: '#D63333', fontWeight: 600 }}>ACIMA</div>}
                </div>
              </div>
              <div style={{ height: 6, background: '#F0F4F1', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${it.pct}%`, background: col, borderRadius: 3, transition: 'width .4s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal editar limites */}
      {showSetup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0D1F17', marginBottom: 4 }}>Editar limites mensais</div>
            <div style={{ fontSize: 12, color: '#6B8878', marginBottom: 20 }}>Defina 0 para remover o limite da categoria.</div>
            {DEFAULT_CATS.map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, fontSize: 13, color: '#0D1F17', fontWeight: 500 }}>{cat}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#6B8878' }}>R$</span>
                  <input type="number" placeholder="0" value={limits[cat] || ''}
                    onChange={e => setLimits(prev => ({ ...prev, [cat]: parseFloat(e.target.value) || 0 }))}
                    style={{ width: 80, border: '1.5px solid rgba(10,138,82,.2)', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'Outfit,sans-serif', outline: 'none' }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowSetup(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0D1F17' }}>Fechar</button>
              <button onClick={() => setShowSetup(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#044D2C,#076B3E)', color: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
