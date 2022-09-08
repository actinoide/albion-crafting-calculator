import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onload: () => ipcRenderer.invoke('onload'),
  onItemCategorySelected:(category:string)=>ipcRenderer.invoke("onItemCategorySelected",category)
})
