import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji, d20Emoji } from '@adventure-bot/Emoji'
import {
  AttackResult,
  attackResultEmbed,
  makeAttack,
  playerAttack,
} from '@adventure-bot/attack'
import {
  getCharacterStatModified,
  getUserCharacter,
  loot,
  lootResultEmbed,
  mentionCharacter,
} from '@adventure-bot/character'
import cooldowns from '@adventure-bot/commands/cooldowns'
import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'
import { randomArrayElement, sleep } from '@adventure-bot/utils'

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

const defaultAccuracyDescriptors = {
  wideMiss: [`<@attacker> misses <@defender> utterly`],
  nearMiss: [`<@attacker> nearly misses <@defender>`],
  onTheNose: [`<@attacker> finds purchase against <@defender>`],
  veryAccurate: [`<@attacker> strikes <@defender> true`],
}

const accuracyDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`
  if (result.outcome === 'cooldown') return 'On cooldown'
  const accuracy =
    result.attackRoll +
    getCharacterStatModified(result.attacker, 'attackBonus') -
    getCharacterStatModified(result.defender, 'ac')
  const attacker = mentionCharacter(result.attacker)
  const defender = mentionCharacter(result.defender)
  const descriptors =
    result.attacker.equipment.weapon?.accuracyDescriptors ??
    defaultAccuracyDescriptors

  const descriptor =
    accuracy > 5
      ? descriptors.veryAccurate
      : accuracy > 0
      ? descriptors.onTheNose
      : accuracy > -2
      ? descriptors.nearMiss
      : descriptors.wideMiss

  return randomArrayElement(descriptor)
    .replace(/<@attacker>/g, attacker)
    .replace(/<@defender>/g, defender)
}

const damageDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`

  if (result.outcome === 'cooldown' || result.outcome === 'miss') return ''

  const damage = result.damage
  switch (true) {
    case damage > 5:
      return 'with a devastating blow!'
    case damage > 2:
      return 'with a solid strike.'
    default:
      return 'with a weak hit.'
  }
}

export const attackFlavorText = (
  result: ReturnType<typeof playerAttack>
): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : 'No result'

export const attackRollText = ({
  result,
  interaction,
}: {
  result: AttackResult
  interaction: CommandInteraction
}): string => {
  if (!result) return 'No result. This should not happen.'
  const attackEmoji = Emoji(interaction, 'attack')
  const attackBonus = getCharacterStatModified(result.attacker, 'attackBonus')
  const diceEmoji = d20Emoji({ interaction, n: result.attackRoll })
  const bonusText = (attackBonus > 0 ? '+' : '') + (attackBonus || '')
  const comparison = result.outcome === 'hit' ? '≥' : '<'
  const acEmoji = Emoji(interaction, 'ac')
  const ac = result.defender.ac

  return `${attackEmoji}${diceEmoji}${bonusText} ${comparison} ${acEmoji} ${ac}`
}
