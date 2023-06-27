import { createAction } from '@reduxjs/toolkit'

import { Stat } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { d } from '@adventure-bot/game/utils'

type StatContest = {
  character: CharacterWithStats
  stat: Stat
  modifier: number
  difficulty: number
  check: number
  success: boolean
  secret: boolean
  successText: string
  failureText: string
}

export function statContest({
  character,
  stat,
  difficulty,
  secret = false,
  successText = 'succeeded!',
  failureText = 'failed!',
}: {
  character: CharacterWithStats
  stat: Stat
  difficulty: number
  secret?: boolean
  successText?: string
  failureText?: string
}): StatContest {
  const check = d(20)
  const modifier = character.statsModified[stat]
  const contest: StatContest = {
    character,
    stat,
    difficulty,
    check,
    modifier,
    success: check + modifier >= difficulty,
    secret,
    failureText,
    successText,
  }
  store.dispatch(statContested(contest))
  return contest
}

export const statContested = createAction<StatContest>('statContested')
