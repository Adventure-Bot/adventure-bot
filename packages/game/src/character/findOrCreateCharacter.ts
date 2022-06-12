import { User } from 'discord.js'

import { createCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  CharacterWithStats,
  selectCharacterById,
} from '@adventure-bot/game/store/selectors'

export const findOrCreateCharacter = (user: User): CharacterWithStats =>
  selectCharacterById(store.getState(), user.id) ??
  createCharacter({
    id: user.id,
    name: user.username,
    profile: user.avatarURL() ?? undefined,
  })
