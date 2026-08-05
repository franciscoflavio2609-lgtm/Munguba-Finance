// Função serverless do Vercel — protege a chave da API do Claude
// A chave NUNCA fica exposta no navegador do usuário
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API não configurada no servidor' })
  }

  const { message, context } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida' })
  }

  // Contexto financeiro real do usuário — resumido e anonimizado
  const systemPrompt = `Você é o Assistente Munguba, um consultor financeiro pessoal amigável e conhecedor, parte do app Munguba Finance.

Você tem acesso ao resumo financeiro REAL do usuário abaixo. Use esses dados para responder de forma personalizada, específica e útil — nunca genérica quando os dados estiverem disponíveis.

DADOS FINANCEIROS DO USUÁRIO:
${context || 'Nenhum dado disponível ainda — usuário novo.'}

REGRAS IMPORTANTES:
- Responda sempre em português do Brasil, de forma calorosa e acessível
- Use os dados reais do usuário sempre que a pergunta permitir (ex: "você gastou X em Y este mês")
- Se não houver dados suficientes, incentive o usuário a registrar mais transações
- Seja específico com números quando disponíveis, mas didático nas explicações
- Máximo de 200 palavras por resposta — seja direto e útil
- Use emojis com moderação para deixar a conversa mais leve
- Nunca invente números que não estão nos dados fornecidos
- Se a pergunta for sobre educação financeira geral (ex: "o que é Tesouro Selic"), responda normalmente mesmo sem dados pessoais
- Você NÃO é um consultor de investimentos licenciado — sempre inclua uma nota sutil de que decisões importantes devem ser bem pesquisadas`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Erro Anthropic API:', errText)
      return res.status(502).json({ error: 'Erro ao consultar o assistente. Tente novamente.' })
    }

    const data = await response.json()
    const reply = data?.content?.find(c => c.type === 'text')?.text || 'Desculpe, não consegui gerar uma resposta.'

    return res.status(200).json({ reply })
  } catch (e) {
    console.error('Erro na função chat:', e)
    return res.status(500).json({ error: 'Erro interno. Tente novamente em instantes.' })
  }
}
