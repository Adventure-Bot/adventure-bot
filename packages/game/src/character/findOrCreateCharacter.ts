import { User } from 'discord.js'

import { Character, createCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const findOrCreateCharacter = (user: User): Character =>
  selectCharacterById(store.getState(), user.id) ??
  createCharacter({
    id: user.id,
    name: user.username,
    profile: user.avatarURL() ?? undefined,
  })
