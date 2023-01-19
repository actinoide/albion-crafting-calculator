import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { autoUpdater } from "electron-updater"

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
      onCalculateBtnClick: (enchantmentequiv: number, category: string, item: string) => Promise<{ translatedRessources: translatedRessource[][], completeItem: item }[]>
      calculatePrize: (value: number, count: number, name: string | null, nutritionCost: number, localProductionBonus: number) => Promise<number>
      calculateFocus: (usingFocus: boolean, enchantment: number, itemName: string) => Promise<number>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./data/Item_categories.json") as itemType[]
let TranslationFiles = readItemFiles("./data/ItemList.json")
let completeItemFiles = readItemFiles("./data/items.json")

/**
 * creates a window with index.html.
 */
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

//loads a window when necesary.
app.whenReady().then(() => {
  CreateWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) CreateWindow()
  })
})

//closes the program when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})

autoUpdater.checkForUpdatesAndNotify()

//sends neccesary information to renderer on startup.
ipcMain.handle('onload', (event) => {
  return ItemFiles
})

//sends the category to the renderer when the user selects one.
ipcMain.handle('onItemCategorySelected', (event, category: string) => {
  category = category.replace(" ", "_")
  return ItemFiles.find((value) => {
    if (value.name == category) return true
    else return false
  })
})

// finds and sends crafting options for the desired item to the renderer.
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
  if (!completeCategory) throw Error("category not found")
  return calculateAlternative(completeItem, completeCategory, enchantmentequiv, TranslationFiles)
})

//calculates the costs with the values specified by the user and sends the result back to renderer. 
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
  if (!(item.shopcategory == "artefact")) {
    cost = cost * (1 - resourceReturnRate)
  }
  return cost
})

//calculates the required focus to craft the specified item and returns it.
ipcMain.handle("calculateFocus", (event, usingFocus: boolean, enchantment: number, itemName: String) => {
  if (!usingFocus) return 0
  let completeItem: item | undefined
  ItemFiles.forEach((category) => {
    let testitem = category.items.find((testitem) => {
      if (testitem.name == itemName) return true
      else return false
    })
    if (testitem) {
      completeItem = testitem
    }
  })
  if (!completeItem) return 0
  let focus: number = 0
  if (enchantment == 0) {
    if (Array.isArray(completeItem.craftingrequirements)) {
      focus = completeItem.craftingrequirements[0].craftingfocus
    } else {
      focus = completeItem.craftingrequirements.craftingfocus
    }
  } else {
    let enchantedRequirments = completeItem.enchantments.enchantment[enchantment - 1].craftingrequirements
    if (Array.isArray(enchantedRequirments)) {
      focus = enchantedRequirments[0].craftingfocus
    } else {
      focus = enchantedRequirments.craftingfocus
    }
  }
  return focus
})