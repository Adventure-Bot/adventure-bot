import { User } from 'discord.js'
import { Character } from './Character'
import { createCharacter } from './createCharacter'
import store from '../store'
import { selectCharacterById } from '../store/selectors'

export const getUserCharacter = (user: User): Character =>
  selectCharacterById(store.getState(), user.id) ??
  createCharacter({
    id: user.id,
    name: user.username,
    profile: user.avatarURL() ?? undefined,
  })
