import { createSlice } from "@reduxjs/toolkit";

export const MODALS_PREFIX = "modals";

export type Modals = {
  modal: string;
};

const initialModals: Modals = {
  modal: "",
};

export const modalsSlice = createSlice({
  name: MODALS_PREFIX,
  initialState: initialModals,
  reducers: {
    setModal(state, action) {
      state.modal = action.payload;
    },
    clearModal(state) {
      state.modal = "";
    },
  },
});

const modalsReducer = modalsSlice.reducer;
export const modalsAction = modalsSlice.actions;
export default modalsReducer;
