import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, BrainCircuit, Bot, Sparkles, FolderOpen, ExternalLink } from 'lucide-react'
import { getSettings, saveSettings, updateAISettings } from '../store/settingsStore'
import { AIProvider, AppSettings } from '../types'
import { callAI } from '../lib/aiProviders'
import clsx from 'clsx'

interface Props {
  onClose: () => void
}

type ProviderConfig = {
  id: AIProvider
  name: string
  Icon: React.FC<{ size?: number; className?: string }>
  models: string[]
  keyPlaceholder: string
  keyField: keyof Pick<AppSettings['ai'], 'claudeApiKey' | 'openaiApiKey' | 'geminiApiKey'>
}

const providers: ProviderConfig[] = [
  {
    id: 'claude',
    name: 'Claude',
    Icon: BrainCircuit,
    models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001'],
    keyPlaceholder: 'sk-ant-...',
    keyField: 'claudeApiKey',
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    Icon: Bot,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    keyPlaceholder: 'sk-...',
    keyField: 'openaiApiKey',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    Icon: Sparkles,
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    keyPlaceholder: 'AIza...',
    keyField: 'geminiApiKey',
  },
]

export default function SettingsPanel({ onClose }: Props) {
  const [settings, setSettings] = useState(getSettings())
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [testStatus, setTestStatus] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'error'>>({})
  const [saved, setSaved] = useState(false)
  const [notesFolder, setNotesFolder] = useState<string>('')
  const [choosingFolder, setChoosingFolder] = useState(false)

  useEffect(() => {
    const api = (window as any).api
    api.config.get('notesFolder').then((p: string | null) => {
      if (p) setNotesFolder(p)
    })
  }, [])

  const changeFolder = async () => {
    setChoosingFolder(true)
    const api = (window as any).api
    const picked = await api.folder.choose()
    setChoosingFolder(false)
    if (!picked) return
    await api.folder.create(picked)
    await api.config.set('notesFolder', picked)
    setNotesFolder(picked)
  }

  const revealFolder = () => {
    if (!notesFolder) return
    ;(window as any).api.folder.reveal(notesFolder)
  }

  const update = (partial: Partial<AppSettings>) => {
    const updated = saveSettings(partial)
    setSettings(updated)
  }

  const updateAI = (partial: Partial<AppSettings['ai']>) => {
    const updated = updateAISettings(partial)
    setSettings(updated)
  }

  const testKey = async (provider: ProviderConfig) => {
    setTestStatus((s) => ({ ...s, [provider.id]: 'testing' }))
    try {
      await callAI(
        { ...settings.ai, provider: provider.id },
        [{ role: 'user', content: 'Say "ok" in one word.' }]
      )
      setTestStatus((s) => ({ ...s, [provider.id]: 'ok' }))
    } catch {
      setTestStatus((s) => ({ ...s, [provider.id]: 'error' }))
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Settings</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Notes folder */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Notes Folder
          </h3>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <FolderOpen size={14} className="shrink-0 text-zinc-400" />
              <div className="min-w-0 flex-1">
                {notesFolder ? (
                  <>
                    <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {notesFolder.split('/').pop()}
                    </p>
                    <p className="truncate text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                      {notesFolder.replace(/^\/Users\/[^/]+/, '~')}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-zinc-400">No folder selected</p>
                )}
              </div>
              <button
                onClick={revealFolder}
                title="Open in Finder"
                className="shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                <ExternalLink size={12} />
              </button>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-900 px-4 py-2.5">
              <button
                onClick={changeFolder}
                disabled={choosingFolder}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-40"
              >
                {choosingFolder ? 'Choosing…' : 'Change folder'}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-600">
            Each note is saved as a .json file. Sync with iCloud Drive by choosing a folder inside it.
          </p>
        </section>

        {/* AI Provider */}
        <section>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            AI Provider
          </h3>

          <div className="mb-4 flex gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => updateAI({ provider: p.id })}
                className={clsx(
                  'flex flex-1 flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition-all',
                  settings.ai.provider === p.id
                    ? 'bg-zinc-900 text-zinc-100 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                )}
              >
                <p.Icon size={16} />
                <span className="text-xs font-medium">{p.name}</span>
              </button>
            ))}
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            {providers.map((p) => (
              <div key={p.id}>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <p.Icon size={12} />
                  {p.name} API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKeys[p.id] ? 'text' : 'password'}
                      value={settings.ai[p.keyField] || ''}
                      onChange={(e) => updateAI({ [p.keyField]: e.target.value })}
                      placeholder={p.keyPlaceholder}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                    <button
                      onClick={() => setShowKeys((s) => ({ ...s, [p.id]: !s[p.id] }))}
                      className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                    >
                      {showKeys[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button
                    onClick={() => testKey(p)}
                    disabled={!settings.ai[p.keyField] || testStatus[p.id] === 'testing'}
                    className={clsx(
                      'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all disabled:opacity-40',
                      testStatus[p.id] === 'ok'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : testStatus[p.id] === 'error'
                          ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    )}
                  >
                    {testStatus[p.id] === 'ok' ? (
                      <CheckCircle2 size={13} />
                    ) : testStatus[p.id] === 'error' ? (
                      <AlertCircle size={13} />
                    ) : null}
                    {testStatus[p.id] === 'testing' ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Model selection */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Model
          </h3>
          {(() => {
            const p = providers.find((p) => p.id === settings.ai.provider)!
            return (
              <select
                value={settings.ai.model || p.models[0]}
                onChange={(e) => updateAI({ model: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {p.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )
          })()}
        </section>

        {/* Transcription */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Transcription
          </h3>
          <label className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              Auto-transcribe meetings
            </span>
            <button
              onClick={() => update({ autoTranscribe: !settings.autoTranscribe })}
              className={clsx(
                'relative h-6 w-11 rounded-full transition-colors',
                settings.autoTranscribe ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-600'
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  settings.autoTranscribe ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </label>
          <p className="mt-2 text-xs text-zinc-400">
            Requires an OpenAI API key for Whisper transcription.
          </p>
        </section>
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          {saved ? <CheckCircle2 size={15} /> : null}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
