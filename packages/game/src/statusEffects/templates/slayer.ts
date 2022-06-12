import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'

export const slayer: EffectTemplate = {
  name: 'Slayer',
  buff: true,
  debuff: false,
  modifiers: {
    monsterDamageMax: 3,
  },
  duration: 60 * 60000,
  announcement: 'became a slayer!',
  announcementColor: 'DARK_GREEN',
}
