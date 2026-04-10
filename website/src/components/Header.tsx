export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto max-w-site px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            Coffee Order
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#demo" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Try it
          </a>
          <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/jacobolenick/CoffeeOrder/releases/download/v1.0.0/Coffee.Order-1.0.0-arm64.dmg" download="CoffeeOrder-mac.dmg"
            
            className="h-8 px-3.5 flex items-center text-sm font-medium rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition-colors shadow-sm"
          >
            Download
          </a>
        </div>
      </div>
    </header>
  )
}
