import { createAction } from '@reduxjs/toolkit'
import { EmbedBuilder, TextChannel } from 'discord.js'

import { decoratedName, hpBarField } from '@adventure-bot/game/character'
import { StatusEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

// TODO: trigger this
// ts-prune-ignore-next
export const periodicEffectApplied = createAction<{
  characterId: string
  effect: StatusEffect
}>('periodicEffectApplied')

export function announcePeriodicEffects(channel: TextChannel): void {
  startAppListening({
    actionCreator: periodicEffectApplied,
    effect: ({ payload: { characterId, effect } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const { healthAdjustment } = effect

      const fields = healthAdjustment
        ? [hpBarField({ character, adjustment: healthAdjustment })]
        : []

      const embeds = [
        new EmbedBuilder({
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
