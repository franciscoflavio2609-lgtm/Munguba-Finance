import { useState } from 'react'
import MungubaTree from '../ui/MungubaTree'

const OBJETIVOS = [
  { id:'dividas', icon:'💳', titulo:'Sair das dívidas', desc:'Quero organizar e quitar minhas dívidas', cor:'#D63333', bg:'#FEF2F2' },
  { id:'poupar', icon:'🛡️', titulo:'Construir reserva', desc:'Quero ter uma reserva de emergência', cor:'#076B3E', bg:'#DCFCE7' },
  { id:'investir', icon:'📈', titulo:'Começar a investir', desc:'Quero fazer meu dinheiro crescer', cor:'#1D6FA4', bg:'#EFF6FF' },
  { id:'aposentar', icon:'🏖️', titulo:'Me aposentar cedo', desc:'Quero conquistar independência financeira', cor:'#7C3AED', bg:'#F5F3FF' },
  { id:'controle', icon:'📊', titulo:'Controlar gastos', desc:'Quero saber para onde vai meu dinheiro', cor:'#D97706', bg:'#FFF7ED' },
  { id:'familia', icon:'👨‍👩‍👧', titulo:'Cuidar da família', desc:'Quero garantir o futuro da minha família', cor:'#0E7490', bg:'#ECFEFF' },
]

const PERFIS = [
  { id:'iniciante', icon:'🌱', titulo:'Iniciante', desc:'Nunca controlei minhas finanças direito' },
  { id:'basico', icon:'🌿', titulo:'Em desenvolvimento', desc:'Controlo às vezes, quero ser mais consistente' },
  { id:'intermediario', icon:'🌳', titulo:'Intermediário', desc:'Já tenho controle, quero otimizar' },
  { id:'avancado', icon:'🌲', titulo:'Avançado', desc:'Invisto e quero análises mais profundas' },
]

const DICAS_POR_OBJETIVO = {
  dividas: { dica:'Vamos criar um plano para quitar suas dívidas em ordem. O módulo 3 de educação vai te ajudar com estratégias comprovadas.', modulo:'Módulo 3 — Saindo das Dívidas' },
  poupar: { dica:'Sua primeira meta será construir uma reserva de emergência de 3 a 6 meses de gastos. Vou te guiar nesse caminho!', modulo:'Módulo 4 — Reserva de Emergência' },
  investir: { dica:'Começaremos pela base: reserva de emergência, depois os primeiros investimentos. Sem pular etapas!', modulo:'Módulo 5 — Primeiros Investimentos' },
  aposentar: { dica:'Independência financeira é um número, não uma idade. Vamos calcular o seu com o simulador FIRE!', modulo:'Calculadora — Simulador FIRE' },
  controle: { dica:'O termômetro financeiro no dashboard vai te mostrar, em uma frase, se você está dentro ou fora do orçamento.', modulo:'Dashboard — Termômetro Financeiro' },
  familia: { dica:'Vamos configurar orçamentos por categoria para que toda a família saiba os limites de gastos.', modulo:'Módulo 7 — Finanças para Empreendedores' },
}

