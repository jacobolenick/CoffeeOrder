export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 px-6">
      <div className="mx-auto max-w-site flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Coffee Order
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-xs text-zinc-500">
            AI meeting notes for Mac
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Contact
          </a>
        </div>

        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Coffee Order
        </p>
      </div>
    </footer>
  )
}
