import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import type { TypedAddListener, TypedStartListening } from '@reduxjs/toolkit'

import type { ReduxState } from './'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening =
  listenerMiddleware.startListening as TypedStartListening<ReduxState>
export const addAppListener = addListener as TypedAddListener<ReduxState>
