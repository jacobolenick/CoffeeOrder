import { AISettings } from '../types'
import { callAI } from './aiProviders'

// ─── Schema the AI must return ───────────────────────────────
type NoteNode =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'todo'; text: string; completed: false }
  | { type: 'callout'; text: string }
  | { type: 'quote'; text: string }

interface GeneratedNote {
  title: string
  nodes: NoteNode[]
}

const SYSTEM_PROMPT = `You are an expert meeting note-taker. Your job is to turn a raw transcript into clean, structured meeting notes.

Return ONLY valid JSON — no markdown fences, no explanation, just the JSON object.

Schema:
{
  "title": "Short meeting title (4–7 words)",
  "nodes": [
    // Use these node types:
    // { "type": "heading",   "level": 2, "text": "..." }
    // { "type": "paragraph", "text": "..." }
    // { "type": "todo",      "text": "...", "completed": false }
    // { "type": "callout",   "text": "..." }
    // { "type": "quote",     "text": "..." }
  ]
}

Guidelines:
- Start with a "Summary" heading (level 2) and a paragraph summarising the meeting in 2–3 sentences
- Add a "Key Points" heading with 3–6 paragraph nodes for important points
- If any important decision was made, include a "callout" node with that decision highlighted
- Add an "Action Items" heading followed by one "todo" node per action item (assign owner if mentioned)
- Add a "Notable Quotes" heading and include 1–3 verbatim quotes as "quote" nodes — only if there are genuine, interesting quotes
- Omit any section that has nothing relevant to put in it
- Be concise and factual — do not invent anything not in the transcript`

// ─── Call AI and parse result ────────────────────────────────
export async function generateMeetingNotes(
  transcript: string,
  settings: AISettings
): Promise<GeneratedNote> {
  const response = await callAI(settings, [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Here is the meeting transcript:\n\n${transcript}`,
    },
  ])

  // Strip any accidental markdown code fences
  const cleaned = response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  // Extract JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI response did not contain valid JSON')

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedNote

  // Validate minimum shape
  if (!parsed.title || !Array.isArray(parsed.nodes)) {
    throw new Error('AI returned unexpected JSON shape')
  }

  return parsed
}

// ─── Convert to TipTap doc JSON ──────────────────────────────
export function buildTipTapDoc(note: GeneratedNote): object {
  const content: object[] = []
  const nodes = note.nodes
  let i = 0

  while (i < nodes.length) {
    const node = nodes[i]

    if (node.type === 'heading') {
      content.push({
        type: 'heading',
        attrs: { level: node.level },
        content: [{ type: 'text', text: node.text }],
      })
      i++
    } else if (node.type === 'paragraph') {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: node.text }],
      })
      i++
    } else if (node.type === 'callout') {
      content.push({
        type: 'callout',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: node.text }],
          },
        ],
      })
      i++
    } else if (node.type === 'quote') {
      content.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: node.text }],
          },
        ],
      })
      i++
    } else if (node.type === 'todo') {
      // Group consecutive todos into a single taskList
      const taskItems: object[] = []
      while (i < nodes.length && nodes[i].type === 'todo') {
        const t = nodes[i] as { type: 'todo'; text: string; completed: false }
        taskItems.push({
          type: 'taskItem',
          attrs: { checked: t.completed },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: t.text }],
            },
          ],
        })
        i++
      }
      content.push({ type: 'taskList', content: taskItems })
    } else {
      i++
    }
  }

  // TipTap requires at least one block node
  if (content.length === 0) {
    content.push({ type: 'paragraph', content: [] })
  }

  return { type: 'doc', content }
}
