import { TemplateEffect } from '@adventure-bot/statusEffects'

export const slayer: TemplateEffect = {
  name: 'Slayer',
  buff: true,
  debuff: false,
  modifiers: {
    monsterDamageMax: 3,
  },
  duration: 30 * 60000,
}
