import { createSlice } from "@reduxjs/toolkit";

export const CONFIG_PREFIX = "config";

export type Config = {
  model: any;
};

const initialModals: Config = {
  model: null,
};

export const configSlice = createSlice({
  name: CONFIG_PREFIX,
  initialState: initialModals,
  reducers: {
    setModel(state, action) {
      state.model = action.payload.visible;
    },
  },
});

const configReducer = configSlice.reducer;
export const configAction = configSlice.actions;
export default configReducer;
