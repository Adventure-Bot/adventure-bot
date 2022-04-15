import { monstersByName } from '@adventure-bot/game/monster'

export function monsterList(): string {
  return monstersByName
    .map(([name], i) => `\`${(i + 1).toString().padStart(3)}\` ${name}`)
    .join('\n')
}
