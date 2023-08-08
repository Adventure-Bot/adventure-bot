import { createMigrate } from 'redux-persist'
import { mapValues, values } from 'remeda'

import { isPotion } from '@adventure-bot/game/equipment'
import { unidentifiedPotion } from '@adventure-bot/game/equipment/items'
import { isMonster } from '@adventure-bot/game/monster'
import { RootReducerState } from '@adventure-bot/game/store'
import { defaultEncounterWeights } from '@adventure-bot/game/store/slices/encounters'

/*
 * This is the current version and should match the latest version
 */
export const persistVersion = 10
/**
 * Here we use RootReducerState instead of ReduxState to avoid cyclical type references
 */
type PersistedReduxStateV9 = RootReducerState
type PersistedReduxStateV8 = PersistedReduxStateV9
type PersistedReduxStateV7 = PersistedReduxStateV8

type PersistedReduxStateV5 = Omit<PersistedReduxStateV7, 'commands'> & {
  commands: Omit<PersistedReduxStateV7['commands'], 'userCommands'> & {
    userCommands: {
      [key: string]: number
    }
  }
}
type PersistedReduxStateV4 = Omit<PersistedReduxStateV5, 'commands'> & {
  commands: Omit<PersistedReduxStateV5['commands'], 'commandsUsed'> & {
    commandsUsed: {
      [key: string]: number
    }
  }
}

type PersistedReduxStateV3 = Omit<
  PersistedReduxStateV4,
  'crown' | 'leaderboard'
>

// state prior to stateful encounter weights
type PersistedReduxStateV2 = Omit<PersistedReduxStateV3, 'encounterWeights'>

// State prior to roaming monsters
type PersistedReduxStateV1 = Omit<PersistedReduxStateV2, 'characters'> & {
  characters: Omit<PersistedReduxStateV2['characters'], 'roamingMonsters'>
}

type MigrationState =
  | PersistedReduxStateV1
  | PersistedReduxStateV2
  | PersistedReduxStateV3
  | PersistedReduxStateV4
  | PersistedReduxStateV5

/** Migrations **/

const persistMigrations = {
  2: (state: PersistedReduxStateV1): PersistedReduxStateV2 => ({
    ...state,
    characters: {
      ...state.characters,
    },
  }),
  3: (state: PersistedReduxStateV2): PersistedReduxStateV3 => ({
    ...state,
    encounters: {
      ...state.encounters,
      encounterWeights: defaultEncounterWeights,
    },
  }),
  5: (state: PersistedReduxStateV4): PersistedReduxStateV5 => ({
    ...state,
    commands: {
      ...state.commands,
      commandsUsed: {},
    },
  }),
  6: (state: PersistedReduxStateV5): PersistedReduxStateV7 => ({
    ...state,
    commands: {
      ...state.commands,
      userCommands: {},
    },
  }),
  8: (state: PersistedReduxStateV7): RootReducerState => {
    state.characters.charactersById = mapValues(
      state.characters.charactersById,
      (character) => ({
        ...character,
        statusEffects: undefined,
      })
    )
    return state
  },
  9: (state: RootReducerState): PersistedReduxStateV9 => ({
    ...state,
    characters: {
      ...state.characters,
      roamingMonsterIds: values(state.characters.charactersById)
        .filter(isMonster)
        .filter(({ hp }) => hp > 0)
        .reduce(
          (acc, monster) => ({
            ...acc,
            [monster.id]: true,
          }),
          {}
        ),
    },
  }),
  10: (state: RootReducerState): RootReducerState => {
    state.characters.charactersById = mapValues(
      state.characters.charactersById,
      (character) => {
        character.inventory.forEach((item) => {
          if (isPotion(item) && item.name != unidentifiedPotion.name) {
            item.asset = item.description as typeof item.asset
          }
          return item
        })
        return character
      }
    )
    return state
  },
}

export const persistMigrate = createMigrate<MigrationState>(persistMigrations)
