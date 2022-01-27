import { User } from 'discord.js'

import { Character, getUserCharacter } from '@adventure-bot/game/character'
import { QuestId } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

export const updateUserQuestProgess = (
  user: User,
  questId: QuestId,
  change: number
): Character => {
  store.dispatch(
    questProgressed({
      characterId: user.id,
      questId,
      amount: change,
    })
  )

  return getUserCharacter(user)
}
