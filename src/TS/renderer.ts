const Item_categories = document.getElementById("category") as HTMLSelectElement
const Items = document.getElementById("Items") as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()
const Calculatebtn = document.getElementById("Calculatebtn") as HTMLButtonElement
const enchantmentequiv = document.getElementById("enchantment-equiv") as HTMLSelectElement
const container = document.getElementById("container") as HTMLDivElement

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
  let result = window.electronAPI.onCalculateBtnClick(enchantmentequiv.value as unknown as number, Item_categories.value, Items.value)
  result.then((value) => {
    while (container.children.length > 0) {
      if (container.firstChild == undefined) continue
      container.removeChild(container.firstChild)
    }
    let index: number = 1
    value.forEach((value_1) => {
      value_1.forEach(value2 => {
        let element = document.createElement("div")
        element.className = "subWide"
        element.innerText = index + ". option:"
        element.id = "spacer"
        container.appendChild(element)
        value2.forEach(value3 => {
          let element = document.createElement("div")
          element.innerText = value3.count + "x " + value3.translatedName
          element.id = "name"
          element.ariaValueText = value3.name
          element.className = "subItem"
          let element2 = document.createElement("input")
          element2.inputMode = "number"
          element2.id = "cost"
          element2.className = "subBox"
          container.appendChild(element)
          container.appendChild(element2)
        })
        index++
      })
      let element = document.createElement("button")
      element.textContent = "Calculate"
      element.id = "CalculatePrizeButton"
      container.appendChild(element)
    })
  })
})
let CalculatePrizeButton = document.getElementById("CalculatePrizeButton")