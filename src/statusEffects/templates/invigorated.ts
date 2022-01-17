import { TemplateEffect } from "./TemplateEffect";

export const invigorated: TemplateEffect = {
  name: "Invigorated",
  buff: true,
  debuff: false,
  duration: 30 * 60000,
  modifiers: {
    maxHP: 2,
  },
};
