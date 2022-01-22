import { Stats } from '@adventure-bot/character'
import { Item } from '@adventure-bot/equipment/Item'
import {
  Amulet,
  Armor,
  Hat,
  Ring,
  Shield,
  Weapon,
} from '@adventure-bot/equipment/equipment'
import { Quest } from '@adventure-bot/quest/Quest'
import { QuestId } from '@adventure-bot/quest/quests'
import { StatusEffect } from '@adventure-bot/statusEffects/StatusEffect'

export type Character = Stats & {
  id: string
  name: string
  profile: string
  asset?: [string, string, string]
  hp: number

  inventory: Item[]
  equipment: {
    weapon?: Weapon
    armor?: Armor
    shield?: Shield
    hat?: Hat
    amulet?: Amulet
    ring?: Ring
  }

  cooldowns: {
    attack?: string
    adventure?: string
    heal?: string
    renew?: string
  }
  statusEffects: StatusEffect[]
  quests: {
    [id in QuestId]?: Quest
  }

  xp: number
  gold: number
  xpValue: number
  isMonster?: boolean
}
