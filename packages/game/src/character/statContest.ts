import { createAction } from '@reduxjs/toolkit'

import { Stat } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { d } from '@adventure-bot/game/utils'

export const statContested = createAction<StatContest>('statContested')

export function statContest(
  character: CharacterWithStats,
  stat: Stat,
  difficulty: number
): StatContest {
  const check = d(20)
  const modifier = character.statsModified[stat]
  const contest: StatContest = {
    character,
    stat,
    difficulty,
    check,
    modifier,
  }
  store.dispatch(statContested(contest))
  return contest
}

export type StatContest = {
  character: CharacterWithStats
  stat: Stat
  modifier: number
  difficulty: number
  check: number
}
