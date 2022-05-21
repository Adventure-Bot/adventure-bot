import { createAction } from '@reduxjs/toolkit'
import { GuildChannel } from 'discord.js'

export const characterListCreated = createAction<GuildChannel>(
  'characterListCreated'
)
