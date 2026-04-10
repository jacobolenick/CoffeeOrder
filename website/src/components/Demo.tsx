import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
  List, ListOrdered, CheckSquare, Quote, Code, Highlighter, Minus,
} from 'lucide-react'

const STARTER_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Weekly Sync — April 10' }],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Summary' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Discussed roadmap priorities for Q2. Team agreed to focus on performance improvements before adding new features. ',
        },
        { type: 'text', marks: [{ type: 'highlight' }], text: 'Auth refactor' },
        { type: 'text', text: ' is the current top priority.' },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '"We need to move fast, but not so fast that we accumulate debt we can\'t pay off." — Jordan',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Action items' }],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Draft auth migration plan and share with team' }],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Update sprint board with new priorities' }],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Schedule 1:1 with Morgan about onboarding timeline' }],
            },
          ],
        },
      ],
    },
  ],
}

function ToolbarButton({
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
      className={`h-7 w-7 flex items-center justify-center rounded-md transition-colors ${
        active
          ? 'bg-zinc-200 text-zinc-900'
          : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-zinc-200 mx-0.5" />
}

export default function Demo() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Start writing, or try formatting..." }),
      Typography,
    ],
    content: STARTER_CONTENT,
  })

  if (!editor) return null

  return (
    <section id="demo" className="py-20 px-6">
      <div className="mx-auto max-w-site">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Interactive demo
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 mb-4">
            Try the editor right here
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            The same editor that lives in the app — fully formatted, fully editable.
            Click anywhere and start typing.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200/90 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
          <div className="h-9 flex items-center px-3 gap-1.5 border-b border-zinc-100 bg-zinc-50">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="flex-1" />
            <span className="text-[10px] text-zinc-400 font-medium">
              Coffee Order — Note editor
            </span>
            <span className="flex-1" />
          </div>

          <div className="demo-editor">
            <EditorContent editor={editor} />
          </div>

          <div className="border-t border-zinc-100 bg-white px-3 h-10 flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline"
            >
              <UnderlineIcon size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter size={13} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={13} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet list"
            >
              <List size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Ordered list"
            >
              <ListOrdered size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              active={editor.isActive('taskList')}
              title="Task list"
            >
              <CheckSquare size={13} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              title="Code"
            >
              <Code size={13} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              active={false}
              title="Divider"
            >
              <Minus size={13} />
            </ToolbarButton>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-4">
          This is a live editor. In the app, AI fills it for you after your meeting.
        </p>
      </div>
    </section>
  )
}
