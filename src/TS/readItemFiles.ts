import { readFileSync } from "original-fs"

export const readItemFiles = (): any => {
    let itemData;
    try {
        itemData = JSON.parse(readFileSync("./dev_files/test.json").toString())
    }
    catch {
        throw new Error("failed to load and parse item file.")
    }
    return itemData
}