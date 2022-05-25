import { Action, createAction, createSlice } from '@reduxjs/toolkit'
import { values } from 'remeda'

type ScheduledAction<T extends Action> = {
  id: string
  date: number
  action: T
}

export const actionScheduled = createAction<ScheduledAction<Action>>(
  'schedule/action_scheduled'
)

export const scheduledActionDispatched = createAction<ScheduledAction<Action>>(
  'schedule/action_dispatched'
)

const byId: { [id: string]: ScheduledAction<Action> } = {}
const queue: ScheduledAction<Action>[] = []

const initialState = {
  byId,
  queue,
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionScheduled, (state, { payload }) => {
        state.byId[payload.id] = payload
        state.queue = values(state.byId).sort((a, b) =>
          a.date > b.date ? 1 : -1
        )
      })
      .addCase(scheduledActionDispatched, (state, { payload }) => {
        delete state.byId[payload.id]
        state.queue = state.queue.filter((event) => event.id !== payload.id)
      })
  },
})

export default scheduleSlice.reducer
