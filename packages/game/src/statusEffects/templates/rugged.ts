import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const rugged: EffectTemplate = {
  name: 'Rugged',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'traveled far and wide!',
  announcementColor: Colors.Green,
  modifiers: {
    perception: 2,
    maxHP: 5,
  },
} as const

rugged.announcementColor = Colors.Green

rugged.announcementColor
