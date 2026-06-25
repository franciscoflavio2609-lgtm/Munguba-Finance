import { useState, useEffect } from 'react'

// ─── API do Banco Central do Brasil (totalmente pública, sem token) ───
// Docs: https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui3
// Séries temporais: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados/ultimos/{n}

const BCB = {
  selic:    11,    // Taxa Selic diária
  ipca:     433,   // IPCA mensal
  cdi:      12,    // CDI diário
  poup:     195,   // Poupança mensal
  usd:      1,     // Dólar comercial
  euro:     21619, // Euro
  igpm:     189,   // IGP-M mensal
  dolarTx:  3698,  // Taxa de câmbio USD
}

const FOCUS_URL = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativaMercadoTop5Anuais?$filter=Indicador%20eq%20%27IPCA%27%20and%20tipoCalculo%20eq%20%27C5%27&$top=5&$format=json&$select=Indicador,Data,Media,Mediana'
const SELIC_META_URL = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%2706-24-2026%27&$top=1&$format=json&$select=cotacaoCompra,cotacaoVenda'

async function fetchSerie(codigo, n = 1) {
  const r = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados/ultimos/${n}?formato=json`)
  if (!r.ok) throw new Error('Erro BCB')
  return r.json()
}

async function fetchPTAX() {
  // Dólar PTAX via API oficial do BCB
  const hoje = new Date()
  // Tenta os últimos 7 dias para garantir dado disponível (PTAX só em dias úteis)
  for (let d = 0; d < 7; d++) {
    const dt = new Date(hoje); dt.setDate(dt.getDate() - d)
    const mm = String(dt.getMonth()+1).padStart(2,'0')
    const dd = String(dt.getDate()).padStart(2,'0')
    const yyyy = dt.getFullYear()
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${mm}-${dd}-${yyyy}%27&$top=1&$format=json&$select=cotacaoCompra,cotacaoVenda`
    try {
      const r = await fetch(url)
      if (!r.ok) continue
      const j = await r.json()
      if (j?.value?.length > 0) return j.value[0]
    } catch(e) { continue }
  }
  return null
}

async function fetchFocus() {
  const url = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativaMercadoTop5Anuais?$filter=Indicador%20eq%20%27IPCA%27%20and%20tipoCalculo%20eq%20%27C5%27&$top=3&$orderby=Data%20desc&$format=json&$select=Indicador,Data,Media,Mediana'
  const r = await fetch(url)
  if (!r.ok) throw new Error()
  const j = await r.json()
  return j?.value?.[0] || null
}

const fmt2 = v => v != null ? Number(v).toFixed(2) : '—'
const fmtPct = v => v != null ? Number(v).toFixed(2) + '%' : '—'

const INDICADORES_INFO = {
  selic: { nome:'Taxa Selic', desc:'Taxa básica de juros da economia brasileira, definida pelo COPOM a cada 45 dias. Referência para todos os investimentos de renda fixa.', unidade:'% a.a.', fonte:'Banco Central do Brasil', impacto: v => v > 12 ? { texto:'Alta — renda fixa muito atrativa. Momento de aproveitar CDB, Tesouro Selic e LCI.', cor:'#076B3E' } : v > 8 ? { texto:'Moderada — equilíbrio entre renda fixa e variável.', cor:'#D97706' } : { texto:'Baixa — favorece ações e FIIs. Renda fixa perde atratividade.', cor:'#1D6FA4' } },
  ipca:  { nome:'IPCA (Inflação)', desc:'Índice Oficial de Preços ao Consumidor Amplo, calculado pelo IBGE. Mede a inflação oficial do Brasil. Investimentos abaixo do IPCA perdem poder de compra.', unidade:'% no mês', fonte:'IBGE via Banco Central', impacto: v => v > 0.8 ? { texto:'Inflação alta no mês — priorize Tesouro IPCA+ para proteger poder de compra.', cor:'#D63333' } : v > 0.3 ? { texto:'Inflação controlada — atenção para manter retornos acima da inflação.', cor:'#D97706' } : { texto:'Inflação baixa — bom ambiente para investimentos.', cor:'#076B3E' } },
  cdi:   { nome:'CDI', desc:'Taxa de referência para a maioria dos investimentos de renda fixa. Acompanha de perto a Selic. CDBs, LCIs e LCAs geralmente são indexados ao CDI.', unidade:'% a.a.', fonte:'Banco Central do Brasil', impacto: v => ({ texto:'Referência de rentabilidade. Use para comparar seus investimentos de renda fixa: 100% CDI ou mais é o mínimo aceitável.', cor:'#1D6FA4' }) },
  poup:  { nome:'Poupança', desc:'Rendimento mensal da caderneta de poupança. Quando a Selic está acima de 8,5% a.a., rende 0,5% ao mês + TR. Frequentemente perde para o IPCA no longo prazo.', unidade:'% no mês', fonte:'Banco Central do Brasil', impacto: v => ({ texto:'A poupança rende menos que o CDI e muitas vezes menos que a inflação. Existem opções melhores com a mesma segurança, como o Tesouro Selic.', cor:'#D63333' }) },
}

