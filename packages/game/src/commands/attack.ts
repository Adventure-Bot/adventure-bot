import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import {
  attackResultEmbed,
  makeAttack,
  playerAttack,
} from '@adventure-bot/game/attack'
import { findOrCreateCharacter, loot } from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { CommandHandlerOptions, sleep } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('attack')
  .setDescription('Make an attack')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to attack').setRequired(true)
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const targetUser = interaction.options.data[0].user
  const initiatorUser = interaction.user
  if (!targetUser) {
    await interaction.channel?.send(`You must specify a target @player`)
    return
  }

  const initiator = findOrCreateCharacter(initiatorUser)
  const target = findOrCreateCharacter(targetUser)
  if (initiator.hp === 0) {
    await interaction.channel?.send({
      embeds: [
        new EmbedBuilder({
          description: `You're too weak to press on.`,
        }).setImage('https://imgur.com/uD06Okr.png'),
      ],
    })
    return
  }
  const attackResult = playerAttack(interaction, initiator, target)

  if (attackResult.outcome === 'cooldown') {
    await cooldowns.execute({ interaction })
    return
  }
  const embeds = [attackResultEmbed({ result: attackResult })]
  if (0 === selectCharacterById(store.getState(), target.id)?.hp) {
    await loot({
      looterId: initiator.id,
      targetId: target.id,
      interaction,
    })
  }
  await interaction.channel?.send({
    embeds,
  })
  await sleep(2000)
  const retaliationEmbeds: EmbedBuilder[] = []
  if (0 < findOrCreateCharacter(targetUser).hp) {
    const retaliationResult = makeAttack({
      interaction,
      attacker: target,
      defender: initiator,
    })
    if (!retaliationResult) {
      await interaction.channel?.send({
        content: `No attack result or retaliation outcome is cooldown. This should not happen.`,
      })
      return
    }
    retaliationEmbeds.push(
      attackResultEmbed({ result: retaliationResult, variant: 'retaliation' })
    )
    if (0 === findOrCreateCharacter(initiatorUser).hp) {
      loot({
        looterId: target.id,
        targetId: initiator.id,
        interaction,
      })
    }

    await interaction.channel?.send({
      embeds: retaliationEmbeds,
    })
  }
}

export default { command, execute }

export const defaultAccuracyDescriptors = {
  wideMiss: [`<@attacker> misses <@defender> utterly`],
  nearMiss: [`<@attacker> nearly misses <@defender>`],
  onTheNose: [`<@attacker> finds purchase against <@defender>`],
  veryAccurate: [`<@attacker> strikes <@defender> true`],
}
