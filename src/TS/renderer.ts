const tier_equiv = document.getElementById("tier-equiv") as HTMLSelectElement
if (!tier_equiv) {
  console.log("tier-equiv not found")
} else {
  tier_equiv.addEventListener("input", async () => {
    await window.electronAPI.onContentChanged(tier_equiv.value)
  })
}


const Item_categories = document.getElementById("category") as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()

item_categories_from_main.then((value) => {
  value.forEach((type) => {
    let element = document.createElement("option")
    type.name = type.name.replace("_", " ")
    element.value = type.name
    element.text = type.name
    Item_categories.add(element)
  })
})



interface itemType {
  name: string
  items: string[]
}