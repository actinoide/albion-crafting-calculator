import { LoginItemSettings } from "electron"
import { translatedRessource } from "./structs/translatedRessource"
import { itemType } from "./structs/itemType"
import { item } from "./structs/item"
import { craftingrequirement } from "./structs/craftingrequirement"
import { craftResource } from "./structs/craftResource"

export let calculateNeededRessources = (enchantmentequiv: number, completeItem: item | undefined, TranslationFiles: any) => {
  let neededRessources: translatedRessource[][] = []
  if (!completeItem) throw Error("Item in calculateNeededRessources doesnt exist")
  console.log(enchantmentequiv);
  if (!completeItem?.enchantments || enchantmentequiv == 0 || completeItem?.enchantments.enchantment.length == 0) {
    //calculate without enchantments
    calculateCraftingRequierments(TranslationFiles, completeItem.craftingrequirements, neededRessources)
  }
  else {
    //calculate with enchantments
    let enchantment = completeItem.enchantments.enchantment.find((value) => {
      if (value.enchantmentlevel == enchantmentequiv) return true
      else return false
    })
    if (!enchantment) {
      throw Error("enchantment not found")
    }
    else {
      calculateCraftingRequierments(TranslationFiles, enchantment.craftingrequirements, neededRessources)
    }
  }
  return neededRessources
}

let calculateCraftingRequierments = (TranslationFiles: any, craftingrequirements: craftingrequirement[] | craftingrequirement, neededRessources: translatedRessource[][]) => {
  if (!Array.isArray(craftingrequirements)) {
    //calculate with one crafting option  
    calculateCraftingRessources(TranslationFiles, craftingrequirements.craftresource, neededRessources)
  }
  else {
    //calculate with multiple crafting options
    craftingrequirements.forEach(element => {
      calculateCraftingRessources(TranslationFiles, element.craftresource, neededRessources)
    });
  }
}

let calculateCraftingRessources = (TranslationFiles: any, craftresource: craftResource | craftResource[], neededRessources: translatedRessource[][]) => {
  if (!Array.isArray(craftresource)) {
    //calculate with one ressource
    writeNeededRessources(TranslationFiles, { uniquename: craftresource.uniquename, count: craftresource.count }, neededRessources)
  }
  else {
    //calculate with multiple ressources
    let ressources: { uniquename: string, count: number }[] = []
    craftresource.forEach(element => {
      ressources.push({ uniquename: element.uniquename, count: element.count })
    })
    writeNeededRessources(TranslationFiles, ressources, neededRessources)
  }
}

let writeNeededRessources = (TranslationFiles: any, element: { uniquename: string, count: number } | { uniquename: string, count: number }[], neededRessources: translatedRessource[][]) => {
  let tempRessources: translatedRessource[] = []
  if (Array.isArray(element)) {
    element.forEach((value) => {
      tempRessources.push(reformatRessources(value, TranslationFiles))
    })
  }
  else {
    tempRessources.push(reformatRessources(element, TranslationFiles))
  }
  neededRessources.push(tempRessources)
}


let reformatRessources = (element: { uniquename: string, count: number }, TranslationFiles: any) => {
  return {
    name: element.uniquename, count: element.count, translatedName: TranslationFiles.find((element2: any) => {
      if (element2.LocalizationNameVariable == "ITEMS_" + element.uniquename) {
        return true
      }
      else return false
    }).LocalizedNames.ENUS
  }
}