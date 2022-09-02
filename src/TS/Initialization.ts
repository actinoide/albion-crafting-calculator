import * as fs from "fs"
import { join } from "path"

let categories: string = "cloth leather plate torch tome shield cape bag gathering_tools gathering_gear potions food arcane frost cursed fire holy spears quarterstaffs nature dagger bow hammers swords crossbow maces axes knuckles demolition_hammers"

let split: string[] = categories.split(" ")
let output: string = "["

split.forEach((value, index, array) => {
    output = output.concat("{\"name\":\"" + value + "\"}")
    if ((index + 1) < array.length) {
        output = output.concat(",")
    }
})

output = output.concat("]")

fs.writeFileSync(join(__dirname, "../dev_files/Item_categories.json"), output)


let json = fs.readFileSync(join(__dirname, "../dev_files/Items.json"), "utf8")
let json2 = JSON.parse(json)
