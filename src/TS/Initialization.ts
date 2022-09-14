import * as fs from "fs"
import { join } from "path"

//THIS FILE IS NOT FOR GENERIC USE AND SHOULD NOT BE DISTRIBUTED IN THE FINISHED PRODUCT.
// IT IS USED TO GENERATE .json FILES WHIC WILL BE SHIPED.
// THIS FILE IS A MESS 

let Items = JSON.parse(fs.readFileSync(join(__dirname, "../dev_files/Items.json"), "utf8"))
let TranslatedItems = JSON.parse(fs.readFileSync(join(__dirname, "../dev_files/ItemList.json"), "utf8"))

Items.items.consumableitem
Items.items.equipmentitem
Items.items.weapon
Items.items.mount

let craftableitems: any[] = []

let getcraftableitems = (itemcategory: any) => {
  itemcategory.forEach((consumable: any) => {
    if (!craftableitems) {
      craftableitemcategories = consumable
    } else {
      craftableitems.push(consumable);
    }
  });
}
getcraftableitems(Items.items.equipmentitem)
getcraftableitems(Items.items.weapon)
getcraftableitems(Items.items.consumableitem)
getcraftableitems(Items.items.mount)

let craftableitemcategories: string[] = []

craftableitems.forEach(element => {
  if(element.shopsubcategory1.includes("unique"))return
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

interface sorteditemtype {
  name: string
  items: {
    name: string,
    translatedName: string
    craftingrequirements:{
      silver:number,
      craftingfocus:number,
      craftresource:{
        uniquename:string,
        count:number
      }[]
    }
  }[]
}

let sorteditems: sorteditemtype[]// = [{ "name": "", "items": [] }]

craftableitemcategories.forEach(cat => {
  let temps: {
    name: string,
    translatedName: string
    craftingrequirements:{
      silver:number,
      craftingfocus:number,
      craftresource:{
        uniquename:string,
        count:number
      }[]
    }
  }[] = []
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
      temps.push({ name: Item.uniquename, translatedName: translatedname.LocalizedNames.ENUS, craftingrequirements:Item.craftingrequirements})
    }
  });
  if (!sorteditems) {
    sorteditems = [{ "name": cat, "items": temps }]
  } else {
    sorteditems.push({ "name": cat, "items": temps })
  }
  temps = []
});
//@ts-ignore
fs.writeFileSync(join(__dirname, "../dev_files/Item_categories.json"), JSON.stringify(sorteditems))