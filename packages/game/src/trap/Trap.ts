import { Stats } from '@adventure-bot/game/character'
import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export type Trap = Stats & {
  name: string
  image: string
  description: string
  onHitEffect?: TemplateEffect
}
