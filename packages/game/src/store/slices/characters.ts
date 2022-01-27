import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { clamp } from 'remeda'

import { AttackResult } from '@adventure-bot/game/attack'
import {
  Character,
  equipmentFilter,
  getCharacterStatModified,
} from '@adventure-bot/game/character'
import { Encounter } from '@adventure-bot/game/encounters'
import { getSaleRate } from '@adventure-bot/game/encounters/shop/getSaleRate'
import {
  Item,
  isAmulet,
  isArmor,
  isHat,
  isRing,
  isShield,
  isWeapon,
} from '@adventure-bot/game/equipment'
import { Monster } from '@adventure-bot/game/monster'
import { QuestId, quests } from '@adventure-bot/game/quest'
import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { itemReceived, newGame } from '@adventure-bot/game/store/actions'
import { characterLooted } from '@adventure-bot/game/store/slices/loots'

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration

type AttackAction = {
  encounter?: Encounter
  attackResult: AttackResult
}

export const attacked = createAction<AttackAction>('character/attacked')
export const created = createAction<Character>('character/created')

const charactersById: Record<string, Character> = {}
const roamingMonsters: string[] = []
const characterSlice = createSlice({
  name: 'characters',
  initialState: {
    charactersById,
    roamingMonsters,
  },
  reducers: {
    cleansed(state, action: PayloadAction<{ characterId: string }>) {
      const character = state.charactersById[action.payload.characterId]
      character.statusEffects = []
    },

    cooldownStarted(
      state,
      action: PayloadAction<{
        characterId: string
        cooldown: keyof Character['cooldowns']
      }>
    ) {
      const { characterId, cooldown } = action.payload
      const character = state.charactersById[characterId]
      if (!character) return
      character.cooldowns[cooldown] = new Date().toString()
    },

    monsterCreated(state, action: PayloadAction<Monster>) {
      const monster = action.payload
      state.charactersById[monster.id] = monster
      state.roamingMonsters.push(monster.id)
    },

    effectAdded(
      state,
      action: PayloadAction<{
        characterId: string
        effect: StatusEffect
      }>
    ) {
      const { characterId, effect } = action.payload
      const character = state.charactersById[characterId]
      character.statusEffects = character.statusEffects
        .concat(effect)
        .filter((effect) => !isStatusEffectExpired(effect))
    },

    questProgressed(
      state,
      action: PayloadAction<{
        characterId: string
        questId: QuestId
        amount: number
      }>
    ) {
      const { questId, amount, characterId } = action.payload
      const quest = state.charactersById[characterId].quests[questId]
      if (!quest) return
      quest.progress += amount
    },

    questCompleted(
      state,
      action: PayloadAction<{
        questId: QuestId
        characterId: string
      }>
    ) {
      const { questId, characterId } = action.payload
      delete state.charactersById[characterId].quests[questId]
    },

    goldSet(
      state,
      action: PayloadAction<{ characterId: string; gold: number }>
    ) {
      const { characterId, gold } = action.payload
      const character = state.charactersById[characterId]
      character.gold = gold
    },

    goldGained(
      state,
      action: PayloadAction<{
        characterId: string
        amount: number
      }>
    ) {
      const { characterId, amount } = action.payload
      state.charactersById[characterId].gold += amount
    },

    grantDivineBlessing(state, action: PayloadAction<string>) {
      const character = state.charactersById[action.payload]
      if (!character) return
      character.maxHP += 1
      character.hp += 1
    },

    itemGiven(
      state,
      action: PayloadAction<{
        fromCharacterId: string
        toCharacterId: string
        item: Item
      }>
    ) {
      const {
        fromCharacterId: fromId,
        toCharacterId: toId,
        item,
      } = action.payload
      const fromCharacter = state.charactersById[fromId]
      const toCharacter = state.charactersById[toId]
      // remove from giver's inventory and equipment
      const notIt = (i: Item) => i.id !== item.id
      fromCharacter.inventory = fromCharacter.inventory.filter(notIt)
      fromCharacter.equipment = equipmentFilter(fromCharacter.equipment, notIt)
      // give to recipient
      toCharacter.inventory.push(item)
    },

    itemRemoved(
      state,
      action: PayloadAction<{
        characterId: string
        itemId: string
      }>
    ) {
      const { characterId, itemId } = action.payload
      const character = state.charactersById[characterId]
      const notIt = (i: Item) => i.id !== itemId
      character.inventory = character.inventory.filter(notIt)
      character.equipment = equipmentFilter(character.equipment, notIt)
    },

    itemEquipped(
      state,
      action: PayloadAction<{
        characterId: string
        itemId: string
      }>
    ) {
      const { characterId, itemId } = action.payload
      const character = state.charactersById[characterId]
      if (!character) return
      const item = character.inventory.find((i) => i.id === itemId)
      if (!item) return
      if (isWeapon(item)) character.equipment.weapon = item
      if (isAmulet(item)) character.equipment.amulet = item
      if (isArmor(item)) character.equipment.armor = item
      if (isRing(item)) character.equipment.ring = item
      if (isShield(item)) character.equipment.shield = item
      if (isHat(item)) character.equipment.hat = item
    },

    itemSold(
      state,
      action: PayloadAction<{
        characterId: string
        itemId: string
      }>
    ) {
      const { characterId, itemId } = action.payload
      const character = state.charactersById[characterId]
      if (!character) return
      const item = character.inventory.find((i) => i.id === itemId)
      if (!item) return
      if (!item.sellable) return
      character.inventory = character.inventory.filter((i) => i.id !== itemId)
      character.gold += Math.round(item.goldValue * getSaleRate())
      character.equipment = equipmentFilter(
        character.equipment,
        (i) => i.id !== itemId
      )
    },

    damaged(
      state,
      action: PayloadAction<{
        characterId: string
        amount: number
      }>
    ) {
      const { amount } = action.payload
      const character = state.charactersById[action.payload.characterId]
      character.hp = clamp(character.hp - amount, {
        min: 0,
        max: getCharacterStatModified(character, 'maxHP'),
      })

      if (character.hp > 0 && character.quests.survivor)
        character.quests.survivor.progress += amount
    },

    healed(
      state,
      action: PayloadAction<{
        characterId: string
        amount: number
      }>
    ) {
      const { amount, characterId } = action.payload
      const character = state.charactersById[characterId]
      if (!character) return
      if (character.hp > getCharacterStatModified(character, 'maxHP')) return
      character.hp = clamp(character.hp + amount, {
        min: 0,
        max: getCharacterStatModified(character, 'maxHP'),
      })
    },

    questGranted(
      state,
      action: PayloadAction<{
        characterId: string
        questId: QuestId
      }>
    ) {
      const { characterId, questId } = action.payload
      const character = state.charactersById[characterId]
      if (character.quests[questId]) return
      character.quests[questId] = { ...quests[questId] }
    },

    profileSet(
      state,
      action: PayloadAction<{ profile: string; characterId: string }>
    ) {
      const { profile, characterId } = action.payload
      const character = state.charactersById[characterId]
      character.profile = profile
    },

    purgeRoamingMonsters(state) {
      state.roamingMonsters = []
    },

    healthSet(
      state,
      action: PayloadAction<{
        characterId: string
        health: number
      }>
    ) {
      const { characterId, health } = action.payload
      const character = state.charactersById[characterId]
      character.hp = health
    },

    xpAwarded(
      state,
      action: PayloadAction<{
        characterId: string
        amount: number
      }>
    ) {
      const { characterId, amount } = action.payload
      const character = state.charactersById[characterId]
      character.xp += amount
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newGame, (state) => {
        state.charactersById = {}
        state.roamingMonsters = []
      })
      .addCase(created, (state, action: PayloadAction<Character>) => {
        state.charactersById[action.payload.id] = action.payload
      })
      .addCase(characterLooted, (state, action) => {
        const { itemsTaken, goldTaken, looterId, targetId } = action.payload
        const looter = state.charactersById[looterId]
        const target = state.charactersById[targetId]

        looter.gold += goldTaken
        looter.inventory = [...looter.inventory, ...itemsTaken]

        target.gold -= goldTaken
        const isTakenItem = (item: Item) =>
          itemsTaken.find((i) => i.id === item.id)
        target.inventory = target.inventory.filter((item) => !isTakenItem(item))
        target.equipment = equipmentFilter(
          target.equipment,
          (item) => !isTakenItem(item)
        )
      })
      .addCase(itemReceived, (state, action) => {
        const { characterId, item } = action.payload
        const character = state.charactersById[characterId]
        if (!character) return
        character.inventory.push(item)
      })
  },
})

export const {
  questProgressed,
  cleansed,
  cooldownStarted,
  damaged,
  effectAdded,
  goldGained,
  goldSet,
  grantDivineBlessing,
  questGranted,
  healed,
  healthSet,
  itemEquipped,
  itemGiven,
  itemRemoved,
  itemSold,
  monsterCreated,
  profileSet,
  questCompleted,
  xpAwarded,
  purgeRoamingMonsters,
} = characterSlice.actions

export default characterSlice.reducer
