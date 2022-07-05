import { Character } from '@adventure-bot/game/character'
import { EffectId } from '@adventure-bot/game/statusEffects'

export type Trap = Character & {
  attackText: string
  onHitEffect?: EffectId
  hitText: string
  missText: string
}
