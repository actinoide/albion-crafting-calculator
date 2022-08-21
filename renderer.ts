const tier_equiv = document.getElementById("tier-equiv") as HTMLSelectElement
if (!tier_equiv) {
  console.log("tier-equiv not found")
} else {
  tier_equiv.addEventListener("input", async () => {
    await window.electronAPI.onContentChanged(tier_equiv.value)
  })
}