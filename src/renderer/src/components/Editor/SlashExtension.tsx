import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import SlashMenu, { SLASH_COMMANDS, SlashCommand, SlashMenuHandle } from './SlashMenu'

export const SlashExtension = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        allowSpaces: false,
        startOfLine: false,
        command: ({ editor, range, props }: { editor: any; range: any; props: SlashCommand }) => {
          props.command({ editor, range })
        },
        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase()
          return SLASH_COMMANDS.filter(
            (c) =>
              c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
          ).slice(0, 10)
        },
        render: () => {
          let renderer: ReactRenderer<SlashMenuHandle>
          let popup: TippyInstance[]

          return {
            onStart: (props: any) => {
              renderer = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) return

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: renderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'slash-menu',
                arrow: false,
                offset: [0, 8],
              })
            },

            onUpdate: (props: any) => {
              renderer.updateProps(props)
              if (popup[0] && props.clientRect) {
                popup[0].setProps({ getReferenceClientRect: props.clientRect })
              }
            },

            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                popup[0]?.hide()
                return true
              }
              return renderer.ref?.onKeyDown(props) ?? false
            },

            onExit: () => {
              popup[0]?.destroy()
              renderer.destroy()
            },
          }
        },
      }),
    ]
  },
})
