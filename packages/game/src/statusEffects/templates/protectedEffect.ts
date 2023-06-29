import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const protectedEffect: EffectTemplate = {
  name: 'Protected',
  modifiers: {
    ac: 2,
  },
  duration: defaultEffectDuration,
  buff: true,
  debuff: false,
  announcement: 'became protected!',
  announcementColor: Colors.NotQuiteBlack,
}
