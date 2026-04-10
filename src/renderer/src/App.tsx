import { useState, useEffect, useCallback } from 'react'
import { Note } from './types'
import { getAllNotes, createNote, deleteNote, initNotesFolder } from './store/notesStore'
import Sidebar from './components/Sidebar'
import NoteHeader from './components/NoteHeader'
import NoteEditor from './components/Editor/NoteEditor'
import SettingsPanel from './components/SettingsPanel'
import CapturePanel from './components/CapturePanel'
import FolderSetup from './components/FolderSetup'

type RightPanel = 'none' | 'settings' | 'capture'
type AppState = 'loading' | 'setup' | 'ready'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [rightPanel, setRightPanel] = useState<RightPanel>('none')
  const [isCapturing, setIsCapturing] = useState(false)

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null

  // Check for configured folder on launch
  useEffect(() => {
    const api = (window as any).api
    api.config.get('notesFolder').then(async (folderPath: string | null) => {
      if (!folderPath) {
        setAppState('setup')
      } else {
        await initNotesFolder(folderPath)
        const loaded = getAllNotes()
        setNotes(loaded)
        if (loaded.length > 0) setActiveNoteId(loaded[0].id)
        setAppState('ready')
      }
    })
  }, [])

  const handleFolderSelected = useCallback(async (folderPath: string) => {
    await initNotesFolder(folderPath)
    const loaded = getAllNotes()
    setNotes(loaded)
    if (loaded.length > 0) setActiveNoteId(loaded[0].id)
    setAppState('ready')
  }, [])

  const handleNewNote = useCallback(() => {
    const note = createNote()
    setNotes(getAllNotes())
    setActiveNoteId(note.id)
  }, [])

  const handleSelectNote = useCallback((id: string) => {
    setActiveNoteId(id)
  }, [])

  const handleDeleteNote = useCallback(
    (id: string) => {
      deleteNote(id)
      const remaining = getAllNotes()
      setNotes(remaining)
      if (activeNoteId === id) setActiveNoteId(remaining[0]?.id ?? null)
    },
    [activeNoteId]
  )

  const handleNoteUpdate = useCallback((updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
  }, [])

  const handleNotesReady = useCallback((title: string, tiptapContent: string) => {
    const note = createNote({ title, content: tiptapContent, meetingSource: 'manual' })
    setNotes(getAllNotes())
    setActiveNoteId(note.id)
  }, [])

  // ── Loading splash ─────────────────────────────────────────
  if (appState === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-1 w-1 animate-ping rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>
    )
  }

  // ── First launch: folder setup ─────────────────────────────
  if (appState === 'setup') {
    return <FolderSetup onComplete={handleFolderSelected} />
  }

  // ── Main app ───────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
        onOpenSettings={() => setRightPanel((p) => (p === 'settings' ? 'none' : 'settings'))}
        onOpenCapture={() => setRightPanel((p) => (p === 'capture' ? 'none' : 'capture'))}
        isCapturing={isCapturing}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="h-11 shrink-0 border-b border-zinc-100 dark:border-zinc-900" />

        {activeNote ? (
          <>
            <NoteHeader note={activeNote} onUpdate={handleNoteUpdate} />
            <div className="flex-1 overflow-hidden">
              <NoteEditor
                key={activeNote.id}
                note={activeNote}
                onUpdate={handleNoteUpdate}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <p className="text-xs text-zinc-300 dark:text-zinc-800">No note selected</p>
            <button
              onClick={handleNewNote}
              className="rounded border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              New note
            </button>
          </div>
        )}
      </main>

      {rightPanel !== 'none' && (
        <div className="w-80 shrink-0 border-l border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
          <div className="h-11 shrink-0 border-b border-zinc-100 dark:border-zinc-900" />
          <div className="h-[calc(100vh-44px)] overflow-hidden">
            {rightPanel === 'settings' && (
              <SettingsPanel onClose={() => setRightPanel('none')} />
            )}
            {rightPanel === 'capture' && (
              <CapturePanel
                onClose={() => setRightPanel('none')}
                onNotesReady={handleNotesReady}
                onCaptureStateChange={setIsCapturing}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
