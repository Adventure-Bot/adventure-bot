import { randomUUID } from "crypto";
import { Potion } from "../equipment";

export const potionOfHealing = (): Potion => ({
  id: randomUUID(),
  type: "potion",
  description: "This milky vial has glowing globules bubbling inside.",
  goldValue: 20,
  name: "Potion of Healing",
  effects: {
    maxHeal: 6,
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
});
