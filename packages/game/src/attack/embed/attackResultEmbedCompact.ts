import { MessageEmbed } from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'

import {
  AttackResult,
  attackResultHeadline,
  attackRollText,
} from '@adventure-bot/game/attack'
import { accuracyDescriptor } from '@adventure-bot/game/attack/embed/accuracyDescriptor'
import { damageDescriptor } from '@adventure-bot/game/attack/embed/damageDescriptor'
import { decoratedName, hpBarField } from '@adventure-bot/game/character'

export async function attackResultEmbedCompact({
  result,
}: {
  result: AttackResult
}): Promise<MessageEmbed> {
  return new MessageEmbed({
    title: attackResultHeadline({
      result,
    }),
    description:
      (await attackFlavorText(result)) +
      '\n' +
      attackRollText({
        result,
      }),
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: ['hit', 'crit'].includes(result.outcome)
          ? -result.damage
          : 0,
        showName: true,
      }),
    ],
  }).setThumbnail(result.attacker.profile)
}
export const attackFlavorText = async (
  result: AttackResult
): Promise<string> => {
  const { attacker, defender, outcome, damage, attackRoll } = result
  if (typeof process.env.OPENAI_APIKEY !== 'string') {
    result
      ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
      : 'No result'
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_APIKEY,
  })
  const openai = new OpenAIApi(configuration)

  const content = [
    `In a sentence of 30 words or fewer, describe an attack.`,
    `Avoid gender pronouns, use the character's name or they/them.`,
    `Avoid mentioning game mechanics like hitpoints and attack rolls, but describe these things in natural real-world terms instead.`,
    `Avoid conflicting yourself.`,
    `${decoratedName(attacker)} is the attacker.`,
    `${decoratedName(defender)} is the defender.`,
    `Use the following game values to inform the description.`,
    `The attack result was: ${outcome}.`,
    damage > defender.hp
      ? `${defender.name} is knocked out!`
      : `${defender.name} still stands.`,
    `The attack roll was ${attackRoll} versus against the defender's ${defender.statsModified.ac} ac.`,
    attacker.equipment.weapon
      ? `${attacker.name} is wielding a ${attacker.equipment.weapon.name}.`
      : '',
    defender.equipment.armor
      ? `${defender.name} is wearing ${defender.equipment.armor.name}`
      : '',
    defender.equipment.shield
      ? `${defender.name} is carrying a ${defender.equipment.shield.name}`
      : '',
    `The total damage received was ${outcome == 'miss' ? 0 : damage} of ${
      defender.name
    }'s remaining ${defender.hp} hp.`,
  ]
    .filter(Boolean)
    .join('\n')
  console.time('openai')
  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content,
      },
    ],
  })
  console.timeEnd('openai')
  return chatCompletion.data.choices[0].message?.content ?? ''
}
