import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { ACHIEVEMENTS, ACH_CATS, LEVELS, checkAchievements } from '../../data/constants'

export default function AchievementsScreen() {
  const { state, dispatch } = useApp()
  const [catAtiva, setCatAtiva] = useState('todas')
  const [novidade, setNovidade] = useState(null)

  // Verifica conquistas novas automaticamente
  useEffect(() => {
    const earned = checkAchievements(state)
    const anteriores = state.achievements || []
    const novas = earned.filter(id => !anteriores.includes(id))
    if (novas.length > 0) {
      novas.forEach(id => {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id })
        const ach = ACHIEVEMENTS.find(a => a.id === id)
        if (ach) dispatch({ type: 'ADD_XP', payload: ach.xp })
      })
      const primeira = ACHIEVEMENTS.find(a => a.id === novas[0])
      if (primeira) { setNovidade(primeira); setTimeout(() => setNovidade(null), 4000) }
    }
  }, [state.transactions, state.investments, state.dreams])

  const earned = state.achievements || []
  const total = ACHIEVEMENTS.length
  const conquistadas = earned.length
  const pct = Math.round((conquistadas / total) * 100)

  // Calcula nível atual
  const xp = state.xp || 0
  const lvlIdx = LEVELS.reduce((acc, l, i) => xp >= l.min ? i : acc, 0)
  const lvl = LEVELS[lvlIdx]
  const nextLvl = LEVELS[lvlIdx + 1]
  const xpNext = nextLvl ? nextLvl.min - lvl.min : 0
  const xpCurrent = nextLvl ? xp - lvl.min : xp
  const lvlPct = nextLvl ? Math.min(100, Math.round((xpCurrent / xpNext) * 100)) : 100

  const filtered = catAtiva === 'todas'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.cat === catAtiva)

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>

      {/* Notificação de conquista nova */}
      {novidade && (
        <div style={{
          position:'fixed', top:20, right:20, zIndex:999,
          background:'linear-gradient(135deg,#022818,#076B3E)',
          borderRadius:20, padding:'16px 20px', color:'#fff',
          boxShadow:'0 8px 32px rgba(4,77,44,.3)',
          animation:'vIn .3s ease', maxWidth:300
        }}>
          <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>🎉 Nova conquista!</div>
          <div style={{ fontSize:24, marginBottom:4 }}>{novidade.icon}</div>
          <div style={{ fontSize:14, fontWeight:700 }}>{novidade.nome}</div>
          <div style={{ fontSize:11.5, opacity:.8, marginTop:3 }}>{novidade.desc}</div>
          <div style={{ fontSize:11, color:'#86EFAC', marginTop:6 }}>+{novidade.xp} XP</div>
        </div>
      )}

      {/* Header com nível */}
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'22px 24px', color:'#fff', marginBottom:18, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.6, marginBottom:8 }}>Sistema de Conquistas</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
          <div style={{ width:60, height:60, borderRadius:20, background:'rgba(255,255,255,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
            {lvl.n.split(' ').pop()}
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:800 }}>{lvl.n}</div>
            <div style={{ fontSize:12, opacity:.75, marginTop:2 }}>{xp} XP totais</div>
          </div>
        </div>
        {nextLvl && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, opacity:.7, marginBottom:6 }}>
              <span>Próximo: {nextLvl.n}</span>
              <span>{xpCurrent}/{xpNext} XP</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,.15)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:lvlPct+'%', background:'rgba(255,255,255,.8)', borderRadius:3, transition:'width .5s ease' }}/>
            </div>
          </>
        )}
      </div>

      {/* Progresso geral */}
      <div style={{ ...card, marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:4 }}>Conquistas desbloqueadas</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#0D1F17' }}>{conquistadas}<span style={{ fontSize:14, color:'#6B8878', fontWeight:500 }}>/{total}</span></div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:28, fontWeight:800, color:'#076B3E' }}>{pct}%</div>
            <div style={{ fontSize:11, color:'#6B8878' }}>completado</div>
          </div>
        </div>
        <div style={{ height:8, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:pct+'%', background:'linear-gradient(90deg,#076B3E,#0A8A52)', borderRadius:4, transition:'width .6s ease' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, color:'#A8BDB5', marginTop:8 }}>
          <span>🔓 {conquistadas} desbloqueadas</span>
          <span>🔒 {total - conquistadas} restantes</span>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        <button onClick={() => setCatAtiva('todas')} style={{
          padding:'7px 14px', borderRadius:20, border:'1.5px solid',
          borderColor: catAtiva==='todas' ? '#076B3E' : 'rgba(0,0,0,.1)',
          background: catAtiva==='todas' ? '#076B3E' : '#fff',
          color: catAtiva==='todas' ? '#fff' : '#6B8878',
          fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer'
        }}>Todas</button>
        {Object.entries(ACH_CATS).map(([id, cat]) => {
          const count = ACHIEVEMENTS.filter(a => a.cat === id && earned.includes(a.id)).length
          const total = ACHIEVEMENTS.filter(a => a.cat === id).length
          return (
            <button key={id} onClick={() => setCatAtiva(id)} style={{
              padding:'7px 14px', borderRadius:20, border:'1.5px solid',
              borderColor: catAtiva===id ? '#076B3E' : 'rgba(0,0,0,.1)',
              background: catAtiva===id ? '#076B3E' : '#fff',
              color: catAtiva===id ? '#fff' : '#6B8878',
              fontFamily:'Outfit,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer',
              display:'flex', alignItems:'center', gap:5
            }}>
              {cat.icon} {cat.nome}
              <span style={{ fontSize:10, opacity:.7 }}>{count}/{total}</span>
            </button>
          )
        })}
      </div>

      {/* Grid de conquistas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {filtered.map(ach => {
          const isEarned = earned.includes(ach.id)
          return (
            <div key={ach.id} style={{
              background: isEarned ? '#fff' : '#F8F9FA',
              borderRadius:18,
              padding:'16px',
              border: isEarned ? '1.5px solid rgba(10,138,82,.2)' : '1.5px solid #E5E7EB',
              boxShadow: isEarned ? '0 2px 8px rgba(4,77,44,.1)' : 'none',
              transition:'all .2s',
              position:'relative',
              overflow:'hidden'
            }}>
              {isEarned && (
                <div style={{ position:'absolute', top:8, right:8, width:18, height:18, borderRadius:'50%', background:'#076B3E', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff' }}>✓</div>
              )}
              <div style={{ fontSize:30, marginBottom:8, filter: isEarned ? 'none' : 'grayscale(1)', opacity: isEarned ? 1 : 0.4 }}>
                {ach.icon}
              </div>
              <div style={{ fontSize:12.5, fontWeight:700, color: isEarned ? '#0D1F17' : '#A8BDB5', marginBottom:4, lineHeight:1.3 }}>
                {ach.nome}
              </div>
              <div style={{ fontSize:11, color: isEarned ? '#6B8878' : '#C5C9CC', lineHeight:1.5, marginBottom:8 }}>
                {ach.desc}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, fontWeight:700, color: isEarned ? '#076B3E' : '#C5C9CC' }}>
                  +{ach.xp} XP
                </span>
                {isEarned && (
                  <span style={{ fontSize:9, fontWeight:700, background:'#DCFCE7', color:'#076B3E', padding:'2px 6px', borderRadius:6, textTransform:'uppercase', letterSpacing:'.06em' }}>
                    conquistado
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dica */}
      <div style={{ marginTop:16, padding:'14px 18px', background:'linear-gradient(135deg,#022818,#076B3E)', borderRadius:18, color:'#fff' }}>
        <div style={{ fontSize:10, opacity:.6, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:8 }}>💡 Como ganhar mais XP</div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:12.5, opacity:.85 }}>
          <div>→ Registre transações diariamente (+20 XP cada)</div>
          <div>→ Adicione investimentos (+30 XP cada)</div>
          <div>→ Crie sonhos e objetivos (+50 XP cada)</div>
          <div>→ Complete módulos educativos</div>
          <div>→ Desbloqueie conquistas e suba de nível!</div>
        </div>
      </div>
    </div>
  )
}
