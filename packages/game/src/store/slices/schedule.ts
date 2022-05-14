import { createAction, createSlice } from '@reduxjs/toolkit'

type ScheduledEvent = {
  id: string
  due: number
  event: unknown
}

const eventAdded = createAction<ScheduledEvent>('schedule/event_added')

const eventsById: { [id: string]: ScheduledEvent } = {}

const initialState = {
  eventsById,
}

/**
 * The schedule slice allows for promises that survive beyond process restart
 */
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(eventAdded, (state, { payload }) => {
      state.eventsById[payload.id] = payload
    })
  },
})

export default scheduleSlice.reducer
