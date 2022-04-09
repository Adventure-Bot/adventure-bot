import { Character } from '@adventure-bot/game/character'

export const defaultCharacter: Omit<Character, 'id' | 'name'> = {
  profile: '',
  inventory: [],
  gold: 0,
  hp: 10,
  maxHP: 10,
  ac: 10,
  haste: 0,
  attackBonus: 1,
  damageBonus: 0,
  monsterDamageMax: 0,
  dragonSlaying: 0,
  equipment: {},
  cooldowns: {},
  statusEffects: [],
  quests: {},
  xp: 0,
  xpValue: 10,
  damageMax: 4,
}
