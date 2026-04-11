import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const [open, setOpen] = useState(false)
  return (
    <section className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-site">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-zinc-200 text-zinc-500 bg-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            macOS — Available now
          </span>
        </div>

        <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.1] mb-5">
          Your meetings, turned into
          <br />
          <span className="text-zinc-400">clean, structured notes.</span>
        </h1>

        <p className="text-center text-base md:text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Coffee Order listens to your calls — Zoom, Meet, Teams — and uses AI to generate
          headings, todos, callouts, and quotes. Ready before you close the tab.
        </p>

        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wider">
              Early Bird
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-zinc-900">$4.99</span>
              <span className="text-xs text-zinc-400 line-through">$9.99</span>
            </div>
            <div className="w-px h-4 bg-amber-200" />
            <span className="text-xs text-amber-700 font-medium">
              Price goes up <span className="font-semibold">April 20th</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <a
            href="https://buy.stripe.com/eVq8wOa2X8VR8PB9rG6wE04"
            className="h-10 px-5 flex items-center gap-2 text-sm font-medium rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors shadow-sm"
          >
            Download for Mac
            <span className="text-zinc-400 text-xs font-normal">$4.99</span>
          </a>
          <a
            href="#demo"
            className="h-10 px-5 flex items-center text-sm font-medium rounded-lg border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
          >
            Try the editor
          </a>
        </div>
        <p className="text-center text-xs text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
          Apple Silicon (M1–M4) &amp; Intel · macOS 13+
        </p>

        <div className="mx-auto max-w-md mb-14">
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
            >
              <span className="text-xs font-semibold text-zinc-700">First time opening instructions</span>
              <ChevronDown
                size={14}
                className={`text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <div className="px-4 pb-4 border-t border-zinc-100">
                <ol className="text-xs text-zinc-500 leading-relaxed space-y-2.5 list-none pt-3">
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-400 shrink-0">1.</span>
                    <span>Open the <span className="font-medium text-zinc-700">.dmg</span> and drag <span className="font-medium text-zinc-700">Coffee Order</span> to your <span className="font-medium text-zinc-700">Applications</span> folder.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-400 shrink-0">2.</span>
                    <span>Double-click the app. If macOS says it is damaged, click <span className="font-medium text-zinc-700">OK</span> to dismiss.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-400 shrink-0">3.</span>
                    <span>Go to <span className="font-medium text-zinc-700">System Settings → Privacy &amp; Security</span> and scroll down to find Coffee Order. Click <span className="font-medium text-zinc-700">Open Anyway</span>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-400 shrink-0">4.</span>
                    <span>Open the app again — it will launch normally from now on.</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_24px_48px_-12px_rgba(0,0,0,0.08)]">
            <img
              src="/hero.png"
              alt="Coffee Order app interface"
              className="w-full h-auto rounded-xl"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
