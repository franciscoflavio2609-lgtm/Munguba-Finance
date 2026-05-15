import { useApp } from '../../context/AppContext'
import MungubaTree from '../ui/MungubaTree'
import { fmt, getLevel } from '../../data/constants'

export default function MobileMoreScreen({ onNav, onReport, onLogout }) {
  const { state } = useApp()
  const lvl = getLevel(state.xp)
  const userName = state.user?.name || 'Usuário'
  const userEmail = state.user?.email || ''
  const initials = userName.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()

  const MenuItem = ({ icon, label, color, onClick, danger }) => (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:14, width:'100%',
      padding:'14px 20px', background:'none', border:'none',
      borderBottom:'1px solid #F0F4F1', cursor:'pointer', textAlign:'left',
      transition:'background .16s'
    }}
    onMouseOver={e=>e.currentTarget.style.background='#F0F9F4'}
    onMouseOut={e=>e.currentTarget.style.background='none'}>
      <div style={{width:38, height:38, borderRadius:12, background: danger ? '#FEF2F2' : color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
        <span style={{fontSize:18}}>{icon}</span>
      </div>
      <span style={{fontSize:14, fontWeight:600, color: danger ? '#D63333' : '#0D1F17', fontFamily:'Outfit,sans-serif'}}>{label}</span>
      {!danger && <svg style={{marginLeft:'auto', opacity:.3}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
    </button>
  )

  return (
    <div style={{animation:'vIn .26s ease', paddingBottom:80}}>
      {/* Profile card */}
      <div style={{background:'linear-gradient(135deg,#022818,#076B3E)', borderRadius:24, padding:'24px 20px', marginBottom:20, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.05)'}}/>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <div style={{width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#0A8A52,#10C97A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#fff', flexShrink:0}}>
            {initials}
          </div>
          <div>
            <div style={{fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-.01em'}}>{userName}</div>
            <div style={{fontSize:12, color:'rgba(255,255,255,.65)', marginTop:2}}>{userEmail}</div>
            <div style={{fontSize:11, color:'#10C97A', marginTop:4, fontWeight:600}}>⭐ {lvl.n} · {state.xp} XP</div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{background:'#fff', borderRadius:20, overflow:'hidden', marginBottom:14, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.1)'}}>
        <MenuItem icon="📊" label="Relatórios" color="#1D6FA4" onClick={onReport}/>
        <MenuItem icon="📋" label="Orçamentos" color="#076B3E" onClick={()=>onNav('bud')}/>
        <MenuItem icon="🧠" label="Psicologia Financeira" color="#7C3AED" onClick={()=>onNav('ecomp')}/>
        <MenuItem icon="🎓" label="Educação Financeira" color="#4338CA" onClick={()=>onNav('edu')}/>
        <MenuItem icon="💬" label="Assistente IA" color="#0E7490" onClick={()=>onNav('chat')}/>
        <MenuItem icon="❓" label="Tira-Dúvidas" color="#D97706" onClick={()=>onNav('faq')}/>
      </div>

      <div style={{background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.1)'}}>
        <MenuItem icon="🚪" label="Sair da conta" color="#D63333" onClick={onLogout} danger/>
      </div>

      <div style={{textAlign:'center', marginTop:20, fontSize:11, color:'#A8BDB5'}}>
        Munguba Finance v1.0 · Todos os dados são seus
      </div>
    </div>
  )
}
