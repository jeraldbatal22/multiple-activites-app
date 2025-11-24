import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { I_TODO_STATE } from "@/types";

const initialState: any = {
  todos: [],
  selectedTodo: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setSelectedTodo: (state, action: PayloadAction<I_TODO_STATE | null>) => {
      state.selectedTodo = action.payload;
    },
    setTodos: (state, action: PayloadAction<I_TODO_STATE[]>) => {
      state.todos = action.payload;
    },
  },
});

export const { setSelectedTodo, setTodos } = todoSlice.actions;

export default todoSlice.reducer;
