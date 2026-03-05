import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  showNotification: (title: string, body: string) => 
    ipcRenderer.invoke('show-notification', { title, body }),
  platform: process.platform
})
