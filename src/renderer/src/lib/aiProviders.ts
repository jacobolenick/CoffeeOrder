import { AISettings } from '../types'

export type AIMessage = { role: 'user' | 'assistant' | 'system'; content: string }

export async function callAI(
  settings: AISettings,
  messages: AIMessage[]
): Promise<string> {
  switch (settings.provider) {
    case 'claude':
      return callClaude(settings.claudeApiKey || '', settings.model, messages)
    case 'openai':
      return callOpenAI(settings.openaiApiKey || '', settings.model, messages)
    case 'gemini':
      return callGemini(settings.geminiApiKey || '', settings.model, messages)
    default:
      throw new Error('Unknown AI provider')
  }
}

async function callClaude(
  apiKey: string,
  model: string | undefined,
  messages: AIMessage[]
): Promise<string> {
  if (!apiKey) throw new Error('Claude API key not configured')

  const systemMsg = messages.find((m) => m.role === 'system')
  const userMessages = messages.filter((m) => m.role !== 'system')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemMsg?.content || 'You are a helpful meeting assistant.',
      messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Claude API error')
  }

  const data = await res.json()
  return data.content[0]?.text || ''
}

async function callOpenAI(
  apiKey: string,
  model: string | undefined,
  messages: AIMessage[]
): Promise<string> {
  if (!apiKey) throw new Error('OpenAI API key not configured')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'OpenAI API error')
  }

  const data = await res.json()
  return data.choices[0]?.message?.content || ''
}

async function callGemini(
  apiKey: string,
  model: string | undefined,
  messages: AIMessage[]
): Promise<string> {
  if (!apiKey) throw new Error('Gemini API key not configured')

  const modelId = model || 'gemini-2.0-flash'
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

  const systemInstruction = messages.find((m) => m.role === 'system')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(systemInstruction && {
          systemInstruction: { parts: [{ text: systemInstruction.content }] },
        }),
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Gemini API error')
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function summarizeMeeting(
  settings: AISettings,
  transcript: string
): Promise<string> {
  return callAI(settings, [
    {
      role: 'system',
      content:
        'You are an expert meeting note-taker. Summarize meeting transcripts into clear, actionable notes with key decisions, action items, and important points.',
    },
    {
      role: 'user',
      content: `Please summarize this meeting transcript into structured notes:\n\n${transcript}`,
    },
  ])
}

export async function generateTodos(
  settings: AISettings,
  content: string
): Promise<string> {
  return callAI(settings, [
    {
      role: 'system',
      content:
        'Extract action items from meeting notes. Return them as a simple bulleted list, one item per line, starting with "- ".',
    },
    {
      role: 'user',
      content: `Extract action items from these notes:\n\n${content}`,
    },
  ])
}
