import { Stat } from '@adventure-bot/character'
import { client } from '@adventure-bot/index'

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

export function Emoji(name: Emojis, adjustment?: number): string {
  const adjustmentText = adjustment
    ? `${adjustment > 0 ? '+' : ''}${adjustment}`
    : ''
  return `${adjustmentText}${
    client.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name]
  }`
}

export function d20Emoji(n: number): string {
  const emojiName = `d20_${n.toString().padStart(2, '0')}`
  const emoji = client.emojis.cache.find((emoji) => emoji.name === emojiName)
  return `${emoji ?? `${n}`}`
}
