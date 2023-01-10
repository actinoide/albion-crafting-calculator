import * as fs from "fs"
import { join } from "path"
import { itemType } from "./structs/itemType"
import { item } from "./structs/item"

// THIS FILE IS NOT FOR GENERIC USE AND SHOULD NOT BE DISTRIBUTED IN THE FINISHED PRODUCT.
// IT IS USED TO GENERATE .json FILES WHICH WILL BE SHIPED.
// THIS FILE IS A MESS 

let Items = JSON.parse(fs.readFileSync(join(__dirname, "../dev_files/Items.json"), "utf8"))
let TranslatedItems = JSON.parse(fs.readFileSync(join(__dirname, "../dev_files/ItemList.json"), "utf8"))

let getcraftableitems = (itemcategory: any, craftableitems: any[]) => {
  itemcategory.forEach((item: any) => {
    if (!craftableitems) {
      craftableitems = item
    } else {
      craftableitems.push(item);
    }
  });
}

let craftableitems: any[] = []
getcraftableitems(Items.items.equipmentitem, craftableitems)
getcraftableitems(Items.items.weapon, craftableitems)
getcraftableitems(Items.items.consumableitem, craftableitems)
getcraftableitems(Items.items.mount, craftableitems)

let craftableitemcategories: string[] = []
craftableitems.forEach(element => {
  if (element.shopsubcategory1.includes("unique")) return
  if (!craftableitemcategories.includes(element.shopsubcategory1)) {
    if (!craftableitemcategories) {
      craftableitemcategories = element.shopsubcategory1
    } else {
      craftableitemcategories.push(element.shopsubcategory1)
    }
  }
});

let shopcats: string[] = [""]
Items.items.shopcategories.shopcategory.forEach((category: any) => {
  if (category.id = "melee" || "magic" || "ranged" || "offhand" || "armor" || "accessories" || "mounts" || "gatherergear" || "tools" || "consumables") {
    category.shopsubcategory.forEach((subcat: any) => {
      if (!shopcats) {
        shopcats = subcat.id
      } else {
        shopcats.push(subcat.id)
      }
    });
  }
});

let sorteditems: itemType[]

craftableitemcategories.forEach(cat => {
  let temps: item[] = []
  craftableitems.forEach(Item => {
    if (Item.uniquename.includes("DEBUG")) return
    if (Item.uniquename.includes("PROTOTYPE")) return
    if (Item.uniquename.includes("VANITY")) return
    if (Item.uniquename.includes("TEST")) return
    if (Item.uniquename.includes("UNIQUE")) return
    let translatedname = TranslatedItems.find((value: any) => {
      if (value.LocalizationNameVariable == ("ITEMS_" + Item.uniquename)) return true
      else return false
    })
    if (Item.shopsubcategory1 === cat) {
      //@ts-ignore
      temps.push({ itemvalue: Item.itemvalue, name: Item.uniquename, translatedName: translatedname.LocalizedNames.ENUS, craftingrequirements: Item.craftingrequirements, enchantments: Item.enchantments })
    }
  });
  if (!sorteditems) {
    //@ts-ignore
    sorteditems = [{ "name": cat, "items": temps }]
  } else {
    //@ts-ignore
    sorteditems.push({ "name": cat, "items": temps })
  }
  temps = []
});
//@ts-ignore
fs.writeFileSync(join(__dirname, "../dev_files/Item_categories.json"), JSON.stringify(sorteditems))