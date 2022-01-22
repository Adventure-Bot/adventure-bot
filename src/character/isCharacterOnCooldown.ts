import { Character } from '@adventure-bot/character'
import { getCooldownRemaining } from '@adventure-bot/character'

export const isCharacterOnCooldown = (
  characterId: string,
  type: keyof Character['cooldowns']
): boolean =>
  process.env.COOLDOWNS_DISABLED === 'true'
    ? false
    : (getCooldownRemaining(characterId, type) ?? 0) > 0
