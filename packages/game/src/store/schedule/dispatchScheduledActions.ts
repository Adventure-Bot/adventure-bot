import store from '@adventure-bot/game/store'
import { scheduledActionDispatched } from '@adventure-bot/game/store/schedule/schedule'

export const dispatchScheduledActions: () => void = () => {
  setInterval(() => {
    let event
    do {
      event = store.getState().schedule.eventsByTime[0]
      if (!event) return
      store.dispatch(event.event)
      store.dispatch(scheduledActionDispatched(event))
    } while (event)
  }, 10000)
}
