import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const VIEW_TITLES = {
  dash:'Visão Geral',txn:'Extrato Completo',bud:'Orçamentos',
  inv:'Investimentos',drm:'Meus Sonhos',pht:'Foto & IA',
  chat:'Assistente',ecomp:'Economia Comportamental',edu:'Educação Financeira',faq:'Tira-Dúvidas'
}

export default function Topbar({ activeView, onAdd, onReport }) {
  const { state, dispatch } = useApp()
  const [showNotif, setShowNotif] = useState(false)
  const unread = state.notifications.filter(n=>!n.r).length
  const now = new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short',year:'numeric'})

  return (
    <div style={{
      height:58,background:'#E0F0E8',borderBottom:'1px solid rgba(10,138,82,.15)',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'0 24px',flexShrink:0,zIndex:10,position:'relative'
    }}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontSize:17,fontWeight:700,color:'#0D1F17'}}>{VIEW_TITLES[activeView]||activeView}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:12,color:'#6B8878',fontWeight:500,marginRight:4}}>{now}</span>

        {/* Notifications */}
        <div style={{position:'relative'}}>
          <button onClick={()=>setShowNotif(!showNotif)} style={{
            background:'none',border:'none',cursor:'pointer',padding:8,borderRadius:10,
            color:'#2E4A3A',display:'flex',transition:'background .18s',position:'relative'
          }}
          onMouseOver={e=>e.currentTarget.style.background='#E8F5EE'}
          onMouseOut={e=>e.currentTarget.style.background='none'}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread>0 && <div style={{position:'absolute',top:6,right:6,width:8,height:8,background:'#F59E0B',borderRadius:'50%',border:'2px solid #fff',animation:'ping 2s infinite'}}/>}
          </button>

          {showNotif && (
            <div style={{
              position:'absolute',top:44,right:0,width:360,background:'#F0F9F4',
              borderRadius:24,boxShadow:'0 6px 20px rgba(0,0,0,.08),0 20px 56px rgba(0,0,0,.07)',
              border:'1px solid rgba(0,0,0,.08)',overflow:'hidden',animation:'ndrop .2s ease',zIndex:400
            }}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(0,0,0,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:14,fontWeight:700}}>🔔 Alertas e Insights</span>
                <button onClick={()=>dispatch({type:'READ_ALL_NOTIFS'})} style={{fontSize:11,color:'#076B3E',fontWeight:600,background:'none',border:'none',cursor:'pointer',fontFamily:'Outfit,sans-serif'}}>Marcar todas lidas</button>
              </div>
              <div style={{maxHeight:380,overflowY:'auto'}}>
                {state.notifications.map((n,i)=>(
                  <div key={n.id} onClick={()=>dispatch({type:'READ_NOTIF',idx:i})} style={{
                    padding:'13px 18px',borderBottom:'1px solid rgba(0,0,0,.04)',cursor:'pointer',
                    borderLeft:`3px solid ${n.r?'transparent':n.t==='warn'?'#D97706':n.t==='tip'?'#1D6FA4':'#076B3E'}`,
                    transition:'background .16s'
                  }}
                  onMouseOver={e=>e.currentTarget.style.background='#d0eadc'}
                  onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{fontSize:18,marginBottom:3}}>{n.e}</div>
                    <div style={{fontSize:12,color:'#0D1F17',lineHeight:1.5,fontWeight:500}}>{n.tx}</div>
                    <div style={{fontSize:10,color:'#6B8878',marginTop:3}}>{n.tm}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={onReport} style={{
          display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',
          borderRadius:14,fontSize:13,fontWeight:700,cursor:'pointer',
          background:'#fff',border:'1.5px solid rgba(29,111,164,.3)',color:'#1D6FA4',
          fontFamily:'Outfit,sans-serif',transition:'all .18s'
        }}
        onMouseOver={e=>{e.currentTarget.style.background='#EFF6FF'}}
        onMouseOut={e=>{e.currentTarget.style.background='#fff'}}>
          📊 Relatório
        </button>

        <button onClick={onAdd} style={{
          display:'inline-flex',alignItems:'center',gap:6,padding:'9px 18px',
          borderRadius:14,fontSize:13,fontWeight:700,cursor:'pointer',
          background:'#076B3E',color:'#fff',border:'none',
          fontFamily:'Outfit,sans-serif',boxShadow:'0 4px 20px rgba(4,77,44,.2)',
          transition:'all .18s'
        }}
        onMouseOver={e=>{e.currentTarget.style.background='#044D2C';e.currentTarget.style.transform='translateY(-1px)'}}
        onMouseOut={e=>{e.currentTarget.style.background='#076B3E';e.currentTarget.style.transform='translateY(0)'}}>
          + Adicionar
        </button>
      </div>

      {/* Overlay to close notif */}
      {showNotif && <div onClick={()=>setShowNotif(false)} style={{position:'fixed',inset:0,zIndex:399}}/>}
    </div>
  )
}
