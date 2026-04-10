import { Editor } from '@tiptap/react'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface Props {
  editor: Editor
}

export default function WordCount({ editor }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [stats, setStats] = useState({ words: 0, characters: 0 })

  useEffect(() => {
    const update = () => {
      const text = editor.getText()
      setStats({
        words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
        characters: text.length,
      })
    }
    editor.on('update', update)
    update()
    return () => { editor.off('update', update) }
  }, [editor])

  const readingMins = Math.max(1, Math.ceil(stats.words / 200))
  const speakSecs = Math.ceil((stats.words / 130) * 60)
  const speakMin = Math.floor(speakSecs / 60)
  const speakRemSec = speakSecs % 60

  return (
    <div className="relative flex items-center">
      {expanded && (
        <div className="absolute bottom-full right-0 mb-1 w-44 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 px-3 shadow-sm">
          <div className="space-y-1 text-xs text-zinc-400 dark:text-zinc-600">
            <div>{stats.characters.toLocaleString()} characters</div>
            <div>{readingMins}m reading time</div>
            <div>{speakMin}m {speakRemSec}s speaking time</div>
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded(v => !v)}
        className={clsx(
          'text-xs tabular-nums transition-colors py-1.5 px-2 rounded',
          expanded
            ? 'text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
        )}
      >
        {stats.words.toLocaleString()} words
      </button>
    </div>
  )
}
