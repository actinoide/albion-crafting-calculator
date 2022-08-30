import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { makeApiCall } from "./apiCalls"
import { readItemFiles } from "./readItemFiles"

let winid = 0
//declaring global for autocomplete with ipc
declare global {
  interface Window {
    electronAPI: {
      onContentChanged: (newContent: string | null | undefined) => Promise<string>
    }
  }
}
// creates the window used by the process
const CreateWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, '/preload.js')
    }
  })
  win.webContents.openDevTools()//!!!!
  winid = win.id
  win.loadFile('./src/html_css/index.html')
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
  let itemData = readItemFiles()
  console.log(itemData)
})

//closes the program when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})