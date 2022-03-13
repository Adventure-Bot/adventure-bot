import { playerAttack } from '@adventure-bot/game/attack'

export const damageDescriptor = (
  result: ReturnType<typeof playerAttack>
): string => {
  if (!result) return `No result`

  if (result.outcome === 'cooldown' || result.outcome === 'miss') return ''

  const damage = result.damage
  switch (true) {
    case damage > 5:
      return 'with a devastating blow!'
    case damage > 2:
      return 'with a solid strike.'
    default:
      return 'with a weak hit.'
  }
}
