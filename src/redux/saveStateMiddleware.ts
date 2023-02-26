import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './store';

export const saveStateMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    return result;
  };
