import { ColorResolvable } from 'discord.js'

import { StatusEffect } from '@adventure-bot/game/statusEffects'

export type Shrine = {
  id: string
  name: string
  effect: StatusEffect
  description: string
  image: string
  color: ColorResolvable
}
