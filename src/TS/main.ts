import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { makeApiCall } from "./apiCalls"
import { readItemFiles } from "./readItemFiles"
import { itemType } from "./structs/itemType"
import { craftRessource } from "./structs/craftRessource"

//declaring global for autocomplete with ipc
declare global {
  interface Window {
    electronAPI: {
      onContentChanged: (newContent: string | null | undefined) => Promise<string>
      onload: () => Promise<itemType[]>
      onItemCategorySelected: (category: string) => Promise<itemType>
      onCalculateBtnClick: (enchantmentequiv: number, category: string, item: string) => Promise<void>
    }
  }
}

let winid = 0
let win: BrowserWindow
let ItemFiles = readItemFiles("./dev_files/Item_categories.json") as itemType[]
let TranslationFiles = readItemFiles("./dev_files/ItemList.json")

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

ipcMain.handle('onCalculateBtnClick', (event, enchantmentequiv: number, category: string, item: string) => {
  //looks up category and item based on their names
  category = category.replace(" ", "_")
  let completeCategory = ItemFiles.find((testitem) => {
    if (testitem.name == category) return true
    else return false
  })
  let completeItem = completeCategory?.items.find((testitem) => {
    if (testitem.name == item) return true
    else return false
  })
  console.log('tierequiv:' + enchantmentequiv + "  category:" + category + "  item" + item + "   " + completeItem?.translatedName)
  //if item shouldnt be enchanted or can't be enchanted 
  if (!completeItem?.enchantments || enchantmentequiv == 0 || completeItem?.enchantments.enchantment.length == 0) {
    console.log("enchantmentequiv is zero or item can not be enchanted");
    console.log(completeItem?.enchantments);
    let neededRessources: craftRessource[] = []
    console.log(completeItem);
    if (!completeCategory) console.log("complete category doesnt exist");
    if (!completeItem) console.log("complete item doesnt exist");
    console.log(completeItem?.craftingrequirements.craftresource);
    if(completeItem?.craftingrequirements.craftresource.length == 1){
      let element = completeItem.craftingrequirements.craftresource.pop()
      if(!element)return
      console.log(element.uniquename + element.count);
      neededRessources.push({
        name: element.uniquename, count: element.count, translatedName: TranslationFiles.find((element2: any) => {
        //@ts-ignore
          if (element2.uniqueName == element.uniquename) {
          //@ts-ignore
            console.log("log succesfull  " + element.uniquename);
            return true
          }
          else return false
        }).LocalizedNames.ENUS
      })
    }
    else {
      completeItem?.craftingrequirements.craftresource.forEach(element => {
      console.log(element.uniquename + element.count);
      neededRessources.push({
        name: element.uniquename, count: element.count, translatedName: TranslationFiles.find((element2: any) => {
          if (element2.uniqueName == element.uniquename) {
            console.log("log succesfull  " + element.uniquename);
            return true
          }
          else return false
        }).LocalizedNames.ENUS
      })
    })};
    console.log(neededRessources);
  }
})