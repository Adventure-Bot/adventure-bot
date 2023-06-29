import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const rogue: EffectTemplate = {
  name: 'Rogue',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a rogue!',
  announcementColor: Colors.DarkButNotBlack,
  modifiers: {
    perception: 2,
    luck: 2,
    lockpicking: 2,
  },
}
