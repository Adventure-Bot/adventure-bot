import { Stats } from '@adventure-bot/game/character'
import { EffectId } from '@adventure-bot/game/statusEffects'

export type Trap = Stats & {
  name: string
  image: string
  attackText: string
  onHitEffect?: EffectId
  hitText: string
  missText: string
}
