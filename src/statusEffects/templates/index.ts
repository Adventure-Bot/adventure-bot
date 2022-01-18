import { aggression } from "./aggression";
import { frailty } from "./frailty";
import { invigorated } from "./invigorated";
import { might } from "./might";
import { protectedEffect } from "./protectedEffect";
import { slayer } from "./slayer";

export const effects = {
  invigorated,
  frailty,
  slayer,
  aggression,
  protectedEffect,
  might,
} as const;

export type EffectTemplate = keyof typeof effects;

export default { ...effects };
