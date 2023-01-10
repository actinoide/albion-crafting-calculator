import { calculateNeededRessources } from "./calculateNeededRessources";
import { item } from "./structs/item";
import { itemType } from "./structs/itemType";
import { translatedRessource } from "./structs/translatedRessource";

/**
 * @param TranslationFiles should be the .json parsed ItemList file.
 * @returns alternative ways to craft items with the same itempower.
 */
export const calculateAlternative = (item: item, category: itemType, enchantment: number, TranslationFiles: any) => {
  let results: { translatedRessources: translatedRessource[][], completeItem: item }[] = []
  if (item.name.startsWith("T4")) {
    calculateEnchantments(4, enchantment, item, category, results, TranslationFiles)
  }
  else if (item.name.startsWith("T5")) {
    calculateEnchantments(5, enchantment, item, category, results, TranslationFiles)
  }
  else if (item.name.startsWith("T6")) {
    calculateEnchantments(6, enchantment, item, category, results, TranslationFiles)
  }
  else if (item.name.startsWith("T7")) {
    calculateEnchantments(7, enchantment, item, category, results, TranslationFiles)
  }
  else if (item.name.startsWith("T8")) {
    calculateEnchantments(8, enchantment, item, category, results, TranslationFiles)
  }
  results.push(calculateNeededRessources(enchantment, item, TranslationFiles))
  return results
}

const calculateEnchantments = (tier: number, enchantment: number, item: item, category: itemType, results: { translatedRessources: translatedRessource[][], completeItem: item }[], TranslationFiles: any) => {
  let index = 1
  let tier2 = tier
  let enchantment2 = enchantment
  tier++
  enchantment--
  while (enchantment >= 0 && tier <= 8) {
    results.push(calculateNeededRessources(enchantment, category.items.at(category.items.indexOf(item) + index), TranslationFiles))
    enchantment--
    tier++
    index++
  }
  tier2--
  enchantment2++
  let index2 = 1
  while (enchantment2 <= 4 && tier2 >= 4) {
    results.push(calculateNeededRessources(enchantment2, category.items.at(category.items.indexOf(item) - index2), TranslationFiles))
    enchantment2++
    tier2--
    index2++
  }
}