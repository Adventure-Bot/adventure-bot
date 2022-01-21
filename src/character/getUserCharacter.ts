import { User } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { createCharacter } from '@adventure-bot/character/createCharacter'
import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'

export const getUserCharacter = (user: User): Character =>
  selectCharacterById(store.getState(), user.id) ??
  createCharacter({
    id: user.id,
    name: user.username,
    profile: user.avatarURL() ?? undefined,
  })
