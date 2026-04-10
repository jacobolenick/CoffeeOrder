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

function MiniNote() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-2 bg-white/60">
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
          Design Review
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 rounded-md bg-zinc-200 w-2/3" />
        <div className="h-2.5 rounded-md bg-zinc-100 w-full" />
        <div className="h-2.5 rounded-md bg-zinc-100 w-4/5" />
        <div className="flex items-center gap-2 pt-1">
          <div className="w-3 h-3 rounded border border-zinc-300 flex-shrink-0 bg-white" />
          <div className="h-2 rounded-md bg-zinc-100 w-3/5" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-zinc-300 flex-shrink-0 bg-zinc-600 flex items-center justify-center">
            <svg width="7" height="5" viewBox="0 0 7 5" fill="none" aria-hidden>
              <path
                d="M1 2.5L2.5 4L6 1"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="h-2 rounded-md bg-zinc-100 w-2/5 opacity-70" />
        </div>
      </div>
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

function SlashPreview() {
  const items = ['Heading 1', 'Heading 2', 'To-do', 'Callout', 'Quote', 'Code block']
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
          <BentoCard
            icon={<Mic size={16} strokeWidth={2} />}
            title="Live meeting capture"
            description="Captures your microphone and system audio simultaneously — works with Zoom, Meet, Teams, and any other call tool."
            variant="muted"
            className="lg:col-span-2"
          />

          <BentoCard
            icon={<Sparkles size={16} strokeWidth={2} />}
            title="AI-generated notes"
            description="Transcription is sent to your AI of choice and returned as structured, ready-to-use notes. No copy-pasting."
          >
            <AIProviderPills />
          </BentoCard>

          <BentoCard
            icon={<Type size={16} strokeWidth={2} />}
            title="Slash commands"
            description="Type / anywhere to bring up a menu of blocks — headings, callouts, code, todo lists, and more."
          >
            <SlashPreview />
          </BentoCard>

          <BentoCard
            icon={<List size={16} strokeWidth={2} />}
            title="Rich note editor"
            description="A full formatting toolbar, block-level structure, drag-and-drop images, and highlights — without the clutter."
          >
            <MiniNote />
          </BentoCard>

          <BentoCard
            icon={<CheckSquare size={16} strokeWidth={2} />}
            title="Action items & todos"
            description="AI detects action items from the transcript and surfaces them as checkable todos, grouped by context."
          />

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
