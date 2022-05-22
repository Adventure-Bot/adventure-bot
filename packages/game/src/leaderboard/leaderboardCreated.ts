import { createAction } from '@reduxjs/toolkit'
import { TextChannel } from 'discord.js'

export const leaderboardCreated =
  createAction<TextChannel>('leaderboardCreated')
