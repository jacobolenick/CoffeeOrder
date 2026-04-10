export interface Note {
  id: string
  title: string
  content: string // TipTap JSON string
  createdAt: string
  updatedAt: string
  meetingSource?: 'zoom' | 'meet' | 'teams' | 'manual'
  transcript?: string
  tags?: string[]
  wordCount?: number
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  context?: string
  links?: string[]
}

export type AIProvider = 'claude' | 'openai' | 'gemini'

export interface AISettings {
  provider: AIProvider
  claudeApiKey?: string
  openaiApiKey?: string
  geminiApiKey?: string
  model?: string
}

export interface AppSettings {
  ai: AISettings
  theme: 'system' | 'light' | 'dark'
  autoTranscribe: boolean
  transcriptionLanguage: string
}

export type Theme = 'light' | 'dark'

export interface CaptureSource {
  id: string
  name: string
}
