import { MessageEmbed } from 'discord.js'

import { decoratedName } from '@adventure-bot/character'
import { Monster } from '@adventure-bot/monster'

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(monster),
    color: 'RED',
  })
    .setImage(monster.profile)
    .addField('Gold', monster.gold.toString())
