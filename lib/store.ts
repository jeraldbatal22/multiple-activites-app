import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/auth-slice";
import todoSlice from "./slices/todo-slice";
import googleDriveSlice from "./slices/google-drive-slice";
import foodReviewSlice from "./slices/food-review-slice";
import pokemonSlice from "./slices/pokemon-review-slice";
import markDownNoteSlice from "./slices/mark-down-note-slice";

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  todo: todoSlice,
  googleDrive: googleDriveSlice,
  foodReview: foodReviewSlice,
  markDownNote: markDownNoteSlice,
  pokemon: pokemonSlice,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Attach store to axios lazily to avoid circular imports
// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
