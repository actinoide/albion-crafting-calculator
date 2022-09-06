const tier_equiv = document.getElementById("tier-equiv") as HTMLSelectElement
const Item_categories = document.getElementById("category") as HTMLSelectElement
const Items = document.getElementById("Items")as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()


if (!tier_equiv) {
  console.log("tier-equiv not found")
} else {
  tier_equiv.addEventListener("input", async () => {
    await window.electronAPI.onContentChanged(tier_equiv.value)
  })
}


item_categories_from_main.then((value) => {
  value.forEach((type) => {
    let element = document.createElement("option")
    type.name = type.name.replace("_", " ")
    element.value = type.name
    element.text = type.name
    Item_categories.add(element)
  })
})

Item_categories.addEventListener("input",async ()=>{
  let items = await window.electronAPI.onItemCategorySelected(Item_categories.value)
  if(!items)return
  items.forEach((value)=>{
    let element = document.createElement("option")
    element.value = value
    element.text = value
    Items.add(element)
  })
})


interface itemType {
  name: string
  items: {
    name:string,
    translatedName:string
  }[]
}