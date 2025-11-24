import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { I_TODO_STATE } from "@/types";

// You may want to rename I_TODO_STATE to something more descriptive like I_MARKDOWN_NOTE in your types, 
// but using it here to match the rest of your codebase for now.

const initialState: any = {
  notes: [],
  selectedNote: null,
};

const markDownNoteSlice = createSlice({
  name: "markDownNote",
  initialState,
  reducers: {
    setSelectedNote: (state, action: PayloadAction<I_TODO_STATE | null>) => {
      state.selectedNote = action.payload;
    },
    setNotes: (state, action: PayloadAction<I_TODO_STATE[]>) => {
      state.notes = action.payload;
    },
  },
});

export const { setSelectedNote, setNotes } = markDownNoteSlice.actions;

export default markDownNoteSlice.reducer;
