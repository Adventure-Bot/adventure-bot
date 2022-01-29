import { Stat } from '@adventure-bot/game/character'

// import { client } from '@adventure-bot/game/index'

type Emojis =
  | Stat
  | 'crown'
  | 'xp'
  | 'gold'
  | 'damage'
  | 'heal'
  | 'attack'
  | 'hit'
  | 'miss'
  | 'run'
  | 'adventure'
  | 'renew'

const defaultEmojis: {
  [k in Emojis]: string
} = {
  crown: '👑',
  xp: '🧠',
  gold: '💰',
  damage: '💔',
  heal: '🤍',
  attack: '⚔',
  ac: '🛡',
  attackBonus: '⚔',
  damageBonus: '💔',
  maxHP: '♥',
  damageMax: '💔',
  monsterDamageMax: '👹',
  hit: '💥',
  miss: '🛡',
  run: '🏃‍♀️',
  adventure: '🚶‍♀️',
  renew: '🤍',
}

export function Emoji(name: Emojis): string {
  return `${
    // client.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name]
  }`
}

export function EmojiValue(name: Emojis, value: number): string {
  return `${Emoji(name)} ${value}`
}

export function EmojiModifier(name: Emojis, value: number): string {
  return ` ${value > 0 ? '+' : ''}${value} ${Emoji(name)}`
}

export function d20Emoji(n: number): string {
  const emojiName = `d20_${n.toString().padStart(2, '0')}`
  const emoji = null //client.emojis.cache.find((emoji) => emoji.name === emojiName)
  return `${emoji ?? `${n}`}`
}
