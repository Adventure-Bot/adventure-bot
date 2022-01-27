import store from '@adventure-bot/store'
import { goldGained } from '@adventure-bot/store/slices/characters'

export const adjustGold = (characterId: string, amount: number): void => {
  store.dispatch(
    goldGained({
      characterId,
      amount,
    })
  )
}
