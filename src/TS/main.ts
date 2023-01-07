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
      calculateFocus: (usingFocus: boolean) => Promise<number>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./dev_files/Item_categories.json") as itemType[]
let TranslationFiles = readItemFiles("./dev_files/ItemList.json")
let completeItemFiles = readItemFiles("./dev_files/items.json")
let selectedItem: item

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
  selectedItem = completeItem
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

ipcMain.handle("calculateFocus", (event,usingFocus: boolean) => {
  console.log(selectedItem.craftingrequirements);
  let focus: number = 0// this part should be refactored out of the costs method and made into its own callable alternative
  if (usingFocus) {
    if (Array.isArray(selectedItem.craftingrequirements)) {
      focus = selectedItem.craftingrequirements[0].craftingfocus
    } else {
      focus = selectedItem.craftingrequirements.craftingfocus
    }
  }
  return focus
})