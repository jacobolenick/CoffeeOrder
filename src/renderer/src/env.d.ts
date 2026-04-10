/// <reference types="vite/client" />

interface Window {
  api: {
    theme: {
      get: () => Promise<'light' | 'dark'>
      onChange: (cb: (theme: 'light' | 'dark') => void) => void
      removeListener: () => void
    }
    permissions: {
      microphone: () => Promise<boolean>
      screen: () => Promise<boolean>
    }
    capture: {
      getSources: () => Promise<{ id: string; name: string }[]>
    }
  }
}
