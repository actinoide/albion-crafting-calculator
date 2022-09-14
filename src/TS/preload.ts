import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onload: () => ipcRenderer.invoke('onload'),
  onItemCategorySelected:(category:string)=>ipcRenderer.invoke("onItemCategorySelected",category),
  onCalculateBtnClick:(enchantmentequiv:number,category:string,item:string)=>ipcRenderer.invoke("onCalculateBtnClick",enchantmentequiv,category,item)
})
