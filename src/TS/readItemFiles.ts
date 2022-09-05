import { readFileSync } from "original-fs"

export const readItemFiles = (): ItemType[] => {
    let itemData:ItemType[]
    try {
        itemData = JSON.parse(readFileSync("./dev_files/Item_categories.json").toString()) as ItemType[]
    }
    catch {
        throw new Error("failed to load and parse item file.")
    }
    return itemData
}

interface ItemType {
    name: string
    items: string[]
  }