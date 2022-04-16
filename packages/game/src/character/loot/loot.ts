import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'
import { values } from 'remeda'

import { Character, getCharacter } from '@adventure-bot/game/character'
import { Item } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { characterLooted } from '@adventure-bot/game/store/slices/loots'

export type LootResult = {
  id: string
  itemsTaken: Item[]
  goldTaken: number
  looterId: string
  targetId: string
  timestamp: string
}

const isLootable = (item: Item): boolean => item.lootable ?? false

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
  store.dispatch(characterLooted({ loot, interaction }))
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
