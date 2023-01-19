import { readFileSync } from "original-fs"

/**
 * @returns a .json parsed version of the file at the specified url
 * @throws error if file could not be read or parsed
 */
export const readItemFiles = (file: string): any => {
  let itemData: any
  try {
    itemData = JSON.parse(readFileSync(file, "utf8"))
  }
  catch {
    throw new Error("Failed to read or parse file, filepath:"+ file)
  }
  return itemData
}