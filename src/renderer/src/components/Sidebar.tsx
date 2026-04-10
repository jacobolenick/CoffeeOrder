import { Note } from '../types'
import { Plus, Settings, Mic } from 'lucide-react'
import NoteCard from './NoteCard'
import clsx from 'clsx'

interface Props {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onDeleteNote: (id: string) => void
  onOpenSettings: () => void
  onOpenCapture: () => void
  isCapturing: boolean
}

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onOpenSettings,
  onOpenCapture,
  isCapturing,
}: Props) {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950">
      {/* macOS traffic lights spacer */}
      <div className="h-11 shrink-0" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 select-none">
          Notes
        </span>
        <button
          onClick={onNewNote}
          title="New Note"
          className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-px">
        {notes.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-zinc-400 dark:text-zinc-700">
            No notes yet
          </p>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              active={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 px-2 py-2 space-y-px">
        <button
          onClick={onOpenCapture}
          className={clsx(
            'flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs transition-colors',
            isCapturing
              ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900'
          )}
        >
          <Mic
            size={13}
            className={isCapturing ? 'animate-pulse' : ''}
          />
          <span>{isCapturing ? 'Recording' : 'Capture Meeting'}</span>
          {isCapturing && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
          )}
        </button>
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <Settings size={13} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
