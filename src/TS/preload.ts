import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onContentChanged: (newContent: string) => ipcRenderer.invoke("onContentChanged", newContent),
  onload: () => ipcRenderer.invoke('onload')
})
