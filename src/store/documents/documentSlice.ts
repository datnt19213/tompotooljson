import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "./type";

interface IDocumentSlice {
  activeDocument: IDocument | null;
  documentName: string;
  uid: string;
}

const initialState: IDocumentSlice = {
  activeDocument: null,
  documentName: "",
  uid: "",
};

export const DocumentSlice = createSlice({
  name: "documentSlice",
  initialState,
  reducers: {
    setActiveDocument: (
      state,
      action: {
        payload: IDocument;
      }
    ) => {
      state.activeDocument = action.payload;
    },
    setDocumentName: (state, action) => {
      state.documentName = action.payload;
    },
    setUID: (state, action) => {
      state.uid = action.payload;
    },
  },
});

export const { setActiveDocument, setDocumentName, setUID } = DocumentSlice.actions;

export default DocumentSlice.reducer;
