import { randomUUID } from "crypto";
import { randomArrayElement } from "../../monster/randomArrayElement";
import { Potion } from "../equipment";

export const unidentifiedPotion = (): Potion => ({
  id: randomUUID(),
  type: "potion",
  description: randomArrayElement([
    "You have no idea who made this, where it came from, or what's in it.",
    "It smells awful. But they usually do.",
    "You're pretty sure the toe is part of it.",
  ]),
  goldValue: 20,
  name: randomArrayElement([
    "unidentified potion",
    "potion of dubious origins",
    "Healing Potion?",
  ]),
  useEffects: {
    randomEffect: ["aggression", "invigorated", "protectedEffect", "slayer"],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
});
