import { Stats } from '@adventure-bot/game/character'
import {
  Amulet,
  Armor,
  Hat,
  Item,
  Ring,
  Shield,
  Weapon,
} from '@adventure-bot/game/equipment'
import { Quest, QuestId } from '@adventure-bot/game/quest'

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
  quests: {
    [id in QuestId]?: Quest
  }

  xp: number
  gold: number
  xpValue: number
  isMonster?: boolean
  revengeText?: string
}
