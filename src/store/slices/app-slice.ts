import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  notificationsEnabled: boolean;
  activeTimerTaskId: string | null;
};

const initialState: AppState = {
  notificationsEnabled: false,
  activeTimerTaskId: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    setActiveTimerTaskId(state, action: PayloadAction<string | null>) {
      state.activeTimerTaskId = action.payload;
    },
  },
});

export const { setNotificationsEnabled, setActiveTimerTaskId } = appSlice.actions;
export const appReducer = appSlice.reducer;
