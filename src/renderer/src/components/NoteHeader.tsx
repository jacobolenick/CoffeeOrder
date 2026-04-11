import { Note } from '../types'
import { updateNote } from '../store/notesStore'
import { format } from 'date-fns'
import { useRef, useState } from 'react'
import { FileDown } from 'lucide-react'
import { exportAsMarkdown, exportAsPdf } from '../lib/exportNote'

interface Props {
  note: Note
  onUpdate: (note: Note) => void
}

export default function NoteHeader({ note, onUpdate }: Props) {
  const [title, setTitle] = useState(note.title)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  const handleChange = (value: string) => {
    setTitle(value)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const updated = updateNote(note.id, { title: value || 'Untitled' })
      if (updated) onUpdate(updated)
    }, 400)
  }

  const sourceLabel: Record<string, string> = {
    zoom: 'Zoom',
    meet: 'Google Meet',
    teams: 'Teams',
  }

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-900 px-8 pt-8 pb-4 mx-auto w-full max-w-2xl">
      <input
        type="text"
        value={title}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Untitled"
        className="w-full bg-transparent text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
        style={{ letterSpacing: '-0.02em' }}
      />
      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-700">
          <span>{format(new Date(note.updatedAt), 'MMM d, yyyy · h:mm a')}</span>
          {note.meetingSource && sourceLabel[note.meetingSource] && (
            <>
              <span>·</span>
              <span>{sourceLabel[note.meetingSource]}</span>
            </>
          )}
        </div>

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title="Export note"
          >
            <FileDown size={12} />
            Export
          </button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg py-1">
                <button
                  onClick={() => { setExportOpen(false); exportAsMarkdown(note) }}
                  className="w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => { setExportOpen(false); exportAsPdf(note) }}
                  className="w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  PDF (.pdf)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
