import { AISettings, AppSettings } from '../types'

const STORAGE_KEY = 'coffee-order-settings'

const defaultSettings: AppSettings = {
  ai: {
    provider: 'claude',
    claudeApiKey: '',
    openaiApiKey: '',
    geminiApiKey: '',
    model: '',
  },
  theme: 'system',
  autoTranscribe: false,
  transcriptionLanguage: 'en',
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings()
  const updated = { ...current, ...settings }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function updateAISettings(ai: Partial<AISettings>): AppSettings {
  const current = getSettings()
  return saveSettings({ ai: { ...current.ai, ...ai } })
}
