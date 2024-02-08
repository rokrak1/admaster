import { IUser } from "@/context/auth.context";
import { createSlice } from "@reduxjs/toolkit";

export const DATA_PREFIX = "data";

interface CustomerTemplate {
  id: string;
  created_at: Date;
  customer_id?: string | null;
  name?: string | null;
  template?: any | null;
  thumbnail?: string | null;
  group?: string | null;
  parent_group?: string | null;
  sequance: string;
}

export type DataSlice = {
  templates: CustomerTemplate[];
};

const initalDataSlice: DataSlice = {
  templates: [] as CustomerTemplate[],
};

export const dataSlice = createSlice({
  name: DATA_PREFIX,
  initialState: initalDataSlice,
  reducers: {
    initializeTemplates(state) {
      let templates = localStorage.getItem("templates");
      state.templates = templates ? JSON.parse(templates) : [];
    },
    setTemplates(state, action) {
      state.templates = action.payload;
      localStorage.setItem("templates", JSON.stringify(action.payload));
    },
    addTemplate(state, action) {
      state.templates.push(action.payload);
      let templates = localStorage.getItem("templates");
      if (templates) {
        let templatesArray = JSON.parse(templates);
        templatesArray.push(action.payload);
        localStorage.setItem("templates", JSON.stringify(templatesArray));
      }
      localStorage.setItem("templates", JSON.stringify(state.templates));
    },
    removeTemplate(state, action) {
      state.templates = state.templates.filter(
        (template) => template.id !== action.payload.id
      );
      localStorage.setItem("templates", JSON.stringify(state.templates));
    },
    updateTemplate(state, action) {
      const index = state.templates.findIndex(
        (template) => template.id === action.payload.id
      );
      state.templates[index] = action.payload;
      localStorage.setItem("templates", JSON.stringify(state.templates));
    },
  },
});

const dataReducer = dataSlice.reducer;
export const dataActions = dataSlice.actions;
export default dataReducer;
