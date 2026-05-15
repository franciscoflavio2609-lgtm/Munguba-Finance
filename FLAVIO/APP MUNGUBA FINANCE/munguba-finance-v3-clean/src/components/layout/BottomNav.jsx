import MungubaTree from '../ui/MungubaTree'

const NAV = [
  { id:'dash', label:'Início', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { id:'txn', label:'Extrato', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
  { id:'inv', label:'Investir', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
  { id:'drm', label:'Sonhos', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg> },
  { id:'more', label:'Mais', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
]

export default function BottomNav({ activeView, onNav, onAdd }) {
  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:100,
      background:'#fff', borderTop:'1px solid rgba(10,138,82,.12)',
      display:'flex', alignItems:'center',
      paddingBottom:'env(safe-area-inset-bottom, 8px)',
      boxShadow:'0 -4px 20px rgba(0,0,0,.06)'
    }}>
      {NAV.map((item, i) => {
        // Center button = add
        if (i === 2) return (
          <div key="add" style={{flex:1, display:'flex', justifyContent:'center'}}>
            <button onClick={onAdd} style={{
              width:52, height:52, borderRadius:'50%',
              background:'linear-gradient(135deg,#044D2C,#0A8A52)',
              border:'none', cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 16px rgba(4,77,44,.35)',
              marginTop:-16, flexShrink:0
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        )
        const active = activeView === item.id
        return (
          <button key={item.id} onClick={()=>onNav(item.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:3, padding:'8px 0 4px',
            background:'none', border:'none', cursor:'pointer',
            color: active ? '#044D2C' : '#9BB0A8', transition:'color .2s'
          }}>
            <div style={{width:22, height:22}}>{item.icon}</div>
            <span style={{fontSize:10, fontWeight: active ? 700 : 500, fontFamily:'Outfit,sans-serif', letterSpacing:'.02em'}}>{item.label}</span>
            {active && <div style={{width:4, height:4, borderRadius:'50%', background:'#044D2C', marginTop:1}}/>}
          </button>
        )
      })}
    </div>
  )
}
