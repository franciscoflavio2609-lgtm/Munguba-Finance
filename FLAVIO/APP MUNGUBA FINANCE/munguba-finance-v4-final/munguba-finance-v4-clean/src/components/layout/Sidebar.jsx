import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import MungubaTree from '../ui/MungubaTree'
import { getLevel } from '../../data/constants'

const NAV_ITEMS = [
  { id:'dash', label:'Início', group:'main', color:'#0E7490',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>},
  { id:'txn', label:'Extrato', group:'main', color:'#1D6FA4',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>},
  { id:'bud', label:'Orçamentos', group:'main', color:'#076B3E',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>},
  { id:'inv', label:'Investimentos', group:'main', color:'#7C3AED',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>},
  { id:'drm', label:'Sonhos', group:'main', color:'#B45309',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>},
  { id:'chat', label:'Assistente', group:'tools', color:'#0891B2', badge:true,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
  { id:'ecomp', label:'Econ. Comportamental', group:'tools', color:'#6D28D9',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>},
  { id:'edu', label:'Educação', group:'tools', color:'#4338CA',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>},
  { id:'faq', label:'Tira-Dúvidas', group:'tools', color:'#D97706',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>},
]

export default function Sidebar({ activeView, onNav, onAdd, onReport, onLogout }) {
  const { state } = useApp()
  const [wide, setWide] = useState(false)
  const lvl = getLevel(state.xp)
  const userName = state.user?.name || 'Ana Silva'
  const initials = userName.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()

  return (
    <nav style={{
      width: wide ? 252 : 72,
      background:'#044D2C',
      display:'flex',flexDirection:'column',alignItems: wide?'stretch':'center',
      padding: wide?'14px 10px':'14px 0',
      transition:'width .28s cubic-bezier(.4,0,.2,1)',
      overflow:'hidden',position:'relative',zIndex:20,flexShrink:0
    }}>
      {/* Logo */}
      <div onClick={()=>setWide(!wide)} style={{
        display:'flex',alignItems:'center',gap:10,
        padding: wide?'8px 14px':'8px 10px',
        borderRadius:14,cursor:'pointer',marginBottom:16,width:'100%',
        transition:'background .2s'
      }}
      onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.07)'}
      onMouseOut={e=>e.currentTarget.style.background='transparent'}>
        <MungubaTree size={46} />
        {wide && (
          <div style={{display:'flex',flexDirection:'column'}}>
            <span style={{fontSize:16,fontWeight:800,color:'#fff',letterSpacing:'-.01em',lineHeight:1}}>Munguba Finance</span>
            <span style={{fontSize:9,color:'rgba(255,255,255,.42)',letterSpacing:'.14em',textTransform:'uppercase',marginTop:3}}>Seu Parceiro Financeiro</span>
          </div>
        )}
      </div>

      {/* Add button */}
      <button onClick={onAdd} style={{
        display:'flex',alignItems:'center',justifyContent: wide?'flex-start':'center',
        gap:10,width: wide?'100%':48,height:44,
        padding: wide?'0 12px':0,
        borderRadius:10,cursor:'pointer',border:'none',
        background:'rgba(255,255,255,.12)',marginBottom:8,
        fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:600,
        color:'rgba(255,255,255,.9)',transition:'all .18s'
      }}
      onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
      onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}>
        <div style={{width:30,height:30,borderRadius:8,background:'#059669',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        {wide && <span>Adicionar</span>}
      </button>

      {/* Report button */}
      <button onClick={onReport} style={{
        display:'flex',alignItems:'center',justifyContent: wide?'flex-start':'center',
        gap:10,width: wide?'100%':48,height:44,
        padding: wide?'0 12px':0,
        borderRadius:10,cursor:'pointer',border:'none',
        background:'transparent',marginBottom:12,
        fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:600,
        color:'rgba(255,255,255,.6)',transition:'all .18s'
      }}
      onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='rgba(255,255,255,.9)'}}
      onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.6)'}}>
        <div style={{width:30,height:30,borderRadius:8,background:'#1D6FA4',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,opacity:.85}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        {wide && <span>Relatórios</span>}
      </button>

      {/* Nav groups */}
      {['main','tools'].map(group=>(
        <div key={group} style={{width:'100%',display:'flex',flexDirection:'column',gap:2,marginBottom:4}}>
          {wide && (
            <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',padding:'10px 14px 4px'}}>
              {group==='main'?'Principal':'Ferramentas'}
            </div>
          )}
          {NAV_ITEMS.filter(n=>n.group===group).map(item=>(
            <button key={item.id} onClick={()=>onNav(item.id)} style={{
              display:'flex',alignItems:'center',gap:10,
              width: wide?'100%':48,height:44,
              justifyContent: wide?'flex-start':'center',
              padding: wide?'0 12px':0,
              borderRadius:10,cursor:'pointer',border:'none',
              background: activeView===item.id?'rgba(255,255,255,.12)':'transparent',
              fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:600,
              color: activeView===item.id?'#fff':'rgba(255,255,255,.5)',
              position:'relative',transition:'all .18s',
              whiteSpace:'nowrap'
            }}
            onMouseOver={e=>{if(activeView!==item.id)e.currentTarget.style.background='rgba(255,255,255,.06)'}}
            onMouseOut={e=>{if(activeView!==item.id)e.currentTarget.style.background='transparent'}}>
              <div style={{
                width:30,height:30,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',
                flexShrink:0,background:item.color,
                opacity: activeView===item.id?1:.75,
                transition:'all .18s'
              }}>
                <div style={{width:16,height:16,color:'#fff'}}>{item.icon}</div>
              </div>
              {wide && <span>{item.label}</span>}
              {item.badge && (
                <div style={{
                  position:'absolute',top: wide?11:8,right: wide?12:8,
                  width:7,height:7,background:'#F59E0B',borderRadius:'50%',
                  border:'1.5px solid #044D2C'
                }}/>
              )}
            </button>
          ))}
        </div>
      ))}

      <div style={{flex:1}}/>

      {/* User chip */}
      <div style={{
        display:'flex',alignItems:'center',gap:10,
        background:'rgba(255,255,255,.07)',borderRadius:14,padding:10,
        cursor:'pointer',transition:'background .18s',width:'100%'
      }}
      onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.13)'}
      onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,.07)'}>
        <div style={{
          width:36,height:36,borderRadius:'50%',
          background:'linear-gradient(135deg,#0A8A52,#10C97A)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:13,fontWeight:800,color:'#fff',flexShrink:0
        }}>{initials}</div>
        {wide && (
          <div>
            <div style={{fontSize:12,color:'#fff',fontWeight:700,lineHeight:1}}>{userName}</div>
            <div style={{fontSize:10,color:'#10C97A',marginTop:2,fontWeight:500}}>⭐ Nível {lvl.i+1} — {lvl.n}</div>
          </div>
        )}
      </div>
    </nav>
  )
}
// logout appended
