import { Manifest } from '@adventure-bot/game/asset-manifest'
import { StatModifier } from '@adventure-bot/game/statusEffects'

export type Item = {
  id: string
  type:
    | 'weapon'
    | 'armor'
    | 'shield'
    | 'hat'
    | 'amulet'
    | 'ring'
    | 'potion'
    | 'scroll'
    | 'misc'
  name: string
  description: string
  goldValue: number
  modifiers?: StatModifier
  equippable: boolean
  lootable?: boolean
  sellable?: boolean
  tradeable?: boolean
  usable?: boolean
  asset?: Manifest['fantasy']['items']
}
