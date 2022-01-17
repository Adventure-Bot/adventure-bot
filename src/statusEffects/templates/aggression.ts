import { TemplateEffect } from "./TemplateEffect";

export const aggression: TemplateEffect = {
  name: "Agression",
  buff: true,
  debuff: false,
  modifiers: {
    attackBonus: 2,
  },
  duration: 30 * 60000,
};
