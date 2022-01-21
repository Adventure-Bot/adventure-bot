import { User } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { QuestId } from '@adventure-bot/quest/quests'
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
