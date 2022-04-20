import { describe } from 'mocha'

import { isStatusEffectExpired } from '@adventure-bot/game/statusEffects'
import { createEffect } from '@adventure-bot/game/statusEffects/createEffect'

describe('isStatusEffectExpired', () => {
  it('should return true for just-created effects', () => {
    expect(isStatusEffectExpired(createEffect('aggression'))).toBe(false)
  })
})
