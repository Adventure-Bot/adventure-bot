import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { TypedStartListening } from '@reduxjs/toolkit'

import type { ReduxState } from './'

const listenerMiddleware = createListenerMiddleware()

export const startAppListening =
  listenerMiddleware.startListening as TypedStartListening<ReduxState>
