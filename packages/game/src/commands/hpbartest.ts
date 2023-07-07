import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { createCharacter, hpBarField } from '@adventure-bot/game/character'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('hpbartest')
  .setDescription('Show hp bar variants.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const half = createCharacter({
    name: 'Test',
    hp: 5,
    maxHP: 10,
  })
  const full = createCharacter({
    name: 'Test',
    hp: 10,
    maxHP: 10,
  })
  const ko = createCharacter({
    name: 'Test',
    hp: 0,
    maxHP: 10,
  })

  interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: 'Heal',
        fields: [hpBarField({ character: half, adjustment: 3 })],
      }),
      new EmbedBuilder({
        title: 'Overheal',
        fields: [hpBarField({ character: full, adjustment: 300 })],
      }),
      new EmbedBuilder({
        title: 'Damage',
        fields: [hpBarField({ character: half, adjustment: -3 })],
      }),
      new EmbedBuilder({
        title: 'Overkill',
        fields: [hpBarField({ character: ko, adjustment: -100 })],
      }),
    ],
  })
}

export default { command, execute }
