export default function LogoutBtn({ wide, onLogout }) {
  return (
    <button onClick={onLogout} style={{
      display:'flex',alignItems:'center',justifyContent: wide?'flex-start':'center',
      gap:10,width: wide?'100%':48,height:40,
      padding: wide?'0 12px':0,
      borderRadius:10,cursor:'pointer',border:'none',
      background:'transparent',marginTop:6,
      fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:600,
      color:'rgba(255,255,255,.4)',transition:'all .18s'
    }}
    onMouseOver={e=>{e.currentTarget.style.background='rgba(214,51,51,.15)';e.currentTarget.style.color='#FCA5A5'}}
    onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.4)'}}>
      <div style={{width:30,height:30,borderRadius:8,background:'rgba(214,51,51,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2.2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
      {wide && <span>Sair</span>}
    </button>
  )
}
