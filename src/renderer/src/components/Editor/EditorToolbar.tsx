import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link,
  ImageIcon,
  Highlighter,
  Lightbulb,
  Minus,
  RemoveFormatting,
  Link2Off,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'

interface Props {
  editor: Editor
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded transition-colors',
        active
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
          : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
      )}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <div className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />
}

export default function EditorToolbar({ editor }: Props) {
  const [showLink, setShowLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const openLink = useCallback(() => {
    // Pre-fill with existing link href if cursor is on one
    const existing = editor.getAttributes('link').href as string | undefined
    setLinkUrl(existing || '')
    setShowLink(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [editor])

  const applyLink = useCallback(() => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    setShowLink(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const cancelLink = useCallback(() => {
    setShowLink(false)
    setLinkUrl('')
    editor.commands.focus()
  }, [editor])

  const addImage = useCallback(async () => {
    const api = (window as any).api
    const dataUrl: string | null = await api.dialog.openImage()
    if (dataUrl) {
      editor.chain().focus().setImage({ src: dataUrl }).run()
    }
  }, [editor])

  const toggleCallout = useCallback(() => {
    if (editor.isActive('callout')) {
      editor.chain().focus().liftCallout().run()
    } else {
      editor.chain().focus().setCallout().run()
    }
  }, [editor])

  return (
    <div className="relative w-full">
      {/* Link input — slides up above toolbar */}
      {showLink && (
        <div className="absolute bottom-full left-0 right-0 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2">
          <Link size={12} className="shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') cancelLink()
            }}
            placeholder="https://"
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); applyLink() }}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Apply
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); cancelLink() }}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-1.5">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
          <Bold size={13} strokeWidth={2.5} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
          <Italic size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)">
          <Underline size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter size={13} />
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={13} />
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Todo list">
          <ListChecks size={13} />
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote size={13} />
        </Btn>
        <Btn onClick={toggleCallout} active={editor.isActive('callout')} title="Callout">
          <Lightbulb size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={13} />
        </Btn>

        <Sep />

        <Btn onClick={addImage} title="Image">
          <ImageIcon size={13} />
        </Btn>
        <Btn onClick={openLink} active={editor.isActive('link')} title="Link">
          <Link size={13} />
        </Btn>
        {editor.isActive('link') && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            <Link2Off size={13} />
          </Btn>
        )}

        <Sep />

        <Btn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
          <RemoveFormatting size={13} />
        </Btn>
      </div>
    </div>
  )
}
