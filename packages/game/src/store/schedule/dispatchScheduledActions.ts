import store from '@adventure-bot/game/store'
import { scheduledActionDispatched } from '@adventure-bot/game/store/schedule/schedule'

export const dispatchScheduledActions: () => void = () => {
  setInterval(() => {
    let scheduled
    do {
      scheduled = store.getState().schedule.queue[0]
      if (!scheduled) break
      if (Date.now() < scheduled.date) break
      store.dispatch(scheduled.action)
      store.dispatch(scheduledActionDispatched(scheduled))
    } while (scheduled)
  }, 1000)
}
