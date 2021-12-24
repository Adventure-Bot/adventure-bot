import { Character } from "../../character/Character";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestId, quests } from "../../quest/quests";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { Item } from "equipment/Item";
import { equipmentFilter } from "../../character/loot/loot";
import { Monster } from "../../monster/Monster";
import { clamp } from "remeda";
import { Encounter } from "../../monster/Encounter";
import { AttackResult } from "../../attack/AttackResult";
import { characterLooted } from "./loots";

export const isStatusEffectExpired = (effect: StatusEffect): boolean =>
  Date.now() > new Date(effect.started).valueOf() + effect.duration;

export type AttackAction = {
  encounter?: Encounter;
  attackResult: AttackResult;
};

export const attack = createAction<AttackAction>("character/attack");

const charactersById: Record<string, Character> = {};
const roamingMonsters: string[] = [];

const characterSlice = createSlice({
  name: "characters",
  initialState: {
    charactersById,
    roamingMonsters,
    isHeavyCrownInPlay: false,
  },
  reducers: {
    updateCharacter(state, action: PayloadAction<Character>) {
      const character = action.payload;
      character.statusEffects =
        character.statusEffects?.filter(
          (effect) => !isStatusEffectExpired(effect)
        ) ?? [];
      state.charactersById[character.id] = character;
    },

    monsterCreated(state, action: PayloadAction<Monster>) {
      const monster = action.payload;
      state.charactersById[monster.id] = monster;
      state.roamingMonsters.push(monster.id);
    },

    updateCharacterCooldowns(
      state,
      action: PayloadAction<{
        character: Character;
        cooldowns: Character["cooldowns"];
      }>
    ) {
      const { character, cooldowns } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        cooldowns,
      };
    },

    addCharacterStatusEffect(
      state,
      action: PayloadAction<{
        character: Character;
        effect: StatusEffect;
      }>
    ) {
      const { character, effect } = action.payload;
      state.charactersById[character.id] = {
        ...character,
        statusEffects: [...(character.statusEffects || []), effect],
      };
    },

    addCharacterQuestProgress(
      state,
      action: PayloadAction<{
        characterId: string;
        questId: QuestId;
        amount: number;
      }>
    ) {
      const { questId, amount, characterId } = action.payload;
      const quest = state.charactersById[characterId].quests[questId];
      if (!quest) return;
      quest.progress += amount;
    },

    questCompleted(
      state,
      action: PayloadAction<{
        questId: QuestId;
        characterId: string;
      }>
    ) {
      const { questId, characterId } = action.payload;
      delete state.charactersById[characterId].quests[questId];
    },

    goldGained(
      state,
      action: PayloadAction<{
        characterId: string;
        amount: number;
      }>
    ) {
      const { characterId, amount } = action.payload;
      state.charactersById[characterId].gold += amount;
    },

    updateGold(
      state,
      action: PayloadAction<{
        characterId: string;
        gold: number;
      }>
    ) {
      const { characterId, gold } = action.payload;
      state.charactersById[characterId].gold = gold;
    },

    grantDivineBlessing(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.charactersById[character.id] = {
        ...character,
        maxHP: character.maxHP + 1,
        hp: character.hp + 1,
      };
    },

    adjustCharacterHP(
      state,
      action: PayloadAction<{
        character: Character;
        amount: number;
      }>
    ) {
      const { amount } = action.payload;
      const character = state.charactersById[action.payload.character.id];
      character.hp = clamp(character.hp + amount, {
        min: 0,
        max: getCharacterStatModified(character, "maxHP"),
      });
    },

    damage(
      state,
      action: PayloadAction<{
        characterId: string;
        amount: number;
      }>
    ) {
      const { amount } = action.payload;
      const character = state.charactersById[action.payload.characterId];
      character.hp = clamp(character.hp - amount, {
        min: 0,
        max: getCharacterStatModified(character, "maxHP"),
      });

      if (character.hp > 0)
        addCharacterQuestProgress({
          characterId: character.id,
          questId: "survivor",
          amount,
        });
    },

    grantQuest(
      state,
      action: PayloadAction<{
        characterId: string;
        questId: QuestId;
      }>
    ) {
      const { characterId, questId } = action.payload;
      const character = state.charactersById[characterId];
      if (character.quests[questId]) return;
      character.quests[questId] = { ...quests[questId] };
    },

    addItemToInventory(
      state,
      action: PayloadAction<{
        character: Character;
        item: Item;
      }>
    ) {
      const { character, item } = action.payload;
      if (item.name === "heavy crown") {
        state.isHeavyCrownInPlay = true;
      }
      state.charactersById[character.id] = {
        ...character,
        inventory: [...character.inventory, item],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(characterLooted, (state, action) => {
      const { itemsTaken, goldTaken, looterId, targetId } = action.payload;
      const looter = state.charactersById[looterId];
      const target = state.charactersById[targetId];

      looter.gold += goldTaken;
      looter.inventory = [...looter.inventory, ...itemsTaken];

      target.gold -= goldTaken;
      const isTakenItem = (item: Item) =>
        itemsTaken.find((i) => i.id === item.id);
      target.inventory = target.inventory.filter((item) => !isTakenItem(item));
      target.equipment = equipmentFilter(
        target.equipment,
        (item) => !isTakenItem(item)
      );
    });
  },
});

export const {
  updateCharacter,
  updateCharacterCooldowns,
  updateGold,
  addCharacterStatusEffect,
  addCharacterQuestProgress,
  grantDivineBlessing,
  adjustCharacterHP,
  addItemToInventory,
  questCompleted,
  goldGained,
  monsterCreated,
  damage,
  grantQuest,
} = characterSlice.actions;

export default characterSlice.reducer;
