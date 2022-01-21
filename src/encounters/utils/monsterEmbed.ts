import { MessageEmbed } from 'discord.js'
import { Monster } from '@adventure-bot/monster/Monster'
import { decoratedName } from '@adventure-bot/character/decoratedName'

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(monster),
    color: 'RED',
  })
    .setImage(monster.profile)
    .addField('Gold', monster.gold.toString())
