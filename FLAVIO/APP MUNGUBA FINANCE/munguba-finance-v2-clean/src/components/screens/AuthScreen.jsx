import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import MungubaTree from '../ui/MungubaTree'
import * as db from '../../lib/db'

export default function AuthScreen({ onAuth }) {
  const { dispatch } = useApp()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email:'', pass:'', name:'', last:'', tel:'', pass2:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  const clr = () => setError('')

  const login = async () => {
    if (!form.email || !form.pass) return setError('Preencha e-mail e senha.')
    setLoading(true); clr()
    try {
      await db.signIn({ email: form.email, password: form.pass })
      onAuth()
    } catch (e) {
      setError(e.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : e.message)
    } finally { setLoading(false) }
  }

  const register = async () => {
    if (!form.name||!form.email||!form.tel||!form.pass) return setError('Preencha todos os campos.')
    if (form.pass.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.')
    if (form.pass !== form.pass2) return setError('As senhas não conferem.')
    setLoading(true); clr()
    try {
      await db.signUp({
        name: form.name + (form.last ? ' '+form.last : ''),
        email: form.email, phone: form.tel, password: form.pass
      })
      setError('')
      setTab('login')
      setForm(f=>({...f, pass:'', pass2:''}))
      setError('✅ Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.')
    } catch (e) {
      setError(e.message.includes('already registered') ? 'Este e-mail já está cadastrado.' : e.message)
    } finally { setLoading(false) }
  }

  const inp = {
    width:'100%', border:'1.5px solid rgba(10,138,82,.18)', borderRadius:10,
    padding:'13px 15px', fontSize:14, fontFamily:'Outfit,sans-serif',
    background:'#fff', color:'#0D1F17', outline:'none',
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:900,display:'flex',flexDirection:'column',background:'#E6F2EC'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(140deg,#022818 0%,#044D2C 50%,#076B3E 100%)',padding:'52px 48px 56px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
          <MungubaTree size={40} />
          <div>
            <div style={{fontFamily:'Outfit,sans-serif',fontSize:24,fontWeight:900,color:'#fff',letterSpacing:'-.02em'}}>Munguba Finance</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,.6)',letterSpacing:'.12em',textTransform:'uppercase'}}>Financeiro simples, futuro sólido</div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:-1,left:0,right:0,height:40,background:'#E6F2EC',borderRadius:'50% 50% 0 0/100% 100% 0 0'}}/>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'28px 48px 40px',maxWidth:520,margin:'0 auto',width:'100%'}}>
        {/* Tabs */}
        <div style={{display:'flex',background:'#fff',borderRadius:14,padding:4,marginBottom:20,boxShadow:'0 1px 4px rgba(4,77,44,.1)'}}>
          {[['login','Entrar'],['reg','Criar Conta']].map(([t,l])=>(
            <button key={t} onClick={()=>{setTab(t);clr()}} style={{
              flex:1,padding:11,borderRadius:10,border:'none',fontFamily:'Outfit,sans-serif',
              fontSize:14,fontWeight:700,cursor:'pointer',transition:'all .2s',
              background:tab===t?'#076B3E':'transparent',
              color:tab===t?'#fff':'#6B8878',
              boxShadow:tab===t?'0 2px 10px rgba(7,107,62,.3)':'none'
            }}>{l}</button>
          ))}
        </div>

        {/* Error / success */}
        {error && (
          <div style={{
            padding:'10px 14px',borderRadius:10,marginBottom:14,fontSize:13,lineHeight:1.5,
            background: error.startsWith('✅') ? '#DCFCE7' : '#FEF2F2',
            color: error.startsWith('✅') ? '#076B3E' : '#D63333',
            border: `1px solid ${error.startsWith('✅') ? '#A7F3D0' : '#FCA5A5'}`
          }}>{error}</div>
        )}

        {tab === 'login' ? (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>E-mail</label>
              <input style={inp} type="email" placeholder="seu@email.com" value={form.email} onChange={e=>s('email',e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Senha</label>
              <input style={inp} type="password" placeholder="••••••••" value={form.pass} onChange={e=>s('pass',e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/>
            </div>
            <button onClick={login} disabled={loading} style={{background:'linear-gradient(135deg,#022818,#076B3E)',color:'#fff',border:'none',borderRadius:14,padding:15,fontFamily:'Outfit,sans-serif',fontSize:15,fontWeight:800,cursor:'pointer',opacity:loading?.7:1}}>
              {loading ? 'Entrando...' : 'Entrar na conta'}
            </button>
            <div style={{display:'flex',alignItems:'center',gap:12,color:'#A8BDB5',fontSize:12}}>
              <div style={{flex:1,height:1,background:'rgba(0,0,0,.1)'}}/>ou<div style={{flex:1,height:1,background:'rgba(0,0,0,.1)'}}/>
            </div>
            <button onClick={()=>setTab('reg')} style={{background:'#fff',border:'1.5px solid rgba(0,0,0,.1)',color:'#2E4A3A',borderRadius:14,padding:13,fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:700,cursor:'pointer'}}>
              Não tenho conta — Criar agora
            </button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Nome</label>
                <input style={inp} type="text" placeholder="Flavio" value={form.name} onChange={e=>s('name',e.target.value)}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Sobrenome</label>
                <input style={inp} type="text" placeholder="Souza" value={form.last} onChange={e=>s('last',e.target.value)}/>
              </div>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>E-mail</label>
              <input style={inp} type="email" placeholder="seu@email.com" value={form.email} onChange={e=>s('email',e.target.value)}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Telefone / WhatsApp</label>
              <input style={inp} type="tel" placeholder="(85) 9 0000-0000" value={form.tel} onChange={e=>s('tel',e.target.value)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Senha</label>
                <input style={inp} type="password" placeholder="Mínimo 6 dígitos" value={form.pass} onChange={e=>s('pass',e.target.value)}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:5}}>Confirmar</label>
                <input style={inp} type="password" placeholder="Repita a senha" value={form.pass2} onChange={e=>s('pass2',e.target.value)}/>
              </div>
            </div>
            <button onClick={register} disabled={loading} style={{background:'linear-gradient(135deg,#022818,#076B3E)',color:'#fff',border:'none',borderRadius:14,padding:15,fontFamily:'Outfit,sans-serif',fontSize:15,fontWeight:800,cursor:'pointer',opacity:loading?.7:1}}>
              {loading ? 'Criando conta...' : 'Criar conta gratuita'}
            </button>
            <p style={{fontSize:11,color:'#6B8878',textAlign:'center',lineHeight:1.7}}>
              Ao criar conta você aceita os <span style={{color:'#076B3E',cursor:'pointer'}}>Termos de Uso</span> e a <span style={{color:'#076B3E',cursor:'pointer'}}>Política de Privacidade</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
