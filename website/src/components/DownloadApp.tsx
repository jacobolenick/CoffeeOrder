import { useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'

export default function DownloadApp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-md text-center">
        {/* Wordmark */}
        <p className="text-sm font-semibold tracking-tight text-zinc-400 mb-8">
          Coffee Order
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">
          Thanks for your purchase.
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-10">
          Your download is ready. Click below to get Coffee Order for Mac.
        </p>

        {/* Download button */}
        <a
          href="https://github.com/jacobolenick/CoffeeOrder/releases/download/v1.0.0/Coffee.Order-1.0.0-arm64.dmg"
          download="CoffeeOrder-mac.dmg"
          className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors shadow-sm mb-8"
        >
          <Download size={15} />
          Download Coffee Order
        </a>

        {/* Accordion */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden text-left">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
          >
            <span className="text-xs font-semibold text-zinc-700">
              First time opening instructions
            </span>
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
    </div>
  )
}
