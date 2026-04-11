import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Config (stored in userData/coffee-order-config.json)
  config: {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('config:set', key, value),
  },
  // Folder
  folder: {
    choose: () => ipcRenderer.invoke('folder:choose'),
    getDefault: () => ipcRenderer.invoke('folder:getDefault'),
    create: (path: string) => ipcRenderer.invoke('folder:create', path),
    reveal: (path: string) => ipcRenderer.invoke('folder:reveal', path),
  },
  // Notes file I/O
  notes: {
    readAll: (folderPath: string) => ipcRenderer.invoke('notes:readAll', folderPath),
    write: (folderPath: string, note: unknown) => ipcRenderer.invoke('notes:write', folderPath, note),
    delete: (folderPath: string, noteId: string) => ipcRenderer.invoke('notes:delete', folderPath, noteId),
  },
  // Theme
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    onChange: (callback: (theme: 'light' | 'dark') => void) => {
      ipcRenderer.on('theme:changed', (_e, theme) => callback(theme))
    },
    removeListener: () => ipcRenderer.removeAllListeners('theme:changed'),
  },
  // Permissions
  permissions: {
    microphone: () => ipcRenderer.invoke('permissions:microphone'),
    screen: () => ipcRenderer.invoke('permissions:screen'),
  },
  // Capture
  capture: {
    getSources: () => ipcRenderer.invoke('capture:getSources'),
  },
  // Image picker
  dialog: {
    openImage: () => ipcRenderer.invoke('dialog:openImage'),
  },
  // Export
  export: {
    saveText: (filename: string, content: string) => ipcRenderer.invoke('export:saveText', filename, content),
    pdf: (filename: string, html: string) => ipcRenderer.invoke('export:pdf', filename, html),
  },
  // Editor events from main
  editor: {
    onFixWithAI: (callback: (text: string) => void) => {
      ipcRenderer.on('editor:fixWithAI', (_e, text) => callback(text))
    },
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
