"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readItemFiles = void 0;
const original_fs_1 = require("original-fs");
const readItemFiles = () => {
    let itemData;
    try {
        itemData = JSON.parse((0, original_fs_1.readFileSync)("test.json").toString());
    }
    catch (_a) {
        throw new Error("failed to load and parse item file.");
    }
    return itemData;
};
exports.readItemFiles = readItemFiles;
