import { craftRessource } from "./craftRessource";

export interface itemType {
  name: string;
  items: {
    name: string;
    translatedName: string;
    craftingrequirements: {
      silver: number;
      craftingfocus: number;
      craftresource: {
        uniquename: string;
        count: number;
      }[];
    };
    enchantments: {
      enchantment: {
        enchantmentlevel: number;
        craftingrequirements: {
          silver: number;
          craftingfocus: number;
          craftressource:craftRessource[]
        };
      }[];
    };
  }[];
}
