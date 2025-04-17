import { configureStore } from '@reduxjs/toolkit';

import authReducer from './services/authSlice';
import employeeReducer from './services/employeeSlice';
import corporateReducer from './services/corporateSlice';

const combineReducer = {
  auth: authReducer,
  corporates: corporateReducer,
  employee: employeeReducer,
};

export const store = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
