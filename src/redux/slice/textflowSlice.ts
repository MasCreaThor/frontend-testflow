// src/redux/textflowSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface Document {
  id: string;
  content: string;
}

interface TextflowState {
  documents: Document[];
  currentDocument: Document | null;
  isEditing: boolean;
  savedStatus: 'saved' | 'saving' | 'unsaved';
}

const initialState: TextflowState = {
  documents: [],
  currentDocument: null,
  isEditing: false,
  savedStatus: 'saved', // 'saved', 'saving', 'unsaved'
};

export const textflowSlice = createSlice({
  name: 'textflow',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    selectDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    updateDocument: (state, action) => {
      const { id, content } = action.payload;
      const docIndex = state.documents.findIndex(doc => doc.id === id);
      if (docIndex !== -1) {
        state.documents[docIndex].content = content;
        state.savedStatus = 'unsaved';
      }
    },
    setSavedStatus: (state, action) => {
      state.savedStatus = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
});

export const { 
  setDocuments, 
  addDocument, 
  selectDocument, 
  updateDocument,
  setSavedStatus,
  toggleEditMode
} = textflowSlice.actions;

export default textflowSlice.reducer;