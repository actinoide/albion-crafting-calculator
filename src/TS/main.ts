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
      onItemCategorySelected: (category: string) => Promise<itemType>
      onCalculateBtnClick: (tierequiv: number, category: string, item: string) => Promise<void>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./dev_files/Item_categories.json") as itemType[]

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

ipcMain.handle('onCalculateBtnClick', (event, tierequiv: number, category: string, item: string) => {
  let translatedName: string = ""
  ItemFiles.find((element) => {
    element.items.forEach((element2) => {
      if (element2.name == item) {
        translatedName = element2.translatedName
      }
    })
  })
  console.log('tierequiv:' + tierequiv + "  category:" + category + "  item" + item + "   " + translatedName)

  if ((tierequiv - 3) >= 4) {

  }
  if ((tierequiv - 2) >= 4 && (tierequiv - 2) <= 8) {

  }
  if ((tierequiv - 1) >= 4 && (tierequiv - 1) <= 8) {

  }
  if (tierequiv >= 4 && tierequiv <= 8) {

  }
  if (tierequiv < 4) {

  }
})