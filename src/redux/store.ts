import { combineReducers, configureStore } from '@reduxjs/toolkit';
import boardReducer from '../redux/slices/boardSlice';
import { saveStateMiddleware } from './saveStateMiddleware';

const savedState = localStorage.getItem('reduxState');
const initialState: RootState | undefined = savedState
  ? JSON.parse(savedState)
  : undefined;

const rootReducer = combineReducers({
  board: boardReducer,
});

export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  middleware: [saveStateMiddleware],
  preloadedState: initialState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
