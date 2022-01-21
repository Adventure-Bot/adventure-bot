import { RootReducerState } from '@adventure-bot/store'
import { createMigrate } from 'redux-persist'
import { defaultEncounterWeights } from '@adventure-bot/store/slices/encounters'
import { defaultLeaderboardState } from '@adventure-bot/store/slices/leaderboard'
import { crownDefaultState } from '@adventure-bot/store/slices/crown'
import { defaultCommandsState } from '@adventure-bot/store/slices/commands'

/*
 * This is the current version and should match the latest version
 */
export const persistVersion = 4

/**
 * Here we use RootReducerState instead of ReduxState to avoid cyclical type references
 */
type PersistedReduxStateV4 = RootReducerState

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
}

export const persistMigrate = createMigrate<MigrationState>(persistMigrations)
