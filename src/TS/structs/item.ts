import { craftingrequirement } from "./craftingrequirement";
import { craftResource } from "./craftResource";


export interface item {
  name: string;
  translatedName: string;
  craftingrequirements: craftingrequirement[] | craftingrequirement;
  enchantments: {
    enchantment: {
      enchantmentlevel: number;
      craftingrequirements: craftingrequirement[] | craftingrequirement;
    }[];
  };
}
