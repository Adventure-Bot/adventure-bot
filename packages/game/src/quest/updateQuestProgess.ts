import { User } from 'discord.js'

import { Character, getUserCharacter } from '@adventure-bot/character'
import { QuestId } from '@adventure-bot/quest'
import store from '@adventure-bot/store'
import { questProgressed } from '@adventure-bot/store/slices/characters'

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
