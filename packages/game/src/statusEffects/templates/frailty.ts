import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const frailty: EffectTemplate = {
  name: 'Frailty',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    ac: -3,
    maxHP: -3,
  },
  announcement: 'became frail!',
  announcementColor: Colors.LightGrey,
}
