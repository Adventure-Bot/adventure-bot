import remoteReduxEnhancer from '@redux-devtools/remote'
import { configureStore } from '@reduxjs/toolkit'
import { PERSIST, REHYDRATE, persistReducer, persistStore } from 'redux-persist'

import {
  characterMessageCreated,
  commandUsed,
} from '@adventure-bot/game/store/actions'
import * as actionCreators from '@adventure-bot/game/store/actions'
import { listenerMiddleware } from '@adventure-bot/game/store/listenerMiddleware'
import {
  persistMigrate,
  persistVersion,
} from '@adventure-bot/game/store/migrations'
import rootReducer from '@adventure-bot/game/store/reducers'
import { itemPurchased } from '@adventure-bot/game/store/slices/shop'
import { disk } from '@adventure-bot/game/store/storage'

const enhancers = []

if (process.env.REDUX_DEVTOOLS_ENABLED === 'true') {
  console.log('redux-devtools enabled')
  enhancers.push(
    remoteReduxEnhancer({
      name:
        'Adventure Bot' +
        (process.env.NODE_ENV === 'development'
          ? ' (development)'
          : ' (production)'),
      realtime: true,
      hostname: 'localhost',
      port: 5010,
      actionCreators,
    })
  )
} else {
  console.log('redux-devtools disabled')
}

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: disk,
    version: persistVersion,
    migrate: persistMigrate,
  },
  rootReducer
)

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  enhancers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          PERSIST,
          REHYDRATE,
          ...[commandUsed, itemPurchased, characterMessageCreated].map((x) =>
            x.toString()
          ),
        ],
      },
    }).prepend(listenerMiddleware.middleware),
})

// ts-prune-ignore-next
export const persistor = persistStore(store)

export default store

export type ReduxState = ReturnType<typeof store.getState>
export type RootReducerState = ReturnType<typeof rootReducer>
