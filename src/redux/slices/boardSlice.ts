import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

interface BoardSliceState {
  columns: Column[];
}

const initialState: BoardSliceState = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' },
        { id: 'task-3', title: 'Task 3' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { id: 'task-4', title: 'Task 4' },
        { id: 'task-5', title: 'Task 5' },
        { id: 'task-6', title: 'Task 6' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 'task-7', title: 'Task 7' },
        { id: 'task-8', title: 'Task 8' },
        { id: 'task-9', title: 'Task 9' },
      ],
    },
  ],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    deleteTask: (
      state,
      action: PayloadAction<{ taskId: string; columnId: string }>
    ) => {
      const { taskId, columnId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks = column.tasks.filter((task) => task.id !== taskId);
      }
    },
    editTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        columnId: string;
        newTitle: string;
      }>
    ) => {
      const { taskId, columnId, newTitle } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) {
          task.title = newTitle;
        }
      }
    },
    addTask: (
      state,
      action: PayloadAction<{ columnId: string; task: Task }>
    ) => {
      const { columnId, task } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks.push(task);
      }
    },
  },
});

export const { updateBoard, deleteTask, editTask, addTask } =
  boardSlice.actions;

export default boardSlice.reducer;
