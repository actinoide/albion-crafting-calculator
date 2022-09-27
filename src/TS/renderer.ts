const Item_categories = document.getElementById("category") as HTMLSelectElement
const Items = document.getElementById("Items") as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()
const Calculatebtn = document.getElementById("Calculatebtn") as HTMLButtonElement
const enchantmentequiv = document.getElementById("enchantment-equiv") as HTMLSelectElement

item_categories_from_main.then((value) => {
  value.forEach((type) => {
    let element = document.createElement("option")
    type.name = type.name.replace("_", " ")
    element.value = type.name
    element.text = type.name
    Item_categories.add(element)
  })
})

Item_categories.addEventListener("input", async () => {
  while (Items.length > 0) {
    Items.remove(0)
  }
  let items = await window.electronAPI.onItemCategorySelected(Item_categories.value)
  if (!items) return
  items.items.forEach((value) => {
    let element = document.createElement("option")
    element.value = value.name
    element.text = value.translatedName
    Items.add(element)
  })
})

Calculatebtn.addEventListener("click", (ev: MouseEvent) => {
  window.electronAPI.onCalculateBtnClick(enchantmentequiv.value as unknown as number, Item_categories.value, Items.value)
})