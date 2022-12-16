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
const usingFocus = document.getElementById("usingFocus") as HTMLSelectElement

//waits for the needed information from main and initializes the ui.
item_categories_from_main.then((value) => {
  value.forEach((type) => {
    let element = document.createElement("option")
    type.name = type.name.replace("_", " ")
    element.value = type.name
    element.text = type.name
    Item_categories.add(element)
  })
})

//when a category is selected the contained items are requested from main.
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

//finds the crafting options for the selected item and displays them.
findbtn.addEventListener("click", (ev: MouseEvent) => {
  let result = window.electronAPI.onCalculateBtnClick(enchantmentequiv.value as unknown as number, Item_categories.value, Items.value)
  result.then((value) => {
    //empties container before new items are added.
    while (container.children.length > 0) {
      if (container.firstChild == undefined) continue
      container.removeChild(container.firstChild)
    }
    //iterates through the results and creates needed elements.
    let index: number = 1
    value.forEach((value1) => {
      value1.forEach(value2 => {
        let spacer = document.createElement("div")
        spacer.className = "subWide"
        spacer.innerText = index + ". option:"
        spacer.id = "spacer"
        value2.forEach(value3 => {
          let textElement = document.createElement("div")
          textElement.innerText = value3.count + "x " + value3.translatedName
          textElement.id = "name"
          textElement.ariaValueText = value3.name
          textElement.className = "subItem"
          let inputElement = document.createElement("input")
          inputElement.type = "number"
          inputElement.ariaValueText = value3.name
          if (value3.name.includes("ARTEFACT_TOKEN_FAVOR_")) {
            inputElement.id = "repeat" + value3.count
          } else {
            inputElement.id = "cost" + value3.count
          }
          inputElement.className = "subBox"
          spacer.appendChild(textElement)
          spacer.appendChild(inputElement)
        })
        container.appendChild(spacer)
        index++
      })
    })
    //shows precoded objects that could be hidden before.
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

//calculates the costs of the currently shown items and displays them.
CalculatePrizeButton?.addEventListener("click", async (ev: MouseEvent) => {
  let index = 0
  let costs: { cost: number, tier: string }[] = []
  let localProductionBonus: number = 0
  localProductionBonus += craftingLocation.value as unknown as number * 1
  localProductionBonus += usingFocus.value as unknown as number * 1
  localProductionBonus += bonusEvent.value as unknown as number * 1
  //iterates through the items.
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
    //iterates through ressources needed for each item.
    while (index2 < child.children.length) {
      let subChild = child.children.item(index2) as HTMLInputElement
      if (subChild?.id.startsWith("cost")) {
        cost += await window.electronAPI.calculatePrize(subChild.value as unknown as number, subChild.id.replace("cost", "") as unknown as number, subChild.ariaValueText, nutritionCost.value as unknown as number, localProductionBonus)
      }
      if (subChild.id.startsWith("repeat")) {
        let oldChild = container.children.item(index - 1)?.children.item(index2) as HTMLInputElement
        cost += await window.electronAPI.calculatePrize(subChild.value as unknown as number, subChild.id.replace("repeat", "") as unknown as number, oldChild.ariaValueText, nutritionCost.value as unknown as number, localProductionBonus)
      }
      index2++
    }
    costs.push({ cost, tier: tierString })
    index++
  }
  //empties outContainer.
  while (0 < outContainer.children.length) {
    if (outContainer.firstChild) {
      outContainer.removeChild(outContainer.firstChild)
    }
  }
  //displays the calculated costs.
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