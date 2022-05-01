import { createMigrate } from 'redux-persist'

import { RootReducerState } from '@adventure-bot/game/store'
import { defaultCommandsState } from '@adventure-bot/game/store/slices/commands'
import { crownDefaultState } from '@adventure-bot/game/store/slices/crown'
import { defaultEncounterWeights } from '@adventure-bot/game/store/slices/encounters'
import { defaultLeaderboardState } from '@adventure-bot/game/store/slices/leaderboard'

/*
 * This is the current version and should match the latest version
 */
export const persistVersion = 7

/**
 * Here we use RootReducerState instead of ReduxState to avoid cyclical type references
 */
type PersistedReduxStateV7 = RootReducerState

type PersistedReduxStateV6 = Omit<PersistedReduxStateV7, 'leaderboard'> & {
  leaderboard: Omit<
    PersistedReduxStateV7['leaderboard'],
    'victoriesByCharacter'
  >
}
type PersistedReduxStateV5 = Omit<PersistedReduxStateV6, 'commands'> & {
  commands: Omit<PersistedReduxStateV6['commands'], 'userCommands'> & {
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
  | PersistedReduxStateV6

/** Migrations **/

const persistMigrations = {
  2: (state: PersistedReduxStateV1): PersistedReduxStateV2 => ({
    ...state,
    characters: {
      ...state.characters,
      roamingMonsters: [],
    },
  }),
  3: (state: PersistedReduxStateV2): PersistedReduxStateV3 => ({
    ...state,
    encounters: {
      ...state.encounters,
      encounterWeights: defaultEncounterWeights,
    },
  }),
  4: (state: PersistedReduxStateV3): PersistedReduxStateV4 => ({
    ...state,
    leaderboard: defaultLeaderboardState,
    crown: crownDefaultState,
    commands: defaultCommandsState,
  }),
  5: (state: PersistedReduxStateV4): PersistedReduxStateV5 => ({
    ...state,
    commands: {
      ...state.commands,
      commandsUsed: {},
    },
  }),
  6: (state: PersistedReduxStateV5): PersistedReduxStateV6 => ({
    ...state,
    commands: {
      ...state.commands,
      userCommands: {},
    },
  }),
  7: (state: PersistedReduxStateV6): RootReducerState => ({
    ...state,
    leaderboard: {
      ...state.leaderboard,
      victoriesByCharacter: {},
    },
  }),
}

export const persistMigrate = createMigrate<MigrationState>(persistMigrations)
