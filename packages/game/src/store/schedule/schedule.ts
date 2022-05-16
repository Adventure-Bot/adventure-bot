import { Action, createAction, createSlice } from '@reduxjs/toolkit'

type ScheduledAction<T extends Action> = {
  id: string
  date: number
  event: T
}

export const actionScheduled = createAction<ScheduledAction<Action>>(
  'schedule/action_scheduled'
)

export const scheduledActionDispatched = createAction<ScheduledAction<Action>>(
  'schedule/action_dispatched'
)

const eventsById: { [id: string]: ScheduledAction<Action> } = {}
const eventsByTime: ScheduledAction<Action>[] = []

const initialState = {
  eventsById,
  eventsByTime,
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionScheduled, (state, { payload }) => {
        state.eventsById[payload.id] = payload
        state.eventsByTime = [...state.eventsByTime, payload].sort((a, b) =>
          a.date > b.date ? 1 : -1
        )
      })
      .addCase(scheduledActionDispatched, (state, { payload }) => {
        delete state.eventsById[payload.id]
        state.eventsByTime = state.eventsByTime.filter(
          (event) => event.id !== payload.id
        )
      })
  },
})

export default scheduleSlice.reducer
