import { useEffect } from 'react'

export default function Toast({ message, onDone }) {
  useEffect(()=>{ if(message){const t=setTimeout(onDone,2800);return()=>clearTimeout(t)} },[message])
  if (!message) return null
  return (
    <div style={{
      position:'fixed',bottom:26,right:26,zIndex:900,
      background:'#044D2C',color:'#fff',padding:'12px 20px',
      borderRadius:14,fontSize:13,fontWeight:700,
      boxShadow:'0 6px 20px rgba(0,0,0,.08)',
      fontFamily:'Outfit,sans-serif',animation:'fadeUp .3s ease'
    }}>{message}</div>
  )
}
