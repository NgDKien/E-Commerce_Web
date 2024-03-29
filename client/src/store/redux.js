import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productSlice from './products/productSlice';
import userSlice from './user/userSlice';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

const commonConfig = {
  key: "shop/user",
  storage,
}

const userConfig = {
  ...commonConfig,
  whitelist: ["isLoggedIn", "token", "current"],
}

// const productConfig = {
//   ...commonConfig,
//   whitelist: ["dealDaily"],
//   key: "shop/deal",
// }

export const store = configureStore({
  reducer: {
    app: appSlice,
    products: productSlice,
    user: persistReducer(userConfig, userSlice)
  },
  //Fix lỗi non-serializable trên tab console.log
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    }),
});

export const persistor = persistStore(store)
