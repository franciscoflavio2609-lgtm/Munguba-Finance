const MODULES = [
  { num:1, icon:'🧠', title:'Mentalidade Financeira', desc:'Quebre crenças limitantes sobre dinheiro e desenvolva uma mentalidade de abundância.', topics:['Por que não guardo dinheiro?','Gatilhos emocionais do gasto','Os 7 hábitos financeiros'], color:'#7C3AED', bg:'#F5F3FF' },
  { num:2, icon:'📊', title:'Controle Financeiro', desc:'Domine seu fluxo de caixa e saiba exatamente para onde vai cada centavo.', topics:['Método 50-30-20','Orçamento base zero','Planilha de controle'], color:'#076B3E', bg:'#DCFCE7' },
  { num:3, icon:'💳', title:'Saindo das Dívidas', desc:'Estratégias comprovadas para eliminar dívidas e recuperar a paz financeira.', topics:['Método avalanche vs bola de neve','Renegociação de dívidas','Histórico de crédito'], color:'#D63333', bg:'#FEF2F2' },
  { num:4, icon:'🛡️', title:'Reserva de Emergência', desc:'Construa um colchão financeiro que te protege de qualquer imprevisto.', topics:['Quanto guardar?','Onde guardar?','Tesouro Selic na prática'], color:'#0E7490', bg:'#ECFEFF' },
  { num:5, icon:'📈', title:'Primeiros Investimentos', desc:'Comece a fazer seu dinheiro trabalhar por você, do zero ao avançado.', topics:['Renda fixa vs variável','Tesouro Direto para iniciantes','FIIs: renda passiva mensal'], color:'#1D6FA4', bg:'#EFF6FF' },
  { num:6, icon:'🗺️', title:'Planejamento de Longo Prazo', desc:'Trace o caminho para a independência financeira e aposentadoria tranquila.', topics:['Juros compostos na prática','PGBL vs VGBL','FIRE: liberdade financeira'], color:'#B45309', bg:'#FFFBEB' },
  { num:7, icon:'🏢', title:'Empreendedorismo Financeiro', desc:'Gerencie as finanças do seu negócio com profissionalismo e clareza.', topics:['Separar PF de PJ','Fluxo de caixa empresarial','Simples Nacional e impostos'], color:'#D97706', bg:'#FFF7ED' },
]

export default function EducationScreen() {
  const card = { background:'#fff', borderRadius:24, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)', overflow:'hidden' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'24px 28px', color:'#fff', marginBottom:20, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:8 }}>Curso Completo</div>
        <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-.02em', marginBottom:6 }}>Educação Financeira</div>
        <div style={{ fontSize:13, opacity:.75, lineHeight:1.6, marginBottom:16 }}>7 módulos para transformar completamente sua relação com o dinheiro — do zero à independência financeira.</div>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ background:'rgba(255,255,255,.12)', borderRadius:12, padding:'8px 16px', fontSize:12, fontWeight:600 }}>7 módulos</div>
          <div style={{ background:'rgba(255,255,255,.12)', borderRadius:12, padding:'8px 16px', fontSize:12, fontWeight:600 }}>14h de conteúdo</div>
          <div style={{ background:'rgba(255,255,255,.12)', borderRadius:12, padding:'8px 16px', fontSize:12, fontWeight:600 }}>Certificado</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
        {MODULES.map((m,i) => (
          <div key={i} style={card}>
            <div style={{ background:m.bg, padding:'18px 20px 14px', borderBottom:'1px solid rgba(0,0,0,.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <span style={{ fontSize:26 }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:m.color, opacity:.7, marginBottom:2 }}>Módulo {m.num}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0D1F17' }}>{m.title}</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:'#6B8878', lineHeight:1.55 }}>{m.desc}</div>
            </div>
            <div style={{ padding:'14px 20px' }}>
              <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#6B8878', marginBottom:8 }}>O que você vai aprender</div>
              {m.topics.map((t,j) => (
                <div key={j} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#2E4A3A', padding:'5px 0', borderBottom:j<m.topics.length-1?'1px solid #F0F4F1':'none' }}>
                  <span style={{ color:m.color, fontWeight:700 }}>→</span>{t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
