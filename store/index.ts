import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';

// Importar los reducers
import authReducer from './authSlice'; // Reducer de autenticación
import conectividadReducer from './conectividadSlice';
import mantenimientoReducer from './mantenimientoSlice';
import strReducer from './strSlice';

// Combinamos todos los reducers
const rootReducer = combineReducers({
  auth: authReducer, // Reducer para la autenticación
  str: strReducer,
  conectividad: conectividadReducer,
  mantenimiento: mantenimientoReducer,
});

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'str', 'conectividad', 'mantenimiento'], // Reducers a persistir
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
