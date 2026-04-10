import { useState, useEffect } from 'react'
import { FolderOpen, FolderCheck, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  onComplete: (folderPath: string) => void
}

export default function FolderSetup({ onComplete }: Props) {
  const [folderPath, setFolderPath] = useState('')
  const [defaultPath, setDefaultPath] = useState('')
  const [choosing, setChoosing] = useState(false)

  useEffect(() => {
    const api = (window as any).api
    api.folder.getDefault().then((p: string) => {
      setDefaultPath(p)
      setFolderPath(p)
    })
  }, [])

  const choose = async () => {
    setChoosing(true)
    const api = (window as any).api
    const picked = await api.folder.choose()
    setChoosing(false)
    if (picked) setFolderPath(picked)
  }

  const confirm = async () => {
    if (!folderPath) return
    const api = (window as any).api
    await api.folder.create(folderPath)
    await api.config.set('notesFolder', folderPath)
    onComplete(folderPath)
  }

  const displayPath = folderPath
    ? folderPath.replace(/^\/Users\/[^/]+/, '~')
    : ''

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 px-8">
      {/* macOS traffic lights spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />

      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Coffee Order
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ letterSpacing: '-0.02em' }}>
            Where should notes be saved?
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">
            Choose a folder on your Mac. Each note will be saved as a JSON file you can back up, sync with iCloud, or open in any editor.
          </p>
        </div>

        {/* Folder picker */}
        <div className="space-y-3">
          {/* Current selection */}
          <button
            onClick={choose}
            disabled={choosing}
            className={clsx(
              'flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors',
              folderPath
                ? 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                : 'border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
            )}
          >
            {folderPath ? (
              <FolderCheck size={16} className="shrink-0 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <FolderOpen size={16} className="shrink-0 text-zinc-400" />
            )}
            <div className="min-w-0 flex-1">
              {folderPath ? (
                <>
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {displayPath.split('/').pop()}
                  </p>
                  <p className="truncate text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                    {displayPath}
                  </p>
                </>
              ) : (
                <p className="text-sm text-zinc-400">Choose a folder…</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-600">
              {choosing ? 'Opening…' : 'Change'}
            </span>
          </button>

          {/* Default suggestion note */}
          {folderPath === defaultPath && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-600 px-1">
              This is the default location. You can change it anytime in Settings.
            </p>
          )}
        </div>

        {/* Continue */}
        <button
          onClick={confirm}
          disabled={!folderPath}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
