import { createSlice } from "@reduxjs/toolkit";
import Papa from "papaparse";

const DATA_FEED_PREFIX = "csv";

export type DataFeed = {
  csv: string;
  dataFeed: unknown[];
  dataFeedTemplatePreviewImages: string[];
  dataFeedVariables: string[];
  loading: boolean;
};

const initialDataFeed: DataFeed = {
  csv: "",
  dataFeed: [],
  loading: false,
  dataFeedTemplatePreviewImages: [],
  dataFeedVariables: ["price", "sale_price", "title", "description"],
};

export const dataFeedSlice = createSlice({
  name: DATA_FEED_PREFIX,
  initialState: initialDataFeed,
  reducers: {
    setCSV(state, action) {
      state.csv = action.payload;
    },
    parseCSV(state, action) {
      state.dataFeed = action.payload;
    },
    addPreviewImage(state, action) {
      state.dataFeedTemplatePreviewImages.push(...action.payload);
      console.log(state.dataFeedTemplatePreviewImages);
    },
    clearPreviewImages(state) {
      state.dataFeedTemplatePreviewImages = [];
    },
  },
});

const dataFeedReducer = dataFeedSlice.reducer;
export const dataFeedAction = dataFeedSlice.actions;
export default dataFeedReducer;
