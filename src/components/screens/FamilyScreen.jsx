import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { fmt, getCat } from '../../data/constants'
import * as db from '../../lib/db'

export default function FamilyScreen() {
  const { state } = useApp()
  const [familia, setFamilia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modo, setModo] = useState(null) // 'criar' | 'entrar' | null
  const [nomeFamilia, setNomeFamilia] = useState('')
  const [codigoConvite, setCodigoConvite] = useState('')
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)
  const [transacoesFamilia, setTransacoesFamilia] = useState([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [goalForm, setGoalForm] = useState({ name:'', target:'', icon:'🏡' })
  const [metasFamilia, setMetasFamilia] = useState([])

  const userId = state.session?.user?.id
  const nomeUsuario = state.user?.name || 'Usuário'

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    carregarFamilia()
  }, [userId])

  const carregarFamilia = async () => {
    setLoading(true)
    try {
      const f = await db.buscarMinhaFamilia(userId)
      setFamilia(f)
      if (f) {
        const memberIds = f.membros.map(m => m.user_id)
        const [txns, metas] = await Promise.all([
          db.buscarTransacoesFamilia(f.id, memberIds),
          db.buscarMetasFamilia(f.id)
        ])
        setTransacoesFamilia(txns)
        setMetasFamilia(metas)
      }
    } catch (e) {
      console.warn('Erro ao carregar família:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCriar = async () => {
    if (!nomeFamilia.trim()) return setErro('Digite um nome para a família.')
    setProcessando(true); setErro('')
    try {
      await db.criarFamilia(userId, nomeFamilia.trim(), nomeUsuario)
      await carregarFamilia()
      setModo(null); setNomeFamilia('')
    } catch (e) {
      setErro(e.message || 'Erro ao criar família.')
    } finally {
      setProcessando(false)
    }
  }

  const handleEntrar = async () => {
    if (!codigoConvite.trim()) return setErro('Digite o código de convite.')
    setProcessando(true); setErro('')
    try {
      await db.entrarNaFamilia(userId, codigoConvite.trim(), nomeUsuario)
      await carregarFamilia()
      setModo(null); setCodigoConvite('')
    } catch (e) {
      setErro(e.message || 'Erro ao entrar na família.')
    } finally {
      setProcessando(false)
    }
  }

  const handleSair = async () => {
    if (!confirm('Tem certeza que deseja sair desta família?')) return
    try {
      await db.sairDaFamilia(userId, familia.id)
      setFamilia(null)
      setTransacoesFamilia([])
      setMetasFamilia([])
    } catch (e) {
      alert('Erro ao sair da família: ' + e.message)
    }
  }

  const handleCriarMeta = async () => {
    if (!goalForm.name || !goalForm.target) return alert('Preencha nome e valor da meta.')
    try {
      const nova = await db.criarMetaFamilia(familia.id, userId, {
        name: goalForm.name, target: parseFloat(goalForm.target), icon: goalForm.icon, current: 0
      })
      setMetasFamilia(prev => [nova, ...prev])
      setGoalForm({ name:'', target:'', icon:'🏡' })
      setShowGoalForm(false)
    } catch (e) {
      alert('Erro ao criar meta: ' + e.message)
    }
  }

  // ── Estatísticas agregadas da família ──
  const stats = useMemo(() => {
    const inc = transacoesFamilia.filter(t => t.type === 'income').reduce((a,t) => a + Number(t.val||0), 0)
    const exp = transacoesFamilia.filter(t => t.type !== 'income').reduce((a,t) => a + Number(t.val||0), 0)

    const porMembro = {}
    transacoesFamilia.forEach(t => {
      if (!porMembro[t.user_id]) porMembro[t.user_id] = { inc: 0, exp: 0 }
      if (t.type === 'income') porMembro[t.user_id].inc += Number(t.val||0)
      else porMembro[t.user_id].exp += Number(t.val||0)
    })

    return { inc, exp, bal: inc - exp, porMembro }
  }, [transacoesFamilia])

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }
  const inputStyle = { width:'100%', border:'1.5px solid rgba(10,138,82,.2)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', color:'#0D1F17' }

  if (loading) {
    return (
      <div style={{ ...card, textAlign:'center', padding:'48px 20px' }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
        <div style={{ fontSize:14, color:'#6B8878' }}>Carregando informações da família...</div>
      </div>
    )
  }

  // ═══ TELA: SEM FAMÍLIA — CRIAR OU ENTRAR ═══
  if (!familia) {
    return (
      <div style={{ animation:'vIn .26s ease' }}>
        <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'24px', color:'#fff', marginBottom:20 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.6, marginBottom:8 }}>Modo Família</div>
          <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>👨‍👩‍👧 Controle financeiro em conjunto</div>
          <div style={{ fontSize:13, opacity:.78, lineHeight:1.6 }}>Compartilhe orçamento, veja gastos em conjunto e conquistem metas juntos — casal, família ou república.</div>
        </div>

        {!modo && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="inv-grid">
            <div style={{ ...card, textAlign:'center', cursor:'pointer' }} onClick={() => setModo('criar')}>
              <div style={{ fontSize:36, marginBottom:12 }}>➕</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#0D1F17', marginBottom:6 }}>Criar Família</div>
              <div style={{ fontSize:12, color:'#6B8878', lineHeight:1.5 }}>Comece um novo grupo e convide as pessoas</div>
            </div>
            <div style={{ ...card, textAlign:'center', cursor:'pointer' }} onClick={() => setModo('entrar')}>
              <div style={{ fontSize:36, marginBottom:12 }}>🔑</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#0D1F17', marginBottom:6 }}>Entrar com Código</div>
              <div style={{ fontSize:12, color:'#6B8878', lineHeight:1.5 }}>Já tem um convite? Digite o código aqui</div>
            </div>
          </div>
        )}

        {modo === 'criar' && (
          <div style={card}>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D1F17', marginBottom:16 }}>Criar nova família</div>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:6 }}>Nome da família</label>
            <input value={nomeFamilia} onChange={e=>setNomeFamilia(e.target.value)} placeholder="Ex: Família Silva" style={{...inputStyle, marginBottom:14}}/>
            {erro && <div style={{ color:'#D63333', fontSize:12, marginBottom:12 }}>{erro}</div>}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setModo(null); setErro('') }} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid rgba(0,0,0,.1)', background:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancelar</button>
              <button onClick={handleCriar} disabled={processando} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', opacity:processando?0.6:1 }}>{processando ? '...' : 'Criar'}</button>
            </div>
          </div>
        )}

        {modo === 'entrar' && (
          <div style={card}>
            <div style={{ fontSize:15, fontWeight:700, color:'#0D1F17', marginBottom:16 }}>Entrar em uma família</div>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:6 }}>Código de convite</label>
            <input value={codigoConvite} onChange={e=>setCodigoConvite(e.target.value.toUpperCase())} placeholder="Ex: A3B7K9" maxLength={6} style={{...inputStyle, marginBottom:14, textTransform:'uppercase', letterSpacing:'.1em', textAlign:'center', fontSize:18, fontWeight:700}}/>
            {erro && <div style={{ color:'#D63333', fontSize:12, marginBottom:12 }}>{erro}</div>}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setModo(null); setErro('') }} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid rgba(0,0,0,.1)', background:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancelar</button>
              <button onClick={handleEntrar} disabled={processando} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', opacity:processando?0.6:1 }}>{processando ? '...' : 'Entrar'}</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ═══ TELA: COM FAMÍLIA ATIVA ═══
  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'24px', color:'#fff', marginBottom:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.6, marginBottom:6 }}>Modo Família</div>
            <div style={{ fontSize:20, fontWeight:800 }}>👨‍👩‍👧 {familia.name}</div>
          </div>
          <button onClick={handleSair} style={{ fontSize:11, background:'rgba(255,255,255,.15)', border:'none', color:'#fff', padding:'6px 12px', borderRadius:10, cursor:'pointer' }}>Sair</button>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(255,255,255,.1)', borderRadius:12, padding:'10px 14px' }}>
          <span style={{ fontSize:11, opacity:.7 }}>Código de convite:</span>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:'.1em' }}>{familia.invite_code}</span>
          <button onClick={() => { navigator.clipboard.writeText(familia.invite_code); alert('Código copiado!') }} style={{ marginLeft:'auto', fontSize:10, background:'rgba(255,255,255,.2)', border:'none', color:'#fff', padding:'4px 10px', borderRadius:8, cursor:'pointer' }}>Copiar</button>
        </div>
      </div>

      {/* Estatísticas agregadas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
        {[
          { label:'Receita da Família', val:fmt(stats.inc), col:'#076B3E', bg:'#DCFCE7' },
          { label:'Despesas da Família', val:fmt(stats.exp), col:'#D63333', bg:'#FEF2F2' },
          { label:'Saldo Conjunto', val:fmt(stats.bal), col:'#1D6FA4', bg:'#EFF6FF' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding:'14px 16px', background:s.bg, border:'none' }}>
            <div style={{ fontSize:16, fontWeight:800, color:s.col }}>{s.val}</div>
            <div style={{ fontSize:10, color:s.col, opacity:.8, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Membros */}
      <div style={{ ...card, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>Membros ({familia.membros.length})</div>
        {familia.membros.map(m => {
          const mstat = stats.porMembro[m.user_id] || { inc:0, exp:0 }
          const isMe = m.user_id === userId
          return (
            <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F0F4F1' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#0A8A52,#10C97A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>
                {(m.member_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{m.member_name || 'Usuário'} {isMe && <span style={{ fontSize:10, color:'#076B3E' }}>(você)</span>}</div>
                <div style={{ fontSize:11, color:'#6B8878' }}>Receitas: {fmt(mstat.inc)} · Despesas: {fmt(mstat.exp)}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Metas da família */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878' }}>Metas da Família</div>
          <button onClick={() => setShowGoalForm(true)} style={{ fontSize:11, color:'#fff', background:'#076B3E', border:'none', borderRadius:10, padding:'7px 14px', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontWeight:700 }}>+ Nova meta</button>
        </div>

        {metasFamilia.length === 0 ? (
          <div style={{ textAlign:'center', padding:'24px 0', color:'#A8BDB5' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🎯</div>
            <div style={{ fontSize:13 }}>Nenhuma meta conjunta ainda</div>
          </div>
        ) : metasFamilia.map(meta => {
          const pct = meta.target > 0 ? Math.min(100, Math.round((meta.current/meta.target)*100)) : 0
          return (
            <div key={meta.id} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{meta.icon} {meta.name}</span>
                <span style={{ fontSize:13, fontWeight:800, color:'#076B3E' }}>{pct}%</span>
              </div>
              <div style={{ height:8, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:pct+'%', background:'#076B3E', borderRadius:4 }}/>
              </div>
              <div style={{ fontSize:11, color:'#6B8878', marginTop:4 }}>{fmt(meta.current)} de {fmt(meta.target)}</div>
            </div>
          )
        })}
      </div>

      {showGoalForm && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:24, padding:24, width:'100%', maxWidth:400 }}>
            <div style={{ fontSize:16, fontWeight:800, color:'#0D1F17', marginBottom:18 }}>Nova meta da família</div>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:5 }}>Nome</label>
            <input value={goalForm.name} onChange={e=>setGoalForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Viagem em família" style={{...inputStyle, marginBottom:12}}/>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', color:'#6B8878', marginBottom:5 }}>Valor alvo (R$)</label>
            <input type="number" value={goalForm.target} onChange={e=>setGoalForm(f=>({...f,target:e.target.value}))} placeholder="8000" style={{...inputStyle, marginBottom:20}}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowGoalForm(false)} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid rgba(0,0,0,.1)', background:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancelar</button>
              <button onClick={handleCriarMeta} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'#076B3E', color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Criar meta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
