import { isAnyOf } from '@reduxjs/toolkit'
import { Guild } from 'discord.js'
import { debounce } from 'ts-debounce'

import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  cleansed,
  cooldownStarted,
  created,
  damaged,
  divineBlessingGranted,
  effectAdded,
  goldGained,
  goldSet,
  healed,
  healthSet,
  itemEquipped,
  itemGiven,
  itemRemoved,
  itemSold,
  profileSet,
  questCompleted,
  questGranted,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'

import { listCharacters } from './listCharacters'

export function renderCharacterList({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): void {
  listCharacters({ guild, appId })
  const debouncedUpdateCharacterList = debounce(listCharacters, 1000)

  startAppListening({
    matcher: isAnyOf(
      created,
      questProgressed,
      cleansed,
      cooldownStarted,
      damaged,
      effectAdded,
      goldGained,
      goldSet,
      divineBlessingGranted,
      questGranted,
      healed,
      healthSet,
      itemEquipped,
      itemGiven,
      itemRemoved,
      itemSold,
      profileSet,
      questCompleted,
      xpAwarded
    ),
    effect: () => {
      debouncedUpdateCharacterList({ guild, appId })
    },
  })
}
