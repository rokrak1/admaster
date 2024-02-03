import { createSlice } from "@reduxjs/toolkit";

export const POPUP_PREFIX = "modals";

export type Popup = {
  x: number;
  y: number;

  visible: boolean;
};

const initialModals: Popup = {
  x: 0,
  y: 0,
  visible: false,
};

export const popupSlice = createSlice({
  name: POPUP_PREFIX,
  initialState: initialModals,
  reducers: {
    setPopup(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.visible = action.payload.visible;
    },
    hidePopup(state) {
      state.visible = false;
    },
  },
});

const popupReducer = popupSlice.reducer;
export const popupAction = popupSlice.actions;
export default popupReducer;
