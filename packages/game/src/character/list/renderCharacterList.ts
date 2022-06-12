import { isAnyOf } from '@reduxjs/toolkit'
import { Guild } from 'discord.js'
import { debounce } from 'ts-debounce'

import { newgame } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  cleansed,
  cooldownStarted,
  created,
  damaged,
  divineBlessingGranted,
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
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

import { listCharacters } from './listCharacters'

export async function renderCharacterList({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<void> {
  await listCharacters({ guild, appId })
  const debouncedUpdateCharacterList = debounce(listCharacters, 1000)

  startAppListening({
    matcher: isAnyOf(
      newgame,
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
