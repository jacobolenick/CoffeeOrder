import {
  Mic,
  Sparkles,
  List,
  Image,
  FolderOpen,
  Bot,
  Type,
  CheckSquare,
  PanelBottom,
  Link2,
  Columns3,
  Table2,
  Tag,
  Calendar,
} from 'lucide-react'

const cardBase =
  'relative rounded-2xl border border-zinc-200/90 bg-white p-6 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden'
const cardMuted =
  'relative rounded-2xl border border-zinc-200/90 bg-zinc-100/80 p-6 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden'

interface BentoCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  variant?: 'default' | 'muted'
  children?: React.ReactNode
}

function BentoCard({
  icon,
  title,
  description,
  className = '',
  variant = 'default',
  children,
}: BentoCardProps) {
  const shell = variant === 'muted' ? cardMuted : cardBase
  return (
    <div className={`${shell} ${className}`}>
      <div className="inline-flex w-9 h-9 rounded-xl items-center justify-center mb-4 bg-zinc-100 border border-zinc-200/80 text-zinc-600">
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-2 tracking-tight text-zinc-900">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
      {children && <div className="mt-auto pt-5">{children}</div>}
    </div>
  )
}

function AppScreenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
      <img src={src} alt={alt} className="w-full h-auto object-cover object-top" loading="lazy" decoding="async" />
    </div>
  )
}

function RecordingVideo() {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-black">
      <video
        src="/app-record.mov"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto object-cover"
      />
    </div>
  )
}

function AIProviderPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {['Claude', 'ChatGPT', 'Gemini'].map((p) => (
        <span
          key={p}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-zinc-600 border border-zinc-200 shadow-sm"
        >
          {p}
        </span>
      ))}
    </div>
  )
}

// Keep KanbanPreview / TablePreview / DueDatePreview for fallback reference but primary cards now use real screenshots

function SlashPreview() {
  const items = ['Heading 1', 'Todo List', 'Table', 'Kanban Board', 'Callout', 'Divider']
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="px-3 py-2.5 border-b border-zinc-100 bg-zinc-50/80">
        <span className="text-[10px] font-medium text-zinc-400 tracking-wide">/ Type to filter</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item}
          className={`px-3 py-1.5 flex items-center gap-2 ${
            i === 0 ? 'bg-zinc-100' : 'hover:bg-zinc-50'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-sm flex-shrink-0 ${
              i === 0 ? 'bg-zinc-500' : 'bg-zinc-300'
            }`}
          />
          <span
            className={`text-[11px] font-medium ${
              i === 0 ? 'text-zinc-900' : 'text-zinc-600'
            }`}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}

