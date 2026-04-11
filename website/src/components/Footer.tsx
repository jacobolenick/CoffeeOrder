export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 px-6">
      <div className="mx-auto max-w-site flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Coffee Order
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-xs text-zinc-500">
            AI meeting notes for Mac
          </span>
        </div>

        {/* Privacy policy */}
        <div className="text-xs text-zinc-400 max-w-sm text-center leading-relaxed">
          Coffee Order does not collect, store, or share any personal data. All notes and
          recordings stay on your device. AI features use your own API keys and communicate
          directly with the respective providers.
        </div>

        <div className="flex flex-col items-center md:items-end gap-1.5">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Coffee Order
          </p>
          <p className="text-xs text-zinc-400">
            Created by{' '}
            <a
              href="https://www.linkedin.com/in/jacobmolenick"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Jacob Olenick
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
