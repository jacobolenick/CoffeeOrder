export default function Hero() {
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

        <div className="flex items-center justify-center gap-3 mb-2">
          <a
            href="https://github.com/jacobolenick/CoffeeOrder/releases/download/v1.0.0/Coffee.Order-1.0.0-arm64.dmg" download="CoffeeOrder-mac.dmg"
            
            className="h-10 px-5 flex items-center text-sm font-medium rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors shadow-sm"
          >
            Download for Mac
          </a>
          <a
            href="#demo"
            className="h-10 px-5 flex items-center text-sm font-medium rounded-lg border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
          >
            Try the editor
          </a>
        </div>
        <p className="text-center text-xs text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
          Apple Silicon (M1–M4) · macOS 13+
        </p>

        <div className="mx-auto max-w-md mb-14">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-xs font-semibold text-zinc-700 mb-1.5">First time opening?</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              macOS may show a "damaged" warning. Right-click{' '}
              <span className="font-medium text-zinc-700">Coffee Order.app</span>{' → '}
              <span className="font-medium text-zinc-700">Open</span>{' → '}click{' '}
              <span className="font-medium text-zinc-700">Open</span> in the dialog. Only needed once.
            </p>
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
