import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { Node, mergeAttributes } from '@tiptap/core'
import { useEffect, useRef, useCallback } from 'react'
import { Note } from '../../types'
import { updateNote } from '../../store/notesStore'
import EditorToolbar from './EditorToolbar'
import WordCount from './WordCount'
import ResizableImage from './ResizableImage'
import { SlashExtension } from './SlashExtension'

// ─── Resizable Image extension ──────────────────────────────
const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attrs) => ({
          style: `width: ${attrs.width}`,
        }),
        parseHTML: (el) => {
          const style = el.getAttribute('style') ?? ''
          const match = style.match(/width:\s*([^;]+)/)
          return match ? match[1].trim() : '100%'
        },
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage)
  },

  addKeyboardShortcuts() {
    return {
      // After an image NodeSelection, Enter creates a new paragraph below
      Enter: () => {
        const { state } = this.editor
        const { selection } = state
        // NodeSelection has a `node` property
        const sel = selection as any
        if (sel.node && sel.node.type === this.type) {
          return this.editor
            .chain()
            .focus()
            .insertContentAt(sel.to, { type: 'paragraph' })
            .run()
        }
        return false
      },
      // Arrow down from image also moves into a new paragraph if at doc end
      ArrowDown: () => {
        const { state } = this.editor
        const { selection, doc } = state
        const sel = selection as any
        if (sel.node && sel.node.type === this.type) {
          const isLast = sel.to === doc.content.size - 1
          if (isLast) {
            return this.editor
              .chain()
              .focus()
              .insertContentAt(sel.to, { type: 'paragraph' })
              .run()
          }
        }
        return false
      },
    }
  },
})

// ─── Callout extension ──────────────────────────────────────
const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }),
      ['div', { class: 'callout-content' }, 0],
    ]
  },

  addCommands() {
    return {
      setCallout:
        () =>
        ({ state, dispatch, tr }) => {
          const { selection } = state
          const { $from, $to } = selection
          const range = { from: $from.start(), to: $to.end() }
          const calloutType = this.type
          const paragraphType = state.schema.nodes.paragraph
          if (dispatch) {
            const content = state.doc.slice(range.from, range.to)
            const calloutNode = calloutType.create(
              {},
              content.content.childCount > 0 ? content.content : paragraphType.create()
            )
            tr.replaceWith(range.from, range.to, calloutNode)
            dispatch(tr)
          }
          return true
        },
      liftCallout:
        () =>
        ({ state, dispatch, tr }) => {
          const { $from } = state.selection
          let depth = $from.depth
          while (depth > 0) {
            if ($from.node(depth).type === this.type) break
            depth--
          }
          if (depth === 0) return false
          const calloutPos = $from.before(depth)
          const calloutNode = $from.node(depth)
          if (dispatch) {
            tr.replaceWith(calloutPos, calloutPos + calloutNode.nodeSize, calloutNode.content)
            dispatch(tr)
          }
          return true
        },
    }
  },
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: () => ReturnType
      liftCallout: () => ReturnType
    }
  }
}

interface Props {
  note: Note
  onUpdate?: (note: Note) => void
}

export default function NoteEditor({ note, onUpdate }: Props) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteIdRef = useRef(note.id)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      ResizableImageExtension.configure({
        HTMLAttributes: { class: 'editor-image' },
      }),
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading...'
          return "Start writing, or type '/' for commands..."
        },
      }),
      Typography,
      Callout,
      SlashExtension,
    ],
    content: note.content ? JSON.parse(note.content) : '',
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        const content = JSON.stringify(editor.getJSON())
        const text = editor.getText()
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
        const updated = updateNote(noteIdRef.current, { content, wordCount: words })
        if (updated && onUpdate) onUpdate(updated)
      }, 500)
    },
  })

  useEffect(() => {
    if (!editor) return
    if (noteIdRef.current !== note.id) {
      noteIdRef.current = note.id
      const newContent = note.content ? JSON.parse(note.content) : ''
      editor.commands.setContent(newContent, false)
    }
  }, [note.id, editor])

  const insertText = useCallback(
    (text: string) => {
      if (!editor) return
      editor.chain().focus().insertContent(text).run()
    },
    [editor]
  )

  useEffect(() => {
    const handler = (e: CustomEvent) => insertText(e.detail as string)
    window.addEventListener('editor:insert', handler as EventListener)
    return () => window.removeEventListener('editor:insert', handler as EventListener)
  }, [insertText])

  if (!editor) return null

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-8 pb-16 pt-8">
          <EditorContent
            editor={editor}
            className="coffee-editor min-h-[60vh] outline-none"
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <EditorToolbar editor={editor} />
          <div className="pr-4">
            <WordCount editor={editor} />
          </div>
        </div>
      </div>
    </div>
  )
}
