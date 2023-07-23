import { Stat } from '@adventure-bot/game/character'
import { getClient } from '@adventure-bot/game/index'

type Emojis =
  | Stat
  | 'crown'
  | 'xp'
  | 'gold'
  | 'damage'
  | 'heal'
  | 'attack'
  | 'crit'
  | 'hit'
  | 'miss'
  | 'run'
  | 'adventure'
  | 'renew'
  | 'stunned'

const defaultEmojis: {
  [k in Emojis]: string
} = {
  ac: '🛡',
  adventure: '🚶‍♀️',
  attack: '⚔',
  attackBonus: '⚔',
  cleansing: '✨',
  crit: '💥💥💥',
  crown: '👑',
  damage: '💔',
  damageBonus: '💔',
  damageMax: '💔',
  dragonSlaying: '🐲',
  gold: '💰',
  haste: '⏳',
  heal: '🤍',
  hit: '💥',
  lockpicking: '🔓',
  luck: '🍀',
  maxHP: '♥',
  miss: '🛡',
  monsterDamageMax: '👹',
  perception: '🔍',
  pickpocket: '👛',
  renew: '🤍',
  revenge: '☠',
  run: '🏃‍♀️',
  stunned: '😵‍💫',
  xp: '🧠',
}

export function Emoji(name: Emojis): string {
  return `${
    getClient()?.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name]
  }`
}

export function EmojiValue(name: Emojis, value: number): string {
  return `${Emoji(name)} ${value}`
}

export function EmojiModifier(name: Emojis, value: number): string {
  return `${value >= 0 ? '+' : ''}${value} ${Emoji(name)}`
}

export function d20Emoji(n: number): string {
  const emojiName = `d20_${n.toString().padStart(2, '0')}`
  const emoji = getClient()?.emojis.cache.find(
    (emoji) => emoji.name === emojiName
  )
  return `${emoji ?? `${n}`}`
}
