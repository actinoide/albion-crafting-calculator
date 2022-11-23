const Item_categories = document.getElementById("category") as HTMLSelectElement
const Items = document.getElementById("Items") as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()
const findbtn = document.getElementById("findbtn") as HTMLButtonElement
const enchantmentequiv = document.getElementById("enchantment-equiv") as HTMLSelectElement
const container = document.getElementById("container") as HTMLDivElement
let CalculatePrizeButton = document.getElementById("CalculatePrizeButton")

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

findbtn.addEventListener("click", (ev: MouseEvent) => {
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
        value2.forEach(value3 => {
          let element3 = document.createElement("div")
          element3.innerText = value3.count + "x " + value3.translatedName
          element3.id = "name"
          element3.ariaValueText = value3.name
          element3.className = "subItem"
          let element2 = document.createElement("input")
          element2.inputMode = "number"
          element2.id = "cost" + value3.count
          element2.className = "subBox"
          element.appendChild(element3)
          element.appendChild(element2)
        })
        container.appendChild(element)
        index++
      })
    })
    if (CalculatePrizeButton) {
      CalculatePrizeButton.hidden = false
    }
  })
})

CalculatePrizeButton?.addEventListener("click", (ev: MouseEvent) => {
  let index = 0
  let costs: { cost: number, tier: string }[] = []
  while (index < container.children.length) {
    let child = container.children.item(index)
    if (!child) throw Error("this shouldnt happen(child doesnt exist)")
    let index2 = 0
    let cost = 0
    while (index2 < child.children.length) {
      let subChild = child.children.item(index2) as HTMLInputElement
      if (subChild?.id.startsWith("cost")) {
        try {
          cost += (subChild.value as unknown as number) * (subChild.id.replace("cost", "") as unknown as number)
        }
        catch { }
      }
      index2++
    }
    let tierObject = child.children.item(0)
    let tierString = ""
    if (tierObject?.ariaValueText) {
      let tierText = tierObject.ariaValueText.charAt(tierObject.ariaValueText.length - 1)
      if (!(tierText == "1" || tierText == "2" || tierText == "3")) {
        tierText = "0"
      }
      tierString = tierObject.ariaValueText.substring(0, 2) + "." + tierText
    } else {
      tierString = "??.?"
    }
    costs.push({ cost, tier: tierString })
    index++
  }
  console.log(costs);
})