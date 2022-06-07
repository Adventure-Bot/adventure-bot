import { isAnyOf } from '@reduxjs/toolkit'
import { Guild } from 'discord.js'

import {
  roamingMonstersChannel,
  roamingMonstersEmbeds,
} from '@adventure-bot/game/roamingMonsters'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { monsterCreated } from '@adventure-bot/game/store/slices/characters'
import {
  doubleKO,
  playerDefeat,
} from '@adventure-bot/game/store/slices/encounters'

export async function renderRoamingMonsters({
  appId,
  guild,
}: {
  guild: Guild
  appId: string
}): Promise<void> {
  const embeds = roamingMonstersEmbeds()
  const channel = await roamingMonstersChannel({ appId, guild })
  const message =
    (await channel.messages.fetch()).first() ?? (await channel.send({ embeds }))
  await message.edit({ embeds: roamingMonstersEmbeds().slice(0, 9) })
  startAppListening({
    matcher: isAnyOf(monsterCreated, playerDefeat, doubleKO),
    effect: () => {
      message.edit({ embeds: roamingMonstersEmbeds() })
    },
  })
}
