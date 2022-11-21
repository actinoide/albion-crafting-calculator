import { craftingrequirement } from "./craftingrequirement";
import { translatedRessource } from "./translatedRessource";


export interface item {
  name: string;
  translatedName: string;
  craftingrequirements: craftingrequirement[];
  enchantments: {
    enchantment: {
      enchantmentlevel: number;
      craftingrequirements: {
        silver: number;
        craftingfocus: number;
        craftressource: translatedRessource[];
      };
    }[];
  };
}
