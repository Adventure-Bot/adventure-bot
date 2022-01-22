import { Manifest } from '@adventure-bot/asset-manifest'
import { Item } from '@adventure-bot/equipment/Item'
import { equipInventoryItemPrompt } from '@adventure-bot/equipment/equipInventoryItemPrompt'
import { equipItemPrompt } from '@adventure-bot/equipment/equipItemPrompt'
import { equippableInventory } from '@adventure-bot/equipment/equippableInventory'
import { goldValue } from '@adventure-bot/equipment/goldValue'
import { isEquipped } from '@adventure-bot/equipment/isEquipped'
import { itemEmbed } from '@adventure-bot/equipment/itemEmbed'
import { itemSelect } from '@adventure-bot/equipment/itemSelect'
import {
  amuletOfAttack,
  amuletOfProtection,
  buckler,
  chainArmor,
  dagger,
  heavyCrown,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  potionOfHealing,
  potionOfMight,
  potionOfProtection,
  potionOfSlaying,
  potionOfVigor,
  ringOfAttack,
  towerShield,
  unidentifiedPotion,
  warAxe,
} from '@adventure-bot/equipment/items'
import { heavyCrownId } from '@adventure-bot/equipment/items/heavyCrown'
import { offerItemPrompt } from '@adventure-bot/equipment/offerItemPrompt'
import { randomChestItem } from '@adventure-bot/equipment/randomChestItem'
import { randomShopItem } from '@adventure-bot/equipment/randomShopItem'
import { usableInventory } from '@adventure-bot/equipment/usableInventory'
import { useInventoryItemPrompt } from '@adventure-bot/equipment/useInventoryItemPrompt'
import { EffectTemplate } from '@adventure-bot/statusEffects/templates'

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
    description: Manifest['fantasy']['items']
    type: 'potion'
    useEffects: {
      maxHeal?: number
      randomEffect?: EffectTemplate[]
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
  itemEmbed,
  itemSelect,
  amuletOfAttack,
  amuletOfProtection,
  buckler,
  chainArmor,
  dagger,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  potionOfHealing,
  potionOfMight,
  potionOfProtection,
  potionOfSlaying,
  potionOfVigor,
  ringOfAttack,
  towerShield,
  warAxe,
  Item,
  usableInventory,
  unidentifiedPotion,
  equipItemPrompt,
  equippableInventory,
  isEquipped,
  heavyCrown,
  randomChestItem,
  equipInventoryItemPrompt,
  offerItemPrompt,
  useInventoryItemPrompt,
  goldValue,
  randomShopItem,
  heavyCrownId,
}
