import store from '@adventure-bot/game/store'
import { goldGained } from '@adventure-bot/game/store/slices/characters'

export const adjustGold = (characterId: string, amount: number): void => {
  store.dispatch(
    goldGained({
      characterId,
      amount,
    })
  )
}
