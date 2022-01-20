import { randomUUID } from 'crypto'
import { values } from 'remeda'
import { Character } from '../Character'
import { getCharacter } from '../getCharacter'
import store from '../../store'
import { Item } from '../../equipment/Item'
import { characterLooted } from '../../store/slices/loots'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import moment from 'moment'
import { getCrownArt } from './getCrownArt'

export type LootResult = {
  id: string
  itemsTaken: Item[]
  goldTaken: number
  looterId: string
  targetId: string
  timestamp: string
}

const isLootable = (item: Item): boolean => item.lootable ?? false

const crownLootedAnnouncement = async ({
  loot,
  interaction,
}: {
  loot: LootResult
  interaction: CommandInteraction
}): Promise<void> => {
  const looter = getCharacter(loot.looterId)
  if (!looter) return
  const { s3Url } = getCrownArt()
  interaction.channel?.send({
    embeds: [
      new MessageEmbed({
        title: `👑 ${looter.name} has the crown!`,
        color: 'YELLOW',
        description: [
          `Attention @here!`,
          ``,
          `${looter.name} has acquired the crown and their rule will become sovereign at:`,
          ``,
          moment()
            .add(1, 'days')
            .format('h:mm a [on] dddd, [the] Do [day of] MMMM, YYYY'),
          ``,
          `If you do not wish to submit to their rule, rise up!`,
        ].join('\n'),
      })
        .setImage(s3Url)
        .setThumbnail(looter.profile),
    ],
  })
}

export async function loot({
  looterId,
  targetId,
  interaction,
}: {
  looterId: string
  targetId: string
  interaction: CommandInteraction
}): Promise<LootResult | void> {
  const looter = getCharacter(looterId)
  const target = getCharacter(targetId)
  if (!looter || !target) {
    console.error(`loot failed looterId:${looterId} targetId:${targetId}`)
    return
  }
  const loot: LootResult = {
    id: randomUUID(),
    goldTaken: target.gold,
    itemsTaken: target.inventory.filter(isLootable),
    looterId: looter.id,
    targetId: target.id,
    timestamp: new Date().toString(),
  }
  store.dispatch(characterLooted(loot))
  const crownTaken = loot.itemsTaken.some((item) => item.name === 'heavy crown')
  if (crownTaken) await crownLootedAnnouncement({ loot, interaction })
  return loot
}

export const equipmentFilter = (
  equipment: Character['equipment'],
  predicate: (item: Item) => boolean
): Character['equipment'] =>
  values(equipment)
    .filter(predicate)
    .reduce(
      (equipment, item) => ({
        ...equipment,
        [item.type]: item,
      }),
      {}
    )
