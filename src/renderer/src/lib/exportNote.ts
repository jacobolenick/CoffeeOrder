import { Note } from '../types'

// ─── TipTap JSON → Markdown ──────────────────────────────────

type TipTapNode = {
  type: string
  attrs?: Record<string, any>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, any> }>
}

function inlineToMd(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === 'hardBreak') return '  \n'
      if (node.type !== 'text') return ''
      let text = node.text || ''
      for (const mark of node.marks || []) {
        if (mark.type === 'bold') text = `**${text}**`
        else if (mark.type === 'italic') text = `*${text}*`
        else if (mark.type === 'code') text = `\`${text}\``
        else if (mark.type === 'link') text = `[${text}](${mark.attrs?.href || ''})`
      }
      return text
    })
    .join('')
}

function nodeToMd(node: TipTapNode, listDepth = 0): string {
  switch (node.type) {
    case 'heading': {
      const prefix = '#'.repeat(node.attrs?.level || 1)
      return `${prefix} ${inlineToMd(node.content)}\n\n`
    }
    case 'paragraph': {
      const text = inlineToMd(node.content)
      return text.trim() ? `${text}\n\n` : '\n'
    }
    case 'bulletList':
      return (
        (node.content || [])
          .map((item) => {
            const inner = (item.content || []).map((n) => nodeToMd(n, listDepth + 1)).join('').trim()
            return `${'  '.repeat(listDepth)}- ${inner}\n`
          })
          .join('') + '\n'
      )
    case 'orderedList':
      return (
        (node.content || [])
          .map((item, i) => {
            const inner = (item.content || []).map((n) => nodeToMd(n, listDepth + 1)).join('').trim()
            return `${'  '.repeat(listDepth)}${i + 1}. ${inner}\n`
          })
          .join('') + '\n'
      )
    case 'taskList':
      return (
        (node.content || [])
          .map((item) => {
            const checked = item.attrs?.checked ? 'x' : ' '
            const inner = (item.content || []).map((n) => nodeToMd(n, listDepth + 1)).join('').trim()
            return `${'  '.repeat(listDepth)}- [${checked}] ${inner}\n`
          })
          .join('') + '\n'
      )
    case 'blockquote':
    case 'callout': {
      const inner = (node.content || []).map((n) => nodeToMd(n)).join('').trim()
      return inner.split('\n').map((line) => `> ${line}`).join('\n') + '\n\n'
    }
    case 'codeBlock': {
      const lang = node.attrs?.language || ''
      const code = (node.content || []).map((n) => n.text || '').join('')
      return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`
    }
    case 'horizontalRule':
      return '---\n\n'
    case 'listItem':
    case 'taskItem':
      return (node.content || []).map((n) => nodeToMd(n, listDepth)).join('').trim()
    default:
      return (node.content || []).map((n) => nodeToMd(n, listDepth)).join('')
  }
}

export function tiptapToMarkdown(title: string, content: string): string {
  try {
    const doc = JSON.parse(content)
    const body = (doc.content || []).map((n: TipTapNode) => nodeToMd(n)).join('')
    return `# ${title}\n\n${body}`.trimEnd() + '\n'
  } catch {
    return `# ${title}\n\n`
  }
}

// ─── TipTap JSON → HTML (for PDF) ────────────────────────────

function escapHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineToHtml(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === 'hardBreak') return '<br>'
      if (node.type !== 'text') return ''
      let text = escapHtml(node.text || '')
      for (const mark of node.marks || []) {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`
        else if (mark.type === 'italic') text = `<em>${text}</em>`
        else if (mark.type === 'underline') text = `<u>${text}</u>`
        else if (mark.type === 'code') text = `<code>${text}</code>`
        else if (mark.type === 'highlight') text = `<mark>${text}</mark>`
        else if (mark.type === 'link')
          text = `<a href="${escapHtml(mark.attrs?.href || '')}">${text}</a>`
      }
      return text
    })
    .join('')
}

function nodeToHtml(node: TipTapNode, listDepth = 0): string {
  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level || 1
      return `<h${level}>${inlineToHtml(node.content)}</h${level}>`
    }
    case 'paragraph':
      return `<p>${inlineToHtml(node.content) || '&nbsp;'}</p>`
    case 'bulletList':
      return `<ul>${(node.content || []).map((item) => `<li>${(item.content || []).map((n) => nodeToHtml(n, listDepth + 1)).join('')}</li>`).join('')}</ul>`
    case 'orderedList':
      return `<ol>${(node.content || []).map((item) => `<li>${(item.content || []).map((n) => nodeToHtml(n, listDepth + 1)).join('')}</li>`).join('')}</ol>`
    case 'taskList':
      return `<ul class="task-list">${(node.content || []).map((item) => `<li><input type="checkbox" ${item.attrs?.checked ? 'checked' : ''} disabled>${(item.content || []).map((n) => nodeToHtml(n, listDepth + 1)).join('')}</li>`).join('')}</ul>`
    case 'blockquote':
      return `<blockquote>${(node.content || []).map((n) => nodeToHtml(n)).join('')}</blockquote>`
    case 'callout':
      return `<div class="callout">${(node.content || []).map((n) => nodeToHtml(n)).join('')}</div>`
    case 'codeBlock': {
      const lang = node.attrs?.language || ''
      const code = (node.content || []).map((n) => escapHtml(n.text || '')).join('')
      return `<pre><code class="language-${lang}">${code}</code></pre>`
    }
    case 'horizontalRule':
      return '<hr>'
    case 'image':
      return `<img src="${escapHtml(node.attrs?.src || '')}" style="max-width:100%">`
    case 'listItem':
    case 'taskItem':
      return (node.content || []).map((n) => nodeToHtml(n, listDepth)).join('')
    default:
      return (node.content || []).map((n) => nodeToHtml(n, listDepth)).join('')
  }
}

export function tiptapToHtml(title: string, content: string, date: string): string {
  try {
    const doc = JSON.parse(content)
    const body = (doc.content || []).map((n: TipTapNode) => nodeToHtml(n)).join('\n')
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapHtml(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.7; color: #1a1a1a; max-width: 680px; margin: 0 auto; padding: 48px 40px; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
  h2 { font-size: 20px; font-weight: 600; margin: 28px 0 8px; }
  h3 { font-size: 16px; font-weight: 600; margin: 20px 0 6px; }
  .meta { font-size: 12px; color: #888; margin-bottom: 32px; border-bottom: 1px solid #e8e8e8; padding-bottom: 16px; }
  p { margin: 0 0 12px; }
  ul, ol { margin: 0 0 12px 20px; }
  li { margin: 4px 0; }
  ul.task-list { list-style: none; margin-left: 0; }
  ul.task-list li { display: flex; align-items: flex-start; gap: 6px; }
  ul.task-list input { margin-top: 3px; flex-shrink: 0; }
  blockquote { border-left: 3px solid #d4d4d4; padding: 4px 16px; margin: 0 0 12px; color: #555; }
  .callout { background: #f5f5f5; border-radius: 6px; padding: 12px 16px; margin: 0 0 12px; }
  pre { background: #f3f3f3; border-radius: 6px; padding: 14px 16px; overflow-x: auto; margin: 0 0 12px; }
  code { font-family: 'SF Mono', Menlo, monospace; font-size: 12.5px; }
  p code { background: #f3f3f3; padding: 2px 5px; border-radius: 3px; }
  hr { border: none; border-top: 1px solid #e8e8e8; margin: 20px 0; }
  mark { background: #fff3b0; padding: 1px 2px; }
  a { color: #0066cc; }
  strong { font-weight: 600; }
  img { max-width: 100%; border-radius: 4px; }
</style>
</head>
<body>
<h1>${escapHtml(title)}</h1>
<div class="meta">${escapHtml(date)}</div>
${body}
</body>
</html>`
  } catch {
    return `<!DOCTYPE html><html><body><h1>${escapHtml(title)}</h1></body></html>`
  }
}

// ─── Export actions ───────────────────────────────────────────

export async function exportAsMarkdown(note: Note): Promise<void> {
  if (!note.content) return
  const md = tiptapToMarkdown(note.title || 'Untitled', note.content)
  const api = (window as any).api
  await api.export.saveText(`${note.title || 'note'}.md`, md)
}

export async function exportAsPdf(note: Note): Promise<void> {
  if (!note.content) return
  const { format } = await import('date-fns')
  const date = format(new Date(note.updatedAt), 'MMM d, yyyy · h:mm a')
  const html = tiptapToHtml(note.title || 'Untitled', note.content, date)
  const api = (window as any).api
  await api.export.pdf(`${note.title || 'note'}.pdf`, html)
}
