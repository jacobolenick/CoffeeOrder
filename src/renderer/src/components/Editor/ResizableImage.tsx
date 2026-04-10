import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'

const PRESETS = [
  { label: '¼', value: '25%' },
  { label: '½', value: '50%' },
  { label: '¾', value: '75%' },
  { label: 'Full', value: '100%' },
]

export default function ResizableImage({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, width = '100%' } = node.attrs
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  // Drag-to-resize from the right edge
  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const startX = e.clientX
      const startWidth = containerRef.current?.getBoundingClientRect().width ?? 400
      const parentWidth = containerRef.current?.parentElement?.getBoundingClientRect().width ?? 600

      setDragging(true)

      const onMove = (mv: MouseEvent) => {
        const delta = mv.clientX - startX
        const newPx = Math.max(80, Math.min(parentWidth, startWidth + delta))
        const pct = Math.round((newPx / parentWidth) * 100)
        updateAttributes({ width: `${pct}%` })
      }

      const onUp = () => {
        setDragging(false)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [updateAttributes]
  )

  return (
    <NodeViewWrapper
      as="div"
      className="relative my-4 inline-block max-w-full"
      style={{ width }}
      ref={containerRef}
      data-drag-handle
    >
      {/* Image */}
      <img
        src={src}
        alt={alt ?? ''}
        draggable={false}
        className={clsx(
          'block w-full rounded-lg select-none',
          selected && 'ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-2'
        )}
      />

      {/* Controls — visible when selected */}
      {selected && (
        <>
          {/* Size presets */}
          <div className="absolute -bottom-8 left-0 flex items-center gap-px rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onMouseDown={(e) => {
                  e.preventDefault()
                  updateAttributes({ width: p.value })
                }}
                className={clsx(
                  'px-2.5 py-1 text-[11px] font-medium transition-colors',
                  width === p.value
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Drag handle — right edge */}
          <div
            onMouseDown={startDrag}
            className={clsx(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
              'flex h-8 w-3 cursor-col-resize items-center justify-center',
              'rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm',
              dragging && 'bg-zinc-900 dark:bg-zinc-100'
            )}
          >
            <div className="flex flex-col gap-0.5">
              <div className="h-3 w-px bg-zinc-400 dark:bg-zinc-500" />
              <div className="h-3 w-px bg-zinc-400 dark:bg-zinc-500" />
            </div>
          </div>
        </>
      )}
    </NodeViewWrapper>
  )
}
