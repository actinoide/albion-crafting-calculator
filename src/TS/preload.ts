import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onload: () => ipcRenderer.invoke('onload'),
  onItemCategorySelected: (category: string) => ipcRenderer.invoke("onItemCategorySelected", category),
  onCalculateBtnClick: (enchantmentequiv: number, category: string, item: string) => ipcRenderer.invoke("onCalculateBtnClick", enchantmentequiv, category, item),
  calculatePrize: (value: number, count: number, name: string | null, nutritionCost: number, localProductionBonus: number) => ipcRenderer.invoke("calculatePrize", value, count, name, nutritionCost, localProductionBonus),
  calculateFocus: (usingFocus: boolean, enchantment: number, itemName: string) => ipcRenderer.invoke("calculateFocus", usingFocus, enchantment, itemName)
})