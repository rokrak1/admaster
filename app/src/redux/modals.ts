import { createSlice } from "@reduxjs/toolkit";

export const MODALS_PREFIX = "modals";

export type Modals = {
  modal: string;
  modalData?: any;
};

const initialModals: Modals = {
  modal: "",
  modalData: null,
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
    setModalAndData(state, action) {
      state.modalData = action.payload.modalData;
      state.modal = action.payload.modal;
    },
  },
});

const modalsReducer = modalsSlice.reducer;
export const modalsAction = modalsSlice.actions;
export default modalsReducer;
