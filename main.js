"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const readItemFiles_1 = require("./readItemFiles");
let winid = 0;
const CreateWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js')
        }
    });
    win.webContents.openDevTools(); //!!!!
    winid = win.id;
    win.loadFile('index.html');
};
electron_1.app.whenReady().then(() => {
    CreateWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            CreateWindow();
    });
});
electron_1.ipcMain.handle("onContentChanged", (event, newContent) => __awaiter(void 0, void 0, void 0, function* () {
    let itemData = (0, readItemFiles_1.readItemFiles)();
    console.log(itemData);
}));
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
