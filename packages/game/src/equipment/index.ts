import { Manifest } from '@adventure-bot/game/asset-manifest'
import { Item } from '@adventure-bot/game/equipment/Item'
import { equipInventoryItemPrompt } from '@adventure-bot/game/equipment/equipInventoryItemPrompt'
import { equipItemPrompt } from '@adventure-bot/game/equipment/equipItemPrompt'
import { equippableInventory } from '@adventure-bot/game/equipment/equippableInventory'
import { isEquipped } from '@adventure-bot/game/equipment/isEquipped'
import { itemEmbed } from '@adventure-bot/game/equipment/itemEmbed'
import { itemSelect } from '@adventure-bot/game/equipment/itemSelect'
import { heavyCrownId } from '@adventure-bot/game/equipment/items/heavyCrown'
import { offerItemPrompt } from '@adventure-bot/game/equipment/offerItemPrompt'
import { randomChestItem } from '@adventure-bot/game/equipment/randomChestItem'
import { randomShopItem } from '@adventure-bot/game/equipment/randomShopItem'
import { usableInventory } from '@adventure-bot/game/equipment/usableInventory'
import { useInventoryItemPrompt } from '@adventure-bot/game/equipment/useInventoryItemPrompt'
import { EffectId } from '@adventure-bot/game/statusEffects/templates'

export type Equippable = Item & {
  equippable: true
  type: 'weapon' | 'armor' | 'shield' | 'hat' | 'amulet' | 'ring'
}
type Tradeable = Item & { tradeable: true }

export type Usable = Item & {
  usable: true
}

export type Weapon = Equippable & {
  type: 'weapon'
  damageMax: number
  onHitEffect?: EffectId
  onHitRandomEffect?: EffectId[]
  accuracyDescriptors: {
    wideMiss: string[]
    nearMiss: string[]
    onTheNose: string[]
    veryAccurate: string[]
  }
  // TODO:
  // damageDescriptors: {
  //   minimum: string[];
  //   weak: string[];
  //   average: string[];
  //   strong: string[];
  //   maximum: string[];
  // }
}

export type Armor = Equippable & {
  type: 'armor'
}
export type Shield = Equippable & {
  type: 'shield'
}
export type Hat = Equippable & {
  type: 'hat'
}
export type Amulet = Equippable & {
  type: 'amulet'
}
export type Ring = Equippable & {
  type: 'ring'
}
export type Potion = Item &
  Usable & {
    asset: Manifest['fantasy']['items']
    type: 'potion'
    useEffects: {
      maxHeal?: number
      randomEffect?: EffectId[]
    }
  }

export const isHat = (item: Item): item is Hat => item.type === 'hat'
export const isAmulet = (item: Item): item is Amulet => item.type === 'amulet'
export const isArmor = (item: Item): item is Armor => item.type === 'armor'
export const isShield = (item: Item): item is Shield => item.type === 'shield'
export const isWeapon = (item: Item): item is Weapon => item.type === 'weapon'
export const isRing = (item: Item): item is Ring => item.type === 'ring'
export const isEquippable = (item: Item): item is Equippable => item.equippable
export const isTradeable = (item: Item): item is Tradeable =>
  item.tradeable ?? false
export const isPotion = (item: Item): item is Potion => item.type === 'potion'
export const isUsable = (item: Item): item is Usable => item.usable ?? false

export {
  equipInventoryItemPrompt,
  equipItemPrompt,
  equippableInventory,
  heavyCrownId,
  isEquipped,
  Item,
  itemEmbed,
  itemSelect,
  offerItemPrompt,
  randomChestItem,
  randomShopItem,
  usableInventory,
  useInventoryItemPrompt,
}
