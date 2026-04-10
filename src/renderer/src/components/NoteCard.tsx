import { Note } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Video, Monitor, Trash2 } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  note: Note
  active?: boolean
  onClick: () => void
  onDelete: () => void
}

function SourceIcon({ source }: { source?: Note['meetingSource'] }) {
  if (source === 'zoom' || source === 'teams') return <Video size={11} className="shrink-0 mt-[3px] text-zinc-400" />
  if (source === 'meet') return <Monitor size={11} className="shrink-0 mt-[3px] text-zinc-400" />
  return <FileText size={11} className="shrink-0 mt-[3px] text-zinc-400" />
}

function getPreview(content: string): string {
  if (!content) return ''
  try {
    const doc = JSON.parse(content)
    const texts: string[] = []
    const walk = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === 'text') texts.push(node.text)
        if (node.content) walk(node.content)
        if (texts.join('').length > 100) return
      }
    }
    if (doc.content) walk(doc.content)
    return texts.join(' ').trim().slice(0, 100)
  } catch {
    return ''
  }
}

export default function NoteCard({ note, active, onClick, onDelete }: Props) {
  const preview = getPreview(note.content)

  return (
    <button
      onClick={onClick}
      className={clsx(
        'group relative w-full rounded px-3 py-2.5 text-left transition-colors',
        active
          ? 'bg-zinc-200 dark:bg-zinc-800'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
      )}
    >
      <div className="flex items-start gap-2">
        <SourceIcon source={note.meetingSource} />
        <div className="min-w-0 flex-1">
          <p className={clsx(
            'truncate text-xs font-medium leading-tight',
            active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'
          )}>
            {note.title || 'Untitled'}
          </p>
          {preview && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-400 dark:text-zinc-600">
              {preview}
            </p>
          )}
          <p className="mt-1 text-[10px] text-zinc-300 dark:text-zinc-700">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Delete on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute right-2 top-2 hidden rounded p-1 text-zinc-300 hover:text-zinc-600 dark:text-zinc-700 dark:hover:text-zinc-300 group-hover:flex transition-colors"
        title="Delete"
      >
        <Trash2 size={11} />
      </button>
    </button>
  )
}
