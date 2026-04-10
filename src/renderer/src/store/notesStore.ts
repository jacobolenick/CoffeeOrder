import { v4 as uuidv4 } from 'uuid'
import { Note } from '../types'

// ─── localStorage cache (synchronous, always fast) ──────────
const CACHE_KEY = 'coffee-order-notes'

function readCache(): Note[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCache(notes: Note[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(notes))
}

// ─── Disk layer (async, fire-and-forget) ────────────────────
let _folderPath: string | null = null

function api() {
  return (window as any).api
}

function diskWrite(note: Note): void {
  if (!_folderPath) return
  api()
    .notes.write(_folderPath, note)
    .catch((e: unknown) => console.error('disk write failed', e))
}

function diskDelete(id: string): void {
  if (!_folderPath) return
  api()
    .notes.delete(_folderPath, id)
    .catch((e: unknown) => console.error('disk delete failed', e))
}

// ─── Init: call once when folder is known ───────────────────
export async function initNotesFolder(folderPath: string): Promise<void> {
  _folderPath = folderPath

  // Create the folder if it doesn't exist
  await api().folder.create(folderPath)

  // Read notes from disk
  const diskNotes: Note[] = await api().notes.readAll(folderPath)

  if (diskNotes.length > 0) {
    // Merge disk notes into cache (disk is authoritative if it has data)
    const cacheNotes = readCache()
    const cacheMap = new Map(cacheNotes.map((n) => [n.id, n]))

    for (const diskNote of diskNotes) {
      const cached = cacheMap.get(diskNote.id)
      // Disk wins if newer or not in cache
      if (!cached || new Date(diskNote.updatedAt) > new Date(cached.updatedAt)) {
        cacheMap.set(diskNote.id, diskNote)
      }
    }

    writeCache(Array.from(cacheMap.values()))
  } else {
    // No disk notes yet — write cache notes to disk (migration)
    const cacheNotes = readCache()
    for (const note of cacheNotes) {
      diskWrite(note)
    }
  }
}

export function getNotesFolder(): string | null {
  return _folderPath
}

// ─── CRUD (synchronous via cache + async disk) ───────────────

export function getAllNotes(): Note[] {
  return readCache().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getNoteById(id: string): Note | undefined {
  return readCache().find((n) => n.id === id)
}

export function createNote(partial?: Partial<Note>): Note {
  const now = new Date().toISOString()
  const note: Note = {
    id: uuidv4(),
    title: 'Untitled',
    content: '',
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
  const notes = readCache()
  notes.unshift(note)
  writeCache(notes)
  diskWrite(note)
  return note
}

export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = readCache()
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  notes[idx] = { ...notes[idx], ...updates, updatedAt: new Date().toISOString() }
  writeCache(notes)
  diskWrite(notes[idx])
  return notes[idx]
}

export function deleteNote(id: string): void {
  writeCache(readCache().filter((n) => n.id !== id))
  diskDelete(id)
}