function NoteLinkPreview() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
      {/* Typing [[ */}
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
        <span>See also</span>
        <span className="font-mono text-zinc-400">[[</span>
        <span className="h-3.5 w-px bg-zinc-400 animate-pulse" />
      </div>
      {/* Dropdown */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {['Q3 Planning', 'Product Roadmap', 'Design Review'].map((title, i) => (
          <div
            key={title}
            className={`flex items-center gap-2 px-3 py-1.5 ${i === 0 ? 'bg-zinc-100' : ''}`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className={`text-[10px] font-medium ${i === 0 ? 'text-zinc-900' : 'text-zinc-500'}`}>{title}</span>
          </div>
        ))}
      </div>
      {/* Inserted chip */}
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
        <span>See also</span>
        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Q3 Planning
        </span>
      </div>
    </div>
  )
}

function KanbanPreview() {
  const columns = [
    { label: 'To Do', color: 'bg-zinc-300', cards: ['Update docs', 'API review'] },
    { label: 'In Progress', color: 'bg-blue-400', cards: ['Auth flow'] },
    { label: 'Done', color: 'bg-green-400', cards: ['Design QA'] },
  ]
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div key={col.label}>
            <div className="flex items-center gap-1 mb-1.5">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${col.color}`} />
              <span className="text-[9px] font-semibold text-zinc-500 truncate">{col.label}</span>
            </div>
            <div className="space-y-1">
              {col.cards.map((card) => (
                <div key={card} className="rounded border border-zinc-200 bg-white px-2 py-1.5 shadow-sm">
                  <span className="text-[9px] text-zinc-700 leading-none">{card}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TablePreview() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="bg-zinc-100 border-b border-zinc-200">
            <th className="px-2.5 py-1.5 text-left font-semibold text-zinc-600 border-r border-zinc-200">Item</th>
            <th className="px-2.5 py-1.5 text-left font-semibold text-zinc-600 border-r border-zinc-200">Label</th>
            <th className="px-2.5 py-1.5 text-left font-semibold text-zinc-600">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-200 bg-white">
            <td className="px-2.5 py-1.5 text-zinc-700 border-r border-zinc-200">Figma Pro</td>
            <td className="px-2.5 py-1.5 border-r border-zinc-200">
              <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>Design</span>
            </td>
            <td className="px-2.5 py-1.5">
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">$15.00</span>
            </td>
          </tr>
          <tr className="border-b border-zinc-200 bg-white">
            <td className="px-2.5 py-1.5 text-zinc-700 border-r border-zinc-200">
              <span className="inline-flex items-center gap-1">
                Linear
                <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[8px] bg-zinc-100 text-zinc-600 border border-zinc-200">
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  Q3 Plan
                </span>
              </span>
            </td>
            <td className="px-2.5 py-1.5 border-r border-zinc-200">
              <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#a855f7', color: '#fff' }}>Tools</span>
            </td>
            <td className="px-2.5 py-1.5">
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">$8.00</span>
            </td>
          </tr>
          <tr className="bg-white">
            <td className="px-2.5 py-1.5 text-zinc-700 border-r border-zinc-200">Vercel</td>
            <td className="px-2.5 py-1.5 border-r border-zinc-200">
              <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#22c55e', color: '#fff' }}>Infra</span>
            </td>
            <td className="px-2.5 py-1.5">
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">$20.00</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DueDatePreview() {
  const tasks = [
    { text: 'Send proposal', date: 'Today', dateColor: 'text-orange-500', checked: false },
    { text: 'Review designs', date: 'Apr 14', dateColor: 'text-zinc-400', checked: false },
    { text: 'Push hotfix', date: 'Apr 9', dateColor: 'text-red-500', checked: true },
  ]
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-1.5">
      {tasks.map((task) => (
        <div key={task.text} className="flex items-center gap-2 rounded-lg bg-white border border-zinc-100 px-2.5 py-1.5">
          <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${task.checked ? 'bg-zinc-700 border-zinc-700' : 'border-zinc-300 bg-white'}`}>
            {task.checked && (
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                <path d="M1 2.5L2.5 4L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className={`text-[10px] flex-1 ${task.checked ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>{task.text}</span>
          <span className={`text-[9px] font-medium flex items-center gap-0.5 ${task.dateColor}`}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {task.date}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Bento() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="mx-auto max-w-site">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 mb-4">
            Everything you need from a meeting.
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            From live capture to structured output — Coffee Order handles the whole flow so
            you can stay in the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

          {/* Row 1 */}
          <BentoCard
            icon={<Mic size={16} strokeWidth={2} />}
            title="Live meeting capture"
            description="Captures your microphone and system audio simultaneously — works with Zoom, Meet, Teams, and any other call tool."
            variant="muted"
            className="lg:col-span-2"
          >
            <RecordingVideo />
          </BentoCard>

          <BentoCard
            icon={<Sparkles size={16} strokeWidth={2} />}
            title="AI-generated notes"
            description="Transcription is sent to your AI of choice and returned as structured, ready-to-use notes. No copy-pasting."
          >
            <AIProviderPills />
          </BentoCard>

          {/* Row 2 — new features */}
          <BentoCard
            icon={<Link2 size={16} strokeWidth={2} />}
            title="Link between notes"
            description="Type [[ anywhere to search and insert a clickable link to another note. Build a web of connected ideas without leaving the keyboard."
          >
            <NoteLinkPreview />
          </BentoCard>

          <BentoCard
            icon={<Columns3 size={16} strokeWidth={2} />}
            title="Kanban boards"
            description="Turn any todo list into a kanban board with To Do, In Progress, and Done columns. Move cards across columns and set due dates on each."
          >
            <AppScreenshot src="/app-kanban.png" alt="Kanban board in Coffee Order" />
          </BentoCard>

          <BentoCard
            icon={<Calendar size={16} strokeWidth={2} />}
            title="Due dates on tasks"
            description="Set a due date on any todo item. Overdue tasks turn red, today's tasks turn orange — so nothing slips through."
          >
            <DueDatePreview />
          </BentoCard>

          {/* Row 3 */}
          <BentoCard
            icon={<Table2 size={16} strokeWidth={2} />}
            title="Tables with rich cells"
            description="Insert resizable tables and fill cells with formatted text, coloured label chips, dollar amounts, and note reference links."
            className="lg:col-span-2"
          >
            <AppScreenshot src="/app-table.png" alt="Table view in Coffee Order" />
          </BentoCard>

          <BentoCard
            icon={<Tag size={16} strokeWidth={2} />}
            title="Inline labels"
            description="Tag anything inline — inside a sentence, a table cell, or a heading. Colour-coded labels keep context visible at a glance."
          />

          {/* Row 4 */}
          <BentoCard
            icon={<Type size={16} strokeWidth={2} />}
            title="Slash commands"
            description="Type / anywhere to bring up a scrollable menu of blocks — headings, callouts, tables, kanban, images, links, and more."
          >
            <SlashPreview />
          </BentoCard>

          <BentoCard
            icon={<List size={16} strokeWidth={2} />}
            title="Rich note editor"
            description="Full formatting toolbar, block-level structure, drag-and-drop images, and highlights — without the clutter."
          >
            <AppScreenshot src="/app-notes.png" alt="Meeting notes in Coffee Order" />
          </BentoCard>

          <BentoCard
            icon={<CheckSquare size={16} strokeWidth={2} />}
            title="Action items & todos"
            description="AI detects action items from the transcript and surfaces them as checkable todos, grouped by context."
          />

          {/* Row 5 */}
          <BentoCard
            icon={<PanelBottom size={16} strokeWidth={2} />}
            title="In your dock"
            description="Coffee Order sits alongside the tools you already use — one click from your dock when the meeting wraps."
            className="lg:col-span-2"
          >
            <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-inner">
              <img
                src="/dock.png"
                alt="Coffee Order app icon in the macOS dock"
                className="w-full h-auto object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </BentoCard>

          <BentoCard
            icon={<Image size={16} strokeWidth={2} />}
            title="Image support"
            description="Insert images from your Mac. Resize them inline with the drag handle or quick-set presets — ¼, ½, ¾, Full."
          />

          {/* Row 6 */}
          <BentoCard
            icon={<FolderOpen size={16} strokeWidth={2} />}
            title="Local folder storage"
            description="Notes are saved as plain JSON files in a folder you choose. No cloud sync required — your data stays on your machine."
          />

          <BentoCard
            icon={<Bot size={16} strokeWidth={2} />}
            title="Any AI provider"
            description="Choose between Claude, ChatGPT, or Gemini. Bring your own API key and keep full control over model and cost."
            variant="muted"
            className="lg:col-span-2"
          />
        </div>
      </div>
    </section>
  )
}
