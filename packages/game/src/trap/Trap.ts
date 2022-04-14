import { Stats } from '@adventure-bot/game/character'
import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export type Trap = Stats & {
  name: string
  image: string
  attackText: string
  onHitEffect?: EffectTemplate
  hitText: string
  missText: string
}
