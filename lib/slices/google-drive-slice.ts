import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GoogleDriveFile {
  id: string;
  user_id: string;
  title: string;
  google_drive_photo_url: string | null;
  created_at: string;
}

interface GoogleDriveState {
  files: GoogleDriveFile[];
  selectedFile: GoogleDriveFile | null;
}

const initialState: GoogleDriveState = {
  files: [],
  selectedFile: null,
};

const googleDriveSlice = createSlice({
  name: "googleDrive",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<GoogleDriveFile[]>) => {
      state.files = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<GoogleDriveFile | null>) => {
      state.selectedFile = action.payload;
    },
    addFile: (state, action: PayloadAction<GoogleDriveFile>) => {
      state.files.push(action.payload);
    },
    removeFileById: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      if (state.selectedFile?.id === action.payload) {
        state.selectedFile = null;
      }
    },
  },
});

export const { setFiles, setSelectedFile, addFile, removeFileById } = googleDriveSlice.actions;

export default googleDriveSlice.reducer;