export default function OnboardingScreen({ onComplete, userId }) {
  const [step, setStep] = useState(0)
  const [objetivo, setObjetivo] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [renda, setRenda] = useState('')
  const [animating, setAnimating] = useState(false)

  const totalSteps = 4
  const chave = (nome) => userId ? `munguba_${nome}_${userId}` : `munguba_${nome}`

  const goNext = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      if (step === totalSteps - 1) {
        if (objetivo) localStorage.setItem(chave('objetivo'), objetivo)
        if (perfil) localStorage.setItem(chave('perfil'), perfil)
        if (renda) localStorage.setItem(chave('renda'), renda)
        // Ao refazer o questionário, remove a marcação de "objetivo conquistado" anterior
        localStorage.removeItem(chave('objetivo_conquistado'))
        localStorage.setItem('munguba_onboarding', 'done')
        onComplete({ objetivo, perfil, renda: parseFloat(renda)||0 })
      } else {
        setStep(s => s + 1)
      }
      setAnimating(false)
    }, 200)
  }

  const goBack = () => { if (step > 0) setStep(s => s - 1) }

  const canNext = [!!objetivo, !!perfil, true, true][step]

  const pct = ((step + 1) / totalSteps) * 100
  const obj = OBJETIVOS.find(o => o.id === objetivo)
  const dica = DICAS_POR_OBJETIVO[objetivo]

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#011A10 0%,#033020 35%,#065530 70%,#0A8A52 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'20px', fontFamily:'Outfit,sans-serif'
    }}>

      {/* Logo + marca */}
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
          <MungubaTree size={56}/>
        </div>
        <div style={{ color:'#fff', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Munguba Finance</div>
        <div style={{ color:'rgba(255,255,255,.5)', fontSize:12, marginTop:3 }}>Seu parceiro para a independência financeira</div>
      </div>

      {/* Barra de progresso */}
      <div style={{ width:'100%', maxWidth:500, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:600 }}>
            {['Seu objetivo','Seu perfil','Sua renda','Tudo pronto!'][step]}
          </span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:600 }}>
            {step+1} de {totalSteps}
          </span>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,.12)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#10C97A,#34D399)', borderRadius:2, transition:'width .5s ease' }}/>
        </div>
        {/* Steps indicators */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
          {['🎯','🌳','💰','🎉'].map((icon,i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background: i <= step ? 'linear-gradient(135deg,#10C97A,#076B3E)' : 'rgba(255,255,255,.12)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, transition:'all .3s ease',
                boxShadow: i === step ? '0 0 0 3px rgba(16,201,122,.3)' : 'none'
              }}>{i < step ? '✓' : icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Card principal */}
      <div style={{
        background:'#fff', borderRadius:28, padding:28, width:'100%', maxWidth:500,
        boxShadow:'0 20px 60px rgba(0,0,0,.3)',
        opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'translateY(0)',
        transition:'all .2s ease'
      }}>

        {/* STEP 0 — Objetivo */}
        {step === 0 && (
          <div>
            <div style={{ textAlign:'center', marginBottom:22 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
              <div style={{ fontSize:20, fontWeight:800, color:'#0D1F17', marginBottom:6 }}>Qual é seu principal objetivo?</div>
              <div style={{ fontSize:13, color:'#6B8878', lineHeight:1.6 }}>Isso vai personalizar o app inteiro para você</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {OBJETIVOS.map(obj => (
                <button key={obj.id} onClick={() => setObjetivo(obj.id)} style={{
                  padding:'14px 12px', borderRadius:16, border:'2px solid',
                  borderColor: objetivo===obj.id ? obj.cor : 'rgba(0,0,0,.07)',
                  background: objetivo===obj.id ? obj.bg : '#FAFAFA',
                  cursor:'pointer', textAlign:'left', transition:'all .18s',
                  transform: objetivo===obj.id ? 'scale(1.02)' : 'scale(1)'
                }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{obj.icon}</div>
                  <div style={{ fontSize:12.5, fontWeight:700, color: objetivo===obj.id ? obj.cor : '#0D1F17', marginBottom:3 }}>{obj.titulo}</div>
                  <div style={{ fontSize:11, color:'#6B8878', lineHeight:1.4 }}>{obj.desc}</div>
                  {objetivo===obj.id && (
                    <div style={{ marginTop:6, fontSize:10, fontWeight:700, color:obj.cor }}>✓ Selecionado</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Perfil */}
        {step === 1 && (
          <div>
            <div style={{ textAlign:'center', marginBottom:22 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🌳</div>
              <div style={{ fontSize:20, fontWeight:800, color:'#0D1F17', marginBottom:6 }}>Como você se descreve?</div>
              <div style={{ fontSize:13, color:'#6B8878', lineHeight:1.6 }}>Sem julgamentos — cada passo da jornada é válido</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {PERFIS.map(p => (
                <button key={p.id} onClick={() => setPerfil(p.id)} style={{
                  padding:'16px', borderRadius:16, border:'2px solid',
                  borderColor: perfil===p.id ? '#076B3E' : 'rgba(0,0,0,.07)',
                  background: perfil===p.id ? '#DCFCE7' : '#FAFAFA',
                  cursor:'pointer', textAlign:'left',
                  display:'flex', alignItems:'center', gap:14, transition:'all .18s'
                }}>
                  <span style={{ fontSize:26 }}>{p.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color: perfil===p.id ? '#076B3E' : '#0D1F17' }}>{p.titulo}</div>
                    <div style={{ fontSize:12, color:'#6B8878', marginTop:2 }}>{p.desc}</div>
                  </div>
                  <div style={{
                    width:22, height:22, borderRadius:'50%',
                    border:`2px solid ${perfil===p.id ? '#076B3E' : '#E0E0E0'}`,
                    background: perfil===p.id ? '#076B3E' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0
                  }}>
                    {perfil===p.id && <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Renda */}
        {step === 2 && (
          <div>
            <div style={{ textAlign:'center', marginBottom:22 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💰</div>
              <div style={{ fontSize:20, fontWeight:800, color:'#0D1F17', marginBottom:6 }}>Qual é sua renda mensal líquida?</div>
              <div style={{ fontSize:13, color:'#6B8878', lineHeight:1.6 }}>
                Opcional — usamos para calcular seus orçamentos e metas ideais. Seus dados ficam só no seu dispositivo 🔒
              </div>
            </div>
            <div style={{ position:'relative', marginBottom:16 }}>
              <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'#6B8878', fontWeight:600 }}>R$</span>
              <input
                type="number" placeholder="Ex: 3.000" value={renda}
                onChange={e => setRenda(e.target.value)}
                style={{
                  width:'100%', border:'2px solid rgba(10,138,82,.2)', borderRadius:14,
                  padding:'16px 16px 16px 46px', fontSize:20, fontFamily:'Outfit,sans-serif',
                  outline:'none', color:'#0D1F17', background:'#F0F9F4',
                  transition:'border-color .2s'
                }}
                onFocus={e => e.target.style.borderColor='#076B3E'}
                onBlur={e => e.target.style.borderColor='rgba(10,138,82,.2)'}
              />
            </div>

            {renda && parseFloat(renda) > 0 ? (
              <div style={{ background:'linear-gradient(135deg,#DCFCE7,#F0FDF4)', borderRadius:18, padding:'18px', animation:'vIn .3s ease' }}>
                <div style={{ fontSize:12, color:'#076B3E', fontWeight:700, marginBottom:12, textAlign:'center' }}>
                  💡 Divisão ideal para R$ {parseFloat(renda).toLocaleString('pt-BR')} (método 50-30-20)
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  {[
                    { l:'Necessidades', pct:'50%', v: parseFloat(renda)*0.5, cor:'#1D6FA4', emoji:'🏠' },
                    { l:'Desejos', pct:'30%', v: parseFloat(renda)*0.3, cor:'#D97706', emoji:'🎉' },
                    { l:'Investir', pct:'20%', v: parseFloat(renda)*0.2, cor:'#076B3E', emoji:'📈' },
                  ].map((item,i) => (
                    <div key={i} style={{ textAlign:'center', background:'rgba(255,255,255,.7)', borderRadius:12, padding:'12px 8px' }}>
                      <div style={{ fontSize:16, marginBottom:4 }}>{item.emoji}</div>
                      <div style={{ fontSize:15, fontWeight:800, color:item.cor }}>
                        R${Math.round(item.v).toLocaleString('pt-BR')}
                      </div>
                      <div style={{ fontSize:9.5, color:'#6B8878', marginTop:2, lineHeight:1.3 }}>{item.l}<br/>{item.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background:'#F8FDF9', borderRadius:14, padding:'14px 16px', border:'1px dashed rgba(10,138,82,.2)' }}>
                <div style={{ fontSize:12.5, color:'#6B8878', lineHeight:1.6, textAlign:'center' }}>
                  Pode pular se preferir — você pode configurar isso depois nas configurações do app.
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Boas-vindas */}
        {step === 3 && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:4, animation:'vIn .4s ease' }}>🎉</div>
            <div style={{ fontSize:22, fontWeight:800, color:'#0D1F17', marginBottom:8 }}>
              Tudo pronto, {localStorage.getItem('munguba_nome_pref') || 'bem-vindo'}!
            </div>
            <div style={{ fontSize:13, color:'#6B8878', lineHeight:1.7, marginBottom:20 }}>
              Seu Munguba Finance está personalizado para te ajudar a{' '}
              <strong style={{ color:'#076B3E' }}>
                {objetivo === 'dividas' && 'sair das dívidas de vez'}
                {objetivo === 'poupar' && 'construir sua reserva de emergência'}
                {objetivo === 'investir' && 'fazer seu dinheiro crescer'}
                {objetivo === 'aposentar' && 'conquistar sua independência financeira'}
                {objetivo === 'controle' && 'ter controle total dos seus gastos'}
                {objetivo === 'familia' && 'garantir o futuro da sua família'}
                {!objetivo && 'alcançar seus objetivos financeiros'}
              </strong>.
            </div>

            {/* XP ganho */}
            <div style={{
              background:'linear-gradient(135deg,#022818,#076B3E)', borderRadius:20,
              padding:'18px 20px', color:'#fff', marginBottom:14
            }}>
              <div style={{ fontSize:11, opacity:.65, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:6 }}>Você ganhou</div>
              <div style={{ fontSize:34, fontWeight:800, marginBottom:4 }}>+100 XP ⭐</div>
              <div style={{ fontSize:12, opacity:.75 }}>Por completar a configuração inicial</div>
            </div>

            {/* Badge */}
            <div style={{ background:'#F5F3FF', borderRadius:18, padding:'16px', marginBottom:16, border:'1.5px solid #E9D5FF' }}>
              <div style={{ fontSize:32, marginBottom:6 }}>🌱</div>
              <div style={{ fontSize:14, fontWeight:800, color:'#7C3AED' }}>Badge: Primeiros Passos</div>
              <div style={{ fontSize:12, color:'#6B8878', marginTop:4, lineHeight:1.5 }}>
                Sua jornada de transformação financeira começa agora!
              </div>
            </div>

            {/* Dica personalizada */}
            {dica && (
              <div style={{ background:'#DCFCE7', borderRadius:16, padding:'14px 16px', marginBottom:16, textAlign:'left' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#076B3E', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>
                  🎯 Sua recomendação personalizada
                </div>
                <div style={{ fontSize:12.5, color:'#2E4A3A', lineHeight:1.6, marginBottom:8 }}>{dica.dica}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'#076B3E', background:'rgba(255,255,255,.6)', padding:'4px 10px', borderRadius:8, display:'inline-block' }}>
                  📖 Comece por: {dica.modulo}
                </div>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:12.5, color:'#6B8878', textAlign:'left' }}>
              {[
                '✅ Objetivo definido e salvo',
                '✅ Dashboard personalizado para você',
                '✅ Termômetro financeiro ativado',
                '✅ Badge e XP conquistados',
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div style={{ display:'flex', gap:10, marginTop:24 }}>
          {step > 0 && step < 3 && (
            <button onClick={goBack} style={{
              padding:'13px 18px', borderRadius:14, border:'1.5px solid rgba(0,0,0,.1)',
              background:'#fff', color:'#0D1F17', fontFamily:'Outfit,sans-serif',
              fontSize:13, fontWeight:600, cursor:'pointer'
            }}>← Voltar</button>
          )}
          <button onClick={goNext} disabled={!canNext} style={{
            flex:1, padding:'15px', borderRadius:14, border:'none',
            background: canNext ? 'linear-gradient(135deg,#044D2C,#076B3E)' : '#E8E8E8',
            color: canNext ? '#fff' : '#A8A8A8',
            fontFamily:'Outfit,sans-serif', fontSize:14, fontWeight:800,
            cursor: canNext ? 'pointer' : 'not-allowed', transition:'all .2s',
            boxShadow: canNext ? '0 4px 14px rgba(7,107,62,.3)' : 'none'
          }}>
            {step === 3 ? '🌳 Entrar no Munguba Finance' : step === 2 && !renda ? 'Pular →' : 'Continuar →'}
          </button>
        </div>

        {step === 0 && (
          <div style={{ textAlign:'center', marginTop:14 }}>
            <button onClick={() => { localStorage.setItem('munguba_onboarding','done'); onComplete({}) }} style={{
              background:'none', border:'none', fontSize:12, color:'#A8BDB5',
              cursor:'pointer', fontFamily:'Outfit,sans-serif', textDecoration:'underline'
            }}>Pular configuração inicial</button>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div style={{ marginTop:20, textAlign:'center', color:'rgba(255,255,255,.3)', fontSize:11 }}>
        🔒 Seus dados são seus. Nunca compartilhamos ou vendemos.
      </div>
    </div>
  )
}
