import { Interaction } from 'discord.js'
import { Stat } from '@adventure-bot/character/Stats'

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

/**
 * Use a guild's emojis, or fallback to defaults
 */
export function Emoji(interaction: Interaction, name: Emojis): string {
  return `${
    interaction.guild?.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name]
  }`
}

export function d20Emoji({
  interaction,
  n,
}: {
  interaction: Interaction
  n: number
}): string {
  const name = `d20_${n.toString().padStart(2, '0')}`
  const emoji = interaction.guild?.emojis.cache.find(
    (emoji) => emoji.name === name
  )
  return `${emoji ?? `${n}`}`
}
