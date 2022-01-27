import { clamp, times } from 'remeda'

import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const hpBar = (c: Character, adjustment = 0): string => {
  const barLength = 10
  const character = selectCharacterById(store.getState(), c.id)
  if (!character) return ''

  const { maxHP } = character.statsModified
  const { hp } = character
  const fullPercent = hp / maxHP
  const adjustPercent = adjustment / maxHP
  const healPercent = clamp(adjustPercent, { max: 1, min: 0 })
  const damagePercent = clamp(-adjustPercent, { max: 1, min: 0 })

  const damage = clamp(Math.floor(damagePercent * barLength), {
    max: maxHP,
    min: 0,
  })

  const heal = clamp(Math.floor(healPercent * barLength), {
    max: maxHP,
    min: 0,
  })

  const full = Math.ceil((fullPercent - healPercent) * barLength)

  const empty = clamp(barLength - full - damage - heal, {
    max: maxHP,
    min: 0,
  })
  if (full < 0) return `bug: full ${full}`
  if (damage < 0) return `bug: damage ${damage}`
  if (heal < 0) return `bug: heal ${heal}`
  if (empty < 0) return `bug: empty ${empty}`
  try {
    return (
      repeat('💚', full) +
      repeat('💔', damage) +
      repeat('🤍', heal) +
      repeat('🖤', empty)
    )
  } catch (e) {
    console.error('hp bar failed', e)
    return `hp bar failed ${e}`
  }
}

const repeat = (str: string, num: number) => times(num, () => str).join('')
