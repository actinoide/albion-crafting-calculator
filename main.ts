import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { makeApiCall } from "./apiCalls"
import { readItemFiles } from "./readItemFiles"

let winid = 0

declare global {
  interface Window {
    electronAPI: {
      onContentChanged: (newContent: string | null | undefined) => Promise<string>
    }
  }
}

const CreateWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })
  win.webContents.openDevTools()//!!!!
  winid = win.id
  win.loadFile('index.html')
}


app.whenReady().then(() => {
  CreateWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) CreateWindow()
  })
})


ipcMain.handle("onContentChanged", async (event, newContent) => {
  let itemData = readItemFiles()
  console.log(itemData)
})

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})