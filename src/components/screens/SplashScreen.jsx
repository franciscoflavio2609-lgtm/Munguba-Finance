import MungubaTree from '../ui/MungubaTree'

export default function SplashScreen({ onStart }) {
  return (
    <div style={{
      position:'fixed',inset:0,zIndex:1000,
      background:'linear-gradient(150deg,#022818 0%,#044D2C 40%,#076B3E 75%,#0A8A52 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      textAlign:'center',overflow:'hidden'
    }}>
      {/* Animated leaves */}
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          position:'absolute',
          width:[180,120,200,150][i],height:[120,80,130,100][i],
          borderRadius:'50% 0 50% 0',
          background:['#10C97A','#0DAA66','#0A8A52','#10C97A'][i],
          opacity:.08,
          top:i<2?`${[8,15][i]}%`:undefined,
          bottom:i>=2?`${[20,10][i-2]}%`:undefined,
          left:i%2===0?`${[-5,-8][Math.floor(i/2)]}%`:undefined,
          right:i%2!==0?`${[-3,-5][Math.floor(i/2)]}%`:undefined,
          animation:`leafFloat ${8}s ease-in-out ${i*2}s infinite`,
        }}/>
      ))}

      <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{
          marginBottom:24,
          filter:'drop-shadow(0 16px 40px rgba(0,0,0,0.4))',
          animation:'treeIn .8s cubic-bezier(.34,1.56,.64,1) both'
        }}>
          <MungubaTree size={160} />
        </div>

        <div style={{
          fontFamily:'Outfit,sans-serif',fontSize:36,fontWeight:900,color:'#fff',
          letterSpacing:'-.03em',animation:'fadeUp .6s .4s both'
        }}>
          Munguba Finance
        </div>

        <div style={{
          fontSize:13,color:'rgba(255,255,255,.6)',letterSpacing:'.18em',
          textTransform:'uppercase',marginTop:6,marginBottom:40,
          animation:'fadeUp .6s .55s both'
        }}>
          Seu Parceiro Financeiro
        </div>

        <div style={{display:'flex',gap:10,marginBottom:36,animation:'fadeUp .6s .7s both'}}>
          {['● Online','Controle','Educação','Crescimento'].map((pill, i) => (
            <span key={i} style={{
              padding:'6px 16px',borderRadius:30,
              border:'1px solid rgba(255,255,255,.22)',
              background:'rgba(255,255,255,.08)',
              fontSize:11,fontWeight:600,color:'rgba(255,255,255,.8)',
              letterSpacing:'.05em'
            }}>{pill}</span>
          ))}
        </div>

        <button onClick={onStart} style={{
          background:'rgba(255,255,255,.14)',border:'1.5px solid rgba(255,255,255,.36)',
          color:'#fff',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,
          padding:'16px 56px',borderRadius:40,cursor:'pointer',
          letterSpacing:'.02em',animation:'fadeUp .6s .85s both',
          transition:'all .22s'
        }}
        onMouseOver={e=>{e.target.style.background='rgba(255,255,255,.26)';e.target.style.transform='translateY(-2px)'}}
        onMouseOut={e=>{e.target.style.background='rgba(255,255,255,.14)';e.target.style.transform='translateY(0)'}}>
          Começar agora →
        </button>
      </div>

      <span style={{position:'absolute',bottom:28,fontSize:11,color:'rgba(255,255,255,.3)'}}>
        v1.0 · Munguba Finance
      </span>
    </div>
  )
}
