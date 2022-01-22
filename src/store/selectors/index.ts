import { createSelector } from '@reduxjs/toolkit'
import { values } from 'remeda'

import { Character } from '@adventure-bot/character'
import { Stats, stats } from '@adventure-bot/character/Stats'
import { getCharacterStatModifier } from '@adventure-bot/character/getCharacterStatModifier'
import { LootResult } from '@adventure-bot/character/loot/loot'
import { Encounter } from '@adventure-bot/encounter/Encounter'
import { Monster, isMonster } from '@adventure-bot/monster/Monster'
import { Quest } from '@adventure-bot/quest/Quest'
import { QuestId, quests } from '@adventure-bot/quest/quests'
import { ReduxState } from '@adventure-bot/store'
import { isStatusEffectExpired } from '@adventure-bot/store/slices/characters'
import { getAsset } from '@adventure-bot/utils/getAsset'

const decorateCharacterWithAssetProfile = <T extends Character>(
  character: T
) => {
  if (character && character.asset) {
    return {
      ...character,
      profile: getAsset(
        // @ts-ignore
        character.asset[0],
        character.asset[1],
        character.asset[2],
        character.id
      ).s3Url,
    }
  } else return character
}

const selectStats = (
  state: ReduxState,
  characterId: string,
  includeModifiers = true
): Stats | void => {
  const character = state.characters.charactersById[characterId]
  if (!character) return
  if (!includeModifiers)
    return stats.reduce(
      (acc, stat) => ({
        ...acc,
        [stat]: character[stat],
      }),
      {} as Stats
    )
  return stats.reduce(
    (acc, stat) => ({
      ...acc,
      [stat]: character[stat] + getCharacterStatModifier(character, stat),
    }),
    {} as Stats
  )
}

type SelectedCharacter = Character & {
  stats: Stats
  statsModified: Stats
}
export const selectCharacterById = (
  state: ReduxState,
  id: string
): SelectedCharacter | void => {
  const character = state.characters.charactersById[id]
  if (!character) return
  const stats = selectStats(state, character.id)
  const statsModified = selectStats(state, character.id, true)
  if (!(character && stats && statsModified)) return

  return {
    ...decorateCharacterWithAssetProfile(character),
    statusEffects: character?.statusEffects?.filter(
      (effect) => !isStatusEffectExpired(effect)
    ),
    stats,
    statsModified,
  }
}

type SelectedMonster = SelectedCharacter & Monster

export const selectMonsterById = (
  state: ReduxState,
  id: string
): SelectedMonster | void => {
  const character = selectCharacterById(state, id)
  if (character && isMonster(character)) return character
}

export const selectAllCharacters = createSelector(
  (state: ReduxState) => state.characters.charactersById,
  (charactersById) =>
    Object.values(charactersById)
      .filter((character) => character.isMonster !== true)
      .map((c) => decorateCharacterWithAssetProfile<Character>(c))
)

export const selectRoamingMonsters = createSelector(
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

export const selectCooldownByType = (
  state: ReduxState,
  cooldownType: keyof ReduxState['cooldowns']
): number | undefined => state.cooldowns[cooldownType]

export const selectHasItemNameInInventory = createSelector(
  (state: ReduxState, character: Character, itemName: string) =>
    state.characters.charactersById[character.id]?.inventory.some(
      (item) => item.name === itemName
    ),
  (hasItem) => hasItem
)

export const selectLoot = (state: ReduxState): LootResult[] =>
  values(state.loots.lootsById)

export const selectIsHeavyCrownInPlay = (state: ReduxState): boolean =>
  state.crown.bearerId !== ''

export const selectSovereign = (state: ReduxState): Character | undefined =>
  state.crown.sovereign
    ? state.characters.charactersById[state.crown.bearerId]
    : undefined

export const selectWinnerAnnounced = (state: ReduxState): boolean =>
  state.crown.announced

export const selectLeaderBoard = (
  state: ReduxState
): typeof state.leaderboard => state.leaderboard

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
