import { createAction } from '@reduxjs/toolkit'
import { MessageEmbed, TextChannel } from 'discord.js'

import { decoratedName, hpBarField } from '@adventure-bot/game/character'
import { PeriodicEffect } from '@adventure-bot/game/statusEffects/StatusEffect'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const periodicEffectApplied = createAction<{
  characterId: string
  effect: PeriodicEffect
}>('periodicEffectApplied')

export function announcePeriodicEffects({
  channel,
}: {
  channel: TextChannel
}): void {
  startAppListening({
    actionCreator: periodicEffectApplied,
    effect: ({ payload: { characterId, effect } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const { healthAdjustment } = effect.overTime

      const fields = healthAdjustment
        ? [hpBarField({ character, adjustment: healthAdjustment })]
        : []

      const embeds = [
        new MessageEmbed({
          title: `${decoratedName(character)} ${effect.announcement}!`,
          fields,
          color: effect.announcementColor,
        }),
      ]
      channel.send({
        embeds,
      })
    },
  })
}
