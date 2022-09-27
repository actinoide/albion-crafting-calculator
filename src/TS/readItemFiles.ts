import { readFileSync } from "original-fs"

export const readItemFiles = (file: string): any => {
  let itemData: any
  try {
    itemData = JSON.parse(readFileSync(file, "utf8"))
  }
  catch {
    console.log(file + " failed to read or parse")
    //throw new Error("failed to load and parse item file.")
  }
  return itemData
}