import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { CATS, getCat } from '../../data/constants'
import { parseVoiceTransaction, verificarSuporteVoz, criarReconhecimentoVoz } from '../../lib/voiceParser'

export default function AddTransactionModal({ onClose, onSaved }) {
  const { addTransaction } = useApp()
  const [type, setType] = useState('income')
  const [form, setForm] = useState({date: new Date().toISOString().split('T')[0], val:'', desc:'', cat:''})
  const [ouvindo, setOuvindo] = useState(false)
  const [vozDisponivel, setVozDisponivel] = useState(false)
  const [avisoVoz, setAvisoVoz] = useState('')
  const [ultimoTexto, setUltimoTexto] = useState('')
  const [salvando, setSalvando] = useState(false)
  const recognitionRef = useRef(null)

  const s = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => {
    setVozDisponivel(verificarSuporteVoz())
  }, [])

  const iniciarEscuta = () => {
    const recognition = criarReconhecimentoVoz()
    if (!recognition) {
      setAvisoVoz('Seu navegador não suporta reconhecimento de voz. Tente pelo Chrome ou Edge.')
      return
    }
    recognitionRef.current = recognition
    setAvisoVoz('')
    setOuvindo(true)

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript
      setUltimoTexto(texto)
      const resultado = parseVoiceTransaction(texto)

      if (!resultado.sucesso) {
        setAvisoVoz(resultado.erro)
        setOuvindo(false)
        return
      }

      // Preenche o formulário automaticamente com o que foi reconhecido
      setType(resultado.tipo)
      setForm({
        date: new Date().toISOString().split('T')[0],
        val: String(resultado.valor),
        desc: resultado.descricao,
        cat: resultado.categoria
      })
      setAvisoVoz(`🎤 Entendi: "${texto}"`)
      setOuvindo(false)
    }

    recognition.onerror = (event) => {
      setOuvindo(false)
      if (event.error === 'no-speech') {
        setAvisoVoz('Não consegui ouvir nada. Tente novamente falando mais perto do microfone.')
      } else if (event.error === 'not-allowed') {
        setAvisoVoz('Permita o acesso ao microfone nas configurações do navegador.')
      } else {
        setAvisoVoz('Ocorreu um erro ao ouvir. Tente novamente.')
      }
    }

    recognition.onend = () => setOuvindo(false)

    recognition.start()
  }

  const pararEscuta = () => {
    recognitionRef.current?.stop()
    setOuvindo(false)
  }

  const save = async () => {
    if (!form.val || parseFloat(form.val) <= 0) return alert('Informe um valor maior que zero.')
    if (!form.desc.trim()) return alert('Informe uma descrição.')
    if (!form.date) return alert('Selecione a data.')
    if (!form.cat) return alert('Selecione uma categoria.')
    setSalvando(true)
    try {
      await addTransaction({
        date: form.date, desc: form.desc,
        cat: form.cat, val: parseFloat(form.val), type
      })
      onSaved?.('✅ Transação salva! +20 XP')
      onClose()
    } catch (e) {
      alert('Erro ao salvar a transação. Tente novamente.')
      setSalvando(false)
    }
  }

  const inputStyle = {
    width:'100%',border:'1.5px solid rgba(10,138,82,.18)',borderRadius:10,
    padding:'11px 13px',fontSize:14,fontFamily:'Outfit,sans-serif',
    background:'#f0f8f4',color:'#0D1F17',outline:'none',
  }

  const typeColors = {income:['#059669','#076B3E'],fixed:['#D63333','#b91c1c'],variable:['#D97706','#b45309']}

  return (
    <div style={{position:'fixed',inset:0,zIndex:600,background:'rgba(4,40,24,.42)',backdropFilter:'blur(5px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#fff',borderRadius:32,padding:26,width:'100%',maxWidth:500,boxShadow:'0 6px 20px rgba(0,0,0,.08)',animation:'mPop .24s cubic-bezier(.34,1.56,.64,1)',maxHeight:'88vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <span style={{fontSize:18,fontWeight:800,color:'#0D1F17'}}>Nova Transação</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:'50%',background:'#E6F2EC',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,color:'#2E4A3A'}}>✕</button>
        </div>

        {/* Botão de registro por voz */}
        {vozDisponivel && (
          <div style={{marginBottom:18}}>
            <button
              onClick={ouvindo ? pararEscuta : iniciarEscuta}
              style={{
                width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                padding:'14px', borderRadius:16, border:'none', cursor:'pointer',
                background: ouvindo ? 'linear-gradient(135deg,#D63333,#B91C1C)' : 'linear-gradient(135deg,#022818,#076B3E)',
                color:'#fff', fontFamily:'Outfit,sans-serif', fontSize:13.5, fontWeight:700,
                boxShadow: ouvindo ? '0 4px 20px rgba(214,51,51,.3)' : '0 4px 20px rgba(4,77,44,.25)',
                animation: ouvindo ? 'pulse 1.2s infinite' : 'none'
              }}
            >
              <span style={{fontSize:18}}>{ouvindo ? '🔴' : '🎤'}</span>
              {ouvindo ? 'Ouvindo... toque para parar' : 'Registrar por voz'}
            </button>
            {!ouvindo && (
              <div style={{fontSize:10.5, color:'#A8BDB5', textAlign:'center', marginTop:6}}>
                Diga algo como: "Gastei 50 reais no mercado"
              </div>
            )}
            {avisoVoz && (
              <div style={{
                marginTop:10, padding:'10px 14px', borderRadius:12, fontSize:12,
                background: avisoVoz.startsWith('🎤') ? '#DCFCE7' : '#FFF7ED',
                color: avisoVoz.startsWith('🎤') ? '#076B3E' : '#92702A',
                lineHeight:1.5
              }}>
                {avisoVoz}
              </div>
            )}
          </div>
        )}

        {/* Type selector */}
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:6}}>Tipo</label>
          <div style={{display:'flex',gap:3,background:'#E6F2EC',borderRadius:10,padding:3}}>
            {[['income','📈 Receita'],['fixed','🏠 Fixo'],['variable','🛍️ Variável']].map(([t,l])=>(
              <button key={t} onClick={()=>{setType(t);s('cat','')}} style={{
                flex:1,padding:'9px 6px',borderRadius:8,border:'none',
                fontFamily:'Outfit,sans-serif',fontSize:12,fontWeight:700,cursor:'pointer',
                background: type===t ? typeColors[t][0] : 'transparent',
                color: type===t ? '#fff' : '#6B8878',
                transition:'all .18s'
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:6}}>Data</label>
            <input style={inputStyle} type="date" value={form.date} onChange={e=>s('date',e.target.value)}/>
          </div>
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:6}}>Valor (R$)</label>
            <input style={inputStyle} type="number" placeholder="0,00" step="0.01" min="0.01" value={form.val} onChange={e=>s('val',e.target.value)}/>
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:6}}>Descrição</label>
          <input style={inputStyle} type="text" placeholder="Ex: Supermercado, Salário..." value={form.desc} onChange={e=>s('desc',e.target.value)}/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B8878',marginBottom:6}}>Categoria</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7}}>
            {CATS[type].map(c=>(
              <button key={c.n} onClick={()=>s('cat',c.n)} style={{
                display:'flex',flexDirection:'column',alignItems:'center',
                padding:'10px 5px',borderRadius:10,
                border: form.cat===c.n ? '1.5px solid #076B3E' : '1.5px solid rgba(0,0,0,.08)',
                background: form.cat===c.n ? '#076B3E' : '#E6F2EC',
                cursor:'pointer',fontFamily:'Outfit,sans-serif',transition:'all .16s'
              }}>
                <span style={{fontSize:19,marginBottom:4}}>{c.e}</span>
                <span style={{fontSize:8.5,fontWeight:700,color:form.cat===c.n?'rgba(255,255,255,.88)':'#6B8878',textTransform:'uppercase',letterSpacing:'.07em',textAlign:'center'}}>{c.n}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:'11px',borderRadius:14,border:'1.5px solid rgba(0,0,0,.11)',background:'#fff',color:'#0D1F17',fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:700,cursor:'pointer'}}>Cancelar</button>
          <button onClick={save} disabled={salvando} style={{flex:2,padding:'11px',borderRadius:14,border:'none',background:'#076B3E',color:'#fff',fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:700,cursor: salvando ? 'wait' : 'pointer',boxShadow:'0 4px 20px rgba(4,77,44,.2)',opacity: salvando ? 0.7 : 1}}>{salvando ? '⏳ Salvando...' : '✓ Confirmar'}</button>
        </div>
      </div>
    </div>
  )
}
