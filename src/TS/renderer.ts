const Item_categories = document.getElementById("category") as HTMLSelectElement
const Items = document.getElementById("Items") as HTMLSelectElement
const item_categories_from_main = window.electronAPI.onload()
const findbtn = document.getElementById("findbtn") as HTMLButtonElement
const enchantmentequiv = document.getElementById("enchantment-equiv") as HTMLSelectElement
const container = document.getElementById("container") as HTMLDivElement
const CalculatePrizeButton = document.getElementById("CalculatePrizeButton") as HTMLButtonElement
const outContainer = document.getElementById("outContainer") as HTMLDivElement
const nutritionCost = document.getElementById("nutritionCost") as HTMLInputElement
const extraInputs = document.getElementById("extraInputs") as HTMLDivElement
const bonusEventText = document.getElementById("bonusEventText") as HTMLDivElement
const bonusEvent = document.getElementById("bonusEvent") as HTMLSelectElement
const craftingLocation = document.getElementById("craftingLocation") as HTMLSelectElement

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
          element2.type = "number"
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
    if (extraInputs) {
      extraInputs.hidden = false
      index = 0
      while (index < extraInputs.children.length) {
        let child = extraInputs.children.item(index) as HTMLElement
        child.hidden = false
        index++
      }
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
    let tierObject = child.children.item(0)
    let tierString = ""
    if (tierObject?.ariaValueText) {
      let tierText = tierObject.ariaValueText.charAt(tierObject.ariaValueText.length - 1)
      if (!(tierText == "1" || tierText == "2" || tierText == "3" || tierText == "4")) {
        tierText = "0"
      }
      tierString = tierObject.ariaValueText.substring(0, 2) + "." + tierText
    } else {
      tierString = "??.?"
    }
    while (index2 < child.children.length) {
      let subChild = child.children.item(index2) as HTMLInputElement
      if (subChild?.id.startsWith("cost")) {
        cost += (subChild.value as unknown as number) * (subChild.id.replace("cost", "") as unknown as number)
        //cost += Math.pow(2, ((tierString.charAt(1) as unknown as number) * 1) + ((tierString.charAt(3) as unknown as number) * 1)) * (subChild.id.replace("cost", "") as unknown as number) * 0.1125 * ((nutritionCost.value as unknown as number) / 100)
      }
      index2++
    }
    costs.push({ cost, tier: tierString })
    index++
  }
  while (0 < outContainer.children.length) {
    if (outContainer.firstChild) {
      outContainer.removeChild(outContainer.firstChild)
    }
  }
  costs.forEach((cost) => {
    let tierElement = document.createElement("div")
    tierElement.textContent = cost.tier + ":"
    tierElement.className = "subItem"
    let numberElemenent = document.createElement("div")
    numberElemenent.textContent = cost.cost as unknown as string
    numberElemenent.className = "subBox"
    outContainer.appendChild(tierElement)
    outContainer.appendChild(numberElemenent)
  })
})