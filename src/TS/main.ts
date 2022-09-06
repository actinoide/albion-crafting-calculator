import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { makeApiCall } from "./apiCalls"
import { readItemFiles } from "./readItemFiles"

//declaring global for autocomplete with ipc
declare global {
  interface Window {
    electronAPI: {
      onContentChanged: (newContent: string | null | undefined) => Promise<string>
      onload: () => Promise<itemType[]>
      onItemCategorySelected: (category: string) => Promise<string[]>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./dev_files/Item_categories.json") as itemType[]
let translationFiles = readItemFiles("./dev_files/ItemList.json")

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

//handles the "onContentChanged" event from ipc
ipcMain.handle("onContentChanged", async (event, newContent) => {
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
  console.log(category);
  let correctCategory = ItemFiles.find((value) => {
    if (value.name == category) return true
    else return false
  })
  let TranslatedItems = correctCategory?.items.forEach((item) => {
    let translatedItem = translationFiles.find((value: any) => {
      if (value.LocalizationNameVariable == item) return true
      else return false
    })
    return translatedItem.LocalizedNames.ENUS
  })
})