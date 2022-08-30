import * as fs from "fs"
import {join} from "path"

let categories: string = "cloth leather plate torch tome shield cape bag gathering_tools gathering_gear potions food arcane frost cursed fire holy spears quarterstaffs nature dagger bow hammers swords crossbow maces axes"

let test = fs.readFileSync(join(__dirname,"../dev_files/ItemList.json"))
let test2 = test.toString()
let test3 = JSON.parse(test2)

