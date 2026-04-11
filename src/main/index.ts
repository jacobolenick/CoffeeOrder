import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  systemPreferences,
  desktopCapturer,
  nativeTheme,
  dialog,
} from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// ─── Config helpers (stored in userData) ────────────────────
const CONFIG_PATH = join(app.getPath('userData'), 'coffee-order-config.json')

function readConfig(): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function writeConfig(config: Record<string, unknown>): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

// ─── Window ──────────────────────────────────────────────────
function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Allow media (microphone/camera) permission requests from the renderer
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media')
  })
  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media'
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.coffeeorder.app')
  app.on('browser-window-created', (_, w) => optimizer.watchWindowShortcuts(w))

  // Set dock icon (macOS)
  const iconPath = join(__dirname, '../../resources/icon.png')
  if (existsSync(iconPath) && app.dock) {
    app.dock.setIcon(iconPath)
  }

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC: Config ─────────────────────────────────────────────
ipcMain.handle('config:get', (_e, key: string) => {
  return readConfig()[key] ?? null
})

ipcMain.handle('config:set', (_e, key: string, value: unknown) => {
  const config = readConfig()
  config[key] = value
  writeConfig(config)
})

// ─── IPC: Folder dialog ──────────────────────────────────────
ipcMain.handle('folder:choose', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Choose Notes Folder',
    buttonLabel: 'Select Folder',
    properties: ['openDirectory', 'createDirectory'],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
})

ipcMain.handle('folder:getDefault', () => {
  return join(app.getPath('documents'), 'Coffee Order')
})

ipcMain.handle('folder:create', (_e, folderPath: string) => {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true })
  }
  return true
})

ipcMain.handle('folder:reveal', (_e, folderPath: string) => {
  shell.openPath(folderPath)
})

// ─── IPC: Notes file I/O ─────────────────────────────────────
ipcMain.handle('notes:readAll', (_e, folderPath: string) => {
  try {
    if (!existsSync(folderPath)) return []
    return readdirSync(folderPath)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
      .map((f) => {
        try {
          return JSON.parse(readFileSync(join(folderPath, f), 'utf-8'))
        } catch {
          return null
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
})

ipcMain.handle('notes:write', (_e, folderPath: string, note: unknown) => {
  try {
    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true })
    const n = note as { id: string }
    writeFileSync(join(folderPath, `${n.id}.json`), JSON.stringify(note, null, 2), 'utf-8')
    return true
  } catch {
    return false
  }
})

ipcMain.handle('notes:delete', (_e, folderPath: string, noteId: string) => {
  try {
    const filePath = join(folderPath, `${noteId}.json`)
    if (existsSync(filePath)) unlinkSync(filePath)
    return true
  } catch {
    return false
  }
})

// ─── IPC: Theme ──────────────────────────────────────────────
ipcMain.handle('theme:get', () =>
  nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
)

nativeTheme.on('updated', () => {
  BrowserWindow.getAllWindows().forEach((win) =>
    win.webContents.send('theme:changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  )
})

// ─── IPC: Permissions ────────────────────────────────────────
ipcMain.handle('permissions:microphone', async () => {
  const status = systemPreferences.getMediaAccessStatus('microphone')
  if (status === 'not-determined') return systemPreferences.askForMediaAccess('microphone')
  return status === 'granted'
})

ipcMain.handle('permissions:screen', async () => {
  return systemPreferences.getMediaAccessStatus('screen') === 'granted'
})

// ─── IPC: Desktop capturer ───────────────────────────────────
ipcMain.handle('capture:getSources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    fetchWindowIcons: false,
  })
  return sources.map((s) => ({ id: s.id, name: s.name }))
})

// ─── IPC: Export ─────────────────────────────────────────────
ipcMain.handle('export:saveText', async (_e, filename: string, content: string) => {
  const result = await dialog.showSaveDialog({
    title: 'Save Note',
    defaultPath: filename,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  })
  if (result.canceled || !result.filePath) return false
  writeFileSync(result.filePath, content, 'utf-8')
  return true
})

ipcMain.handle('export:pdf', async (_e, filename: string, html: string) => {
  const result = await dialog.showSaveDialog({
    title: 'Save PDF',
    defaultPath: filename,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  if (result.canceled || !result.filePath) return false

  const tmpFile = join(tmpdir(), `coffee-export-${Date.now()}.html`)
  writeFileSync(tmpFile, html, 'utf-8')

  const pdfWin = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, sandbox: true } })
  await pdfWin.loadFile(tmpFile)
  const data = await pdfWin.webContents.printToPDF({ printBackground: true, margins: { marginType: 'default' } })
  pdfWin.close()
  try { rmSync(tmpFile) } catch { /* ignore */ }

  writeFileSync(result.filePath, data)
  return true
})

// ─── IPC: Image picker ───────────────────────────────────────
ipcMain.handle('dialog:openImage', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Choose an Image',
    buttonLabel: 'Insert',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'] },
    ],
  })
  if (result.canceled || result.filePaths.length === 0) return null

  const filePath = result.filePaths[0]
  const ext = filePath.split('.').pop()?.toLowerCase() ?? 'png'
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', avif: 'image/avif',
  }
  const mime = mimeMap[ext] ?? 'image/png'
  const data = readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
})
