import { createSelector } from '@reduxjs/toolkit'
import { values } from 'remeda'

import { Character, Stats } from '@adventure-bot/game/character'
import { Encounter } from '@adventure-bot/game/encounters'
import { Monster, isMonster } from '@adventure-bot/game/monster'
import { Quest } from '@adventure-bot/game/quest/Quest'
import { QuestId, quests } from '@adventure-bot/game/quest/quests'
import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterStats } from '@adventure-bot/game/store/selectors/selectCharacterStats'
import { asset } from '@adventure-bot/game/utils/asset'

export { selectCharacterEffects } from './selectCharacterEffects'
export { selectStatusEffectStatModifier } from './selectStatusEffectStatModifier'
export { selectCharacterStatModified } from './selectCharacterStatModified'
export { selectCharacterStatModifier } from './selectCharacterStatModifier'
export { selectEquipmentStatModifier } from './selectEquipmentStatModifier'
export { selectStunDurationRemaining } from './selectStunDurationRemaining'
export { selectCharacterStats } from './selectCharacterStats'

const decorateCharacterWithAssetProfile = <T extends Character>(
  character: T
) => {
  if (character && character.asset) {
    return {
      ...character,
      profile:
        character.profile ??
        asset(
          // @ts-ignore
          character.asset[0],
          character.asset[1],
          character.asset[2],
          character.id
        ).s3Url,
    }
  } else return character
}

export type CharacterWithStats = Character & {
  stats: Stats
  statsModified: Stats
}
export const selectCharacterById = (
  state: ReduxState,
  id: string
): CharacterWithStats | void => {
  const character = state.characters.charactersById[id]
  if (!character) return
  const stats = selectCharacterStats(state, character)
  const statsModified = selectCharacterStats(state, character, true)
  if (!(character && stats && statsModified)) return

  return {
    ...decorateCharacterWithAssetProfile(character),
    stats,
    statsModified,
  }
}

type MonsterWithStats = Monster & {
  stats: Stats
  statsModified: Stats
}

export const selectMonsterById = (
  state: ReduxState,
  id: string
): MonsterWithStats | void => {
  const character = selectCharacterById(state, id)
  if (character && isMonster(character)) return character
}

export const selectAllCharacters: (state: ReduxState) => Array<Character> =
  createSelector(
    (state: ReduxState) => state.characters.charactersById || {},
    (charactersById) =>
      Object.values(charactersById)
        .filter((character) => character.isMonster !== true)
        .map((c) => decorateCharacterWithAssetProfile<Character>(c))
  )

export const selectRoamingMonsters: (state: ReduxState) => Array<Monster> =
  createSelector(
    (state: ReduxState) =>
      state.characters.roamingMonsters.map(
        (id) => state.characters.charactersById[id]
      ),
    (monsters) => monsters.filter(isMonster).filter((monster) => monster.hp > 0)
  )

export const selectAllEncounters = (state: ReduxState): Encounter[] =>
  values(state.encounters.encountersById)

export const selectEncounterById = (state: ReduxState, id: string): Encounter =>
  state.encounters.encountersById[id]

export const selectHasItemNameInInventory: (
  state: ReduxState,
  character: Character,
  itemName: string
) => boolean = createSelector(
  (state: ReduxState, character: Character, itemName: string) =>
    state.characters.charactersById[character.id]?.inventory.some(
      (item) => item.name === itemName
    ),
  (hasItem) => hasItem
)

export const selectBearer = (state: ReduxState): Character | undefined =>
  state.characters.charactersById[state.crown.bearerId]

export const selectLastChannelUsed = (state: ReduxState): string =>
  state.commands.lastChannelId

const selectIsCharacterOnQuest = ({
  state,
  characterId,
  questId,
}: {
  state: ReduxState
  characterId: string
  questId: QuestId
}): boolean => {
  const character = state.characters.charactersById[characterId]
  return character?.quests[questId] ? true : false
}

export function selectAvailableQuests(
  state: ReduxState,
  character: Character
): Quest[] {
  return [quests.blessed, quests.slayer, quests.survivor].filter((quest) => {
    return !selectIsCharacterOnQuest({
      state,
      characterId: character.id,
      questId: quest.id,
    })
  })
}
