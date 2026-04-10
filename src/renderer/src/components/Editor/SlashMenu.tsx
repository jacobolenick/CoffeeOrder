import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Lightbulb,
  Minus,
  Bold,
  ImageIcon,
} from 'lucide-react'
import clsx from 'clsx'

export type SlashCommand = {
  title: string
  description: string
  icon: React.ReactNode
  command: (props: { editor: any; range: any }) => void
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    title: 'Text',
    description: 'Plain paragraph',
    icon: <Type size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Unordered list',
    icon: <List size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered list',
    icon: <ListOrdered size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Todo List',
    description: 'Task checklist',
    icon: <ListChecks size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Block quotation',
    icon: <Quote size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run()
    },
  },
  {
    title: 'Callout',
    description: 'Highlighted note',
    icon: <Lightbulb size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout().run()
    },
  },
  {
    title: 'Divider',
    description: 'Horizontal rule',
    icon: <Minus size={14} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Bold',
    description: 'Bold text',
    icon: <Bold size={14} strokeWidth={2.5} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run()
    },
  },
  {
    title: 'Image',
    description: 'Insert from computer',
    icon: <ImageIcon size={14} />,
    command: async ({ editor, range }) => {
      const api = (window as any).api
      const dataUrl: string | null = await api.dialog.openImage()
      if (dataUrl) {
        editor.chain().focus().deleteRange(range).setImage({ src: dataUrl }).run()
      } else {
        editor.chain().focus().deleteRange(range).run()
      }
    },
  },
]

export interface SlashMenuHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface SlashMenuProps {
  items: SlashCommand[]
  command: (item: SlashCommand) => void
}

const SlashMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        if (items[selectedIndex]) command(items[selectedIndex])
        return true
      }
      return false
    },
  }))

  if (items.length === 0) return null

  return (
    <div className="slash-menu w-56 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg py-1">
      {items.map((item, i) => (
        <button
          key={item.title}
          onMouseDown={(e) => {
            e.preventDefault()
            command(item)
          }}
          className={clsx(
            'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
            i === selectedIndex
              ? 'bg-zinc-100 dark:bg-zinc-900'
              : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
          )}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
            {item.icon}
          </span>
          <div>
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
              {item.title}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
              {item.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
})

SlashMenu.displayName = 'SlashMenu'
export default SlashMenu
