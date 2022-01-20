import { TemplateEffect } from './TemplateEffect'

export const frailty: TemplateEffect = {
  name: 'Frailty',
  buff: false,
  debuff: true,
  duration: 60 * 60000,
  modifiers: {
    ac: -3,
    maxHP: -3,
  },
}
