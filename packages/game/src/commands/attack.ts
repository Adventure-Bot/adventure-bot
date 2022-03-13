import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  attackResultEmbed,
  makeAttack,
  playerAttack,
} from '@adventure-bot/game/attack'
import {
  getUserCharacter,
  loot,
  lootResultEmbed,
} from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { sleep } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('attack')
  .setDescription('Make an attack')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to attack').setRequired(true)
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = interaction.options.data[0].user
  const initiator = interaction.user
  if (!target) {
    await interaction.editReply(`You must specify a target @player`)
    return
  }

  const attacker = getUserCharacter(initiator)
  const defender = getUserCharacter(target)
  let lootResult
  if (attacker.hp === 0) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed({
          description: `You're too weak to press on.`,
        }).setImage('https://imgur.com/uD06Okr.png'),
      ],
    })
    return
  }
  const result = playerAttack(attacker.id, defender.id)
  if (!result) {
    await interaction.editReply(`No attack result. This should not happen.`)
    return
  }

  if (result.outcome === 'cooldown') {
    await cooldowns.execute(interaction)
    return
  }
  const embeds = [attackResultEmbed({ result, interaction })]
  if (0 === selectCharacterById(store.getState(), defender.id)?.hp) {
    lootResult = await loot({
      looterId: attacker.id,
      targetId: defender.id,
      interaction,
    })
    if (lootResult)
      embeds.push(lootResultEmbed({ result: lootResult, interaction }))
  }
  await interaction.editReply({
    embeds,
  })
  await sleep(2000)
  const retaliationEmbeds: MessageEmbed[] = []
  if (0 < (selectCharacterById(store.getState(), defender.id)?.hp ?? 0)) {
    const result = makeAttack(defender.id, attacker.id)
    if (!result) {
      await interaction.editReply({
        content: `No attack result or retaliation outcome is cooldown. This should not happen.`,
      })
      return
    }
    retaliationEmbeds.push(
      attackResultEmbed({ result, interaction, variant: 'retaliation' })
    )
    if (selectCharacterById(store.getState(), defender.id)?.hp === 0) {
      lootResult = await loot({
        looterId: defender.id,
        targetId: attacker.id,
        interaction,
      })
      if (lootResult)
        retaliationEmbeds.push(
          lootResultEmbed({ result: lootResult, interaction })
        )
    }

    await interaction.followUp({
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
