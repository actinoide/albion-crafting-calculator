import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { makeApiCall } from "./apiCalls"
import { readItemFiles } from "./readItemFiles"
import { itemType } from "./structs/itemType"
import { translatedRessource } from "./structs/translatedRessource"
import { calculateNeededRessources } from "./calculateNeededRessources"
import { item } from "./structs/item"
import { calculateAlternative } from "./calculateAlternatives"

//declaring global for autocomplete with ipc
declare global {
  interface Window {
    electronAPI: {
      onContentChanged: (newContent: string | null | undefined) => Promise<string>
      onload: () => Promise<itemType[]>
      onItemCategorySelected: (category: string) => Promise<itemType>
      onCalculateBtnClick: (enchantmentequiv: number, category: string, item: string) => Promise<translatedRessource[][][]>
      calculatePrize: (value: number, count: number, name: string | null, nutritionCost: number, localProductionBonus: number) => Promise<number>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./dev_files/Item_categories.json") as itemType[]
let TranslationFiles = readItemFiles("./dev_files/ItemList.json")
let completeItemFiles = readItemFiles("./dev_files/items.json")

// creates the window used by the process
const CreateWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, '/preload.js')
    }
  })
  win.webContents.openDevTools()//!!!!
  winid = win.id
  win.loadFile('./src/html_css/index.html')
  win.on("ready-to-show", () => {
    win.show();
  })
}

//loads a window when necesary
app.whenReady().then(() => {
  CreateWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) CreateWindow()
  })
})

//closes the program when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('onload', (event) => {
  return ItemFiles
})

ipcMain.handle('onItemCategorySelected', (event, category: string) => {
  category = category.replace(" ", "_")
  return ItemFiles.find((value) => {
    if (value.name == category) return true
    else return false
  })
})

ipcMain.handle('onCalculateBtnClick', (event, enchantmentequiv: number, category: string, inputItem: string) => {
  //looks up category and item based on their names
  category = category.replace(" ", "_")
  let completeCategory = ItemFiles.find((testitem) => {
    if (testitem.name == category) return true
    else return false
  })
  let completeItem = completeCategory?.items.find((testitem) => {
    if (testitem.name == inputItem) return true
    else return false
  })
  if (!completeItem) throw Error("item not found")
  if (!completeCategory) throw Error("cat not found")
  let results: translatedRessource[][][] = []
  results = calculateAlternative(completeItem, completeCategory, enchantmentequiv, TranslationFiles)
  return results;
})

ipcMain.handle("calculatePrize", (event, value: number, count: number, name: string | null, nutritionCost: number, localProductionBonus: number) => {
  if (!name) return 0
  let item = completeItemFiles.items.simpleitem.find((item: any) => {
    if (item.uniquename == name) return true
    else return false
  })
  let resourceReturnRate = 1 - 1 / (1 + (localProductionBonus / 100))
  let cost: number = 0
  cost += item.itemvalue * 0.1125 * (nutritionCost / 100) * count
  cost += value * count
  if(!(item.shopcategory == "artefact")){
  cost = cost * (1 - resourceReturnRate)
  }
  return cost
})