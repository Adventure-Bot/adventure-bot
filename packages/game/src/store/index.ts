import remoteReduxEnhancer from '@redux-devtools/remote'
import { configureStore } from '@reduxjs/toolkit'
import { PERSIST, REHYDRATE, persistReducer, persistStore } from 'redux-persist'

import * as actionCreators from '@adventure-bot/store/actions'
import { persistMigrate, persistVersion } from '@adventure-bot/store/migrations'
import rootReducer from '@adventure-bot/store/reducers'
import { disk } from '@adventure-bot/store/storage'

const enhancers = []

if (process.env.REDUX_DEVTOOLS_ENABLED === 'true') {
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
        ignoredActions: [PERSIST, REHYDRATE],
      },
    }),
})

// ts-prune-ignore-next
export const persistor = persistStore(store)

export default store

export type ReduxState = ReturnType<typeof store.getState>
export type RootReducerState = ReturnType<typeof rootReducer>