export default function RadarScreen() {
  const [dados, setDados] = useState({})
  const [ptax, setPtax] = useState(null)
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    let mounted = true
    const carregar = async () => {
      try {
        const [selicArr, ipcaArr, cdiArr, poupArr, ptaxData, focusData] = await Promise.all([
          fetchSerie(BCB.selic, 1),
          fetchSerie(BCB.ipca, 1),
          fetchSerie(BCB.cdi, 1),
          fetchSerie(BCB.poup, 1),
          fetchPTAX(),
          fetchFocus().catch(() => null),
        ])
        if (!mounted) return

        // Selic anualiza: dado diário em % → anual
        const selicDiario = parseFloat(selicArr?.[0]?.valor?.replace(',','.'))
        const selicAnual = selicDiario ? ((Math.pow(1 + selicDiario/100, 252) - 1) * 100) : null

        // CDI anualiza igual
        const cdiDiario = parseFloat(cdiArr?.[0]?.valor?.replace(',','.'))
        const cdiAnual = cdiDiario ? ((Math.pow(1 + cdiDiario/100, 252) - 1) * 100) : null

        const ipcaVal = parseFloat(ipcaArr?.[0]?.valor?.replace(',','.'))
        const poupVal = parseFloat(poupArr?.[0]?.valor?.replace(',','.'))

        setDados({ selic: selicAnual, ipca: ipcaVal, cdi: cdiAnual, poup: poupVal })
        setPtax(ptaxData)
        setFocus(focusData)
      } catch(e) {
        if (mounted) setErro(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    carregar()
    return () => { mounted = false }
  }, [])

  const card = { background:'#fff', borderRadius:24, padding:22, boxShadow:'0 1px 4px rgba(4,77,44,.08)', border:'1px solid rgba(10,138,82,.12)' }

  return (
    <div style={{ animation:'vIn .26s ease' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(130deg,#022818,#076B3E)', borderRadius:24, padding:'22px 24px', color:'#fff', marginBottom:18, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.16em', opacity:.6, marginBottom:8 }}>Dados Oficiais • Banco Central do Brasil</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>📡 Radar Econômico</div>
        <div style={{ fontSize:13, opacity:.78, lineHeight:1.6 }}>Indicadores macroeconômicos em tempo real. Dados oficiais da API pública do Banco Central, atualizados automaticamente.</div>
        <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:11, background:'rgba(255,255,255,.12)', padding:'4px 10px', borderRadius:10 }}>🏦 Banco Central</span>
          <span style={{ fontSize:11, background:'rgba(255,255,255,.12)', padding:'4px 10px', borderRadius:10 }}>📊 IBGE</span>
          <span style={{ fontSize:11, background:'rgba(255,255,255,.12)', padding:'4px 10px', borderRadius:10 }}>🔄 Atualização automática</span>
        </div>
      </div>

      {loading && (
        <div style={{ ...card, textAlign:'center', padding:'48px 20px' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:14, color:'#6B8878', fontWeight:600 }}>Buscando dados do Banco Central...</div>
          <div style={{ fontSize:12, color:'#A8BDB5', marginTop:6 }}>Conectando à API oficial do BCB</div>
        </div>
      )}

      {erro && !loading && (
        <div style={{ ...card, background:'#FEF2F2', border:'1px solid rgba(214,51,51,.2)', marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#D63333', marginBottom:8 }}>⚠️ Não foi possível conectar ao Banco Central</div>
          <div style={{ fontSize:12.5, color:'#D63333', lineHeight:1.6 }}>A API do BCB pode estar temporariamente indisponível ou sua conexão bloqueou o acesso. Tente novamente em instantes.</div>
        </div>
      )}

      {!loading && !erro && (
        <>
          {/* ── Câmbio em destaque ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div style={{ background:'linear-gradient(135deg,#1D6FA4,#0E7490)', borderRadius:20, padding:'18px 20px', color:'#fff' }}>
              <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>💵 Dólar PTAX</div>
              <div style={{ fontSize:22, fontWeight:800 }}>
                {ptax?.cotacaoVenda ? `R$ ${Number(ptax.cotacaoVenda).toFixed(4)}` : '—'}
              </div>
              <div style={{ fontSize:11, opacity:.75, marginTop:4 }}>Venda • PTAX Oficial BCB</div>
            </div>
            <div style={{ background:'linear-gradient(135deg,#7C3AED,#4338CA)', borderRadius:20, padding:'18px 20px', color:'#fff' }}>
              <div style={{ fontSize:10, opacity:.7, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>📈 Focus — IPCA esperado</div>
              <div style={{ fontSize:22, fontWeight:800 }}>
                {focus?.Mediana ? `${Number(focus.Mediana).toFixed(2)}%` : '—'}
              </div>
              <div style={{ fontSize:11, opacity:.75, marginTop:4 }}>Mediana • Expectativa do mercado</div>
            </div>
          </div>

          {/* ── Indicadores principais ── */}
          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>
              Indicadores de Referência
            </div>

            {Object.entries(INDICADORES_INFO).map(([key, info]) => {
              const valor = dados[key]
              const impacto = info.impacto(valor)
              const isOpen = expandido === key
              return (
                <div key={key} style={{ borderBottom:'1px solid #F0F4F1', paddingBottom:14, marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={() => setExpandido(isOpen ? null : key)}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:'#0D1F17' }}>{info.nome}</span>
                        <span style={{ fontSize:9, fontWeight:600, color:'#A8BDB5', background:'#F0F4F1', padding:'2px 7px', borderRadius:8, textTransform:'uppercase' }}>
                          {info.unidade}
                        </span>
                      </div>
                      <div style={{ fontSize:11.5, color:impacto.cor, fontWeight:500, lineHeight:1.5 }}>{impacto.texto}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:20, fontWeight:800, color:impacto.cor }}>
                        {valor != null ? Number(valor).toFixed(2) + '%' : '—'}
                      </div>
                      <div style={{ fontSize:10, color:'#A8BDB5', marginTop:2 }}>{isOpen ? '▲ menos' : '▼ mais'}</div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop:12, padding:'14px 16px', background:'#F8FDF9', borderRadius:14, animation:'vIn .2s ease' }}>
                      <div style={{ fontSize:12.5, color:'#2E4A3A', lineHeight:1.75, marginBottom:10 }}>{info.desc}</div>
                      <div style={{ fontSize:10.5, color:'#A8BDB5' }}>📊 Fonte: {info.fonte}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Comparativo Selic vs IPCA vs Poupança ── */}
          <div style={{ ...card, marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:16 }}>
              Comparativo — Retorno Real
            </div>
            <div style={{ fontSize:12, color:'#6B8878', lineHeight:1.6, marginBottom:16 }}>
              Retorno real = rendimento − inflação. Investimentos com retorno real negativo perdem poder de compra.
            </div>

            {[
              { nome:'Tesouro Selic', val:dados.selic, cor:'#076B3E', icon:'🏆' },
              { nome:'CDI (100%)', val:dados.cdi, cor:'#1D6FA4', icon:'📊' },
              { nome:'Poupança (a.a.)', val:dados.poup != null ? ((Math.pow(1 + dados.poup/100, 12) - 1) * 100) : null, cor:'#D97706', icon:'🏦' },
            ].map((item, i) => {
              const retReal = item.val != null && dados.ipca != null
                ? item.val - (dados.ipca * 12)
                : null
              const barPct = item.val != null ? Math.min(100, (item.val / 20) * 100) : 0
              return (
                <div key={i} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#0D1F17' }}>{item.icon} {item.nome}</span>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:14, fontWeight:800, color:item.cor }}>{item.val != null ? Number(item.val).toFixed(2)+'%' : '—'}</span>
                      {retReal != null && (
                        <div style={{ fontSize:10.5, color:retReal>=0?'#076B3E':'#D63333', fontWeight:600, marginTop:1 }}>
                          Real: {retReal>=0?'+':''}{retReal.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ height:7, background:'#F0F4F1', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:barPct+'%', background:item.cor, borderRadius:4, transition:'width .5s ease' }}/>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Boletim Focus ── */}
          {focus && (
            <div style={{ ...card, marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#6B8878', marginBottom:14 }}>
                📋 Boletim Focus — Expectativas do Mercado
              </div>
              <div style={{ background:'#F5F3FF', borderRadius:16, padding:'16px 18px' }}>
                <div style={{ fontSize:11, color:'#7C3AED', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 }}>IPCA Esperado (Top 5 do Focus)</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <div style={{ fontSize:9.5, color:'#6B8878', marginBottom:4 }}>Média</div>
                    <div style={{ fontSize:18, fontWeight:800, color:'#7C3AED' }}>{focus.Media ? Number(focus.Media).toFixed(2)+'%' : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:9.5, color:'#6B8878', marginBottom:4 }}>Mediana</div>
                    <div style={{ fontSize:18, fontWeight:800, color:'#7C3AED' }}>{focus.Mediana ? Number(focus.Mediana).toFixed(2)+'%' : '—'}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:'#A8BDB5', marginTop:10 }}>
                  Dados do relatório de {focus.Data?.split('T')?.[0] || '—'} • O Focus é publicado semanalmente pelo Banco Central, consolidando as expectativas de mais de 100 instituições financeiras.
                </div>
              </div>
            </div>
          )}

          {/* ── O que fazer com esses dados ── */}
          <div style={{ ...card, background:'linear-gradient(135deg,#022818,#076B3E)', border:'none', color:'#fff' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', opacity:.6, marginBottom:12 }}>💡 Como usar esses dados</div>
            {[
              { icon:'📈', titulo:'Selic alta (>10%)', dica:'Renda fixa está muito atrativa. Priorize Tesouro Selic, CDB 100%+ CDI e LCI/LCA antes de ações.' },
              { icon:'🏠', titulo:'IPCA alto', dica:'Proteja seu patrimônio com Tesouro IPCA+. Esse título garante ganho real acima da inflação.' },
              { icon:'💵', titulo:'Dólar alto', dica:'Bom momento para avaliar ETFs como IVVB11 (S&P 500 em reais) como proteção cambial na carteira.' },
              { icon:'🎯', titulo:'Regra de ouro', dica:'Qualquer investimento que rende menos que o IPCA acumulado está perdendo poder de compra. Revise seus ativos regularmente.' },
            ].map((d,i) => (
              <div key={i} style={{ display:'flex', gap:12, marginBottom:14 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700, marginBottom:3 }}>{d.titulo}</div>
                  <div style={{ fontSize:12, opacity:.8, lineHeight:1.6 }}>{d.dica}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
