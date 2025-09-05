import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authReducer} from "./authReducers.js";
import {api} from "../../utils/api.js";

export const getNotes = createAsyncThunk(
    "notes/getNotes",
    async (_, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = await api.get("/lists", {withCredentials: true});
            return fulfillWithValue(response)
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const createNote = createAsyncThunk(
    "notes/createNote",
    async (noteData, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = await api.post("/lists", noteData, {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const updateNote = createAsyncThunk(
    "notes/updateNote",
    async ({toDoId, done}, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = await api.patch(`/lists/${toDoId}`, {done}, {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const deleteNote = createAsyncThunk(
    "notes/deleteNote",
    async ({toDoId}, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = await api.delete(`/lists/${toDoId}`, {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

export const noteReducer = createSlice({
    name: "notes",
    initialState: {
        errorMessage: '',
        successMessage: '',
        notes: JSON.parse(localStorage.getItem("LIST")) || []
    },
    reducers: {
        messageClear: state => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getNotes.fulfilled, (state, {payload}) => {
                state.notes = payload.data;
            })
            .addCase(createNote.fulfilled, (state, {payload}) => {
                state.notes.push(payload.data);
                localStorage.setItem("LIST", JSON.stringify(state.notes));
            })
            .addCase(updateNote.fulfilled, (state, {payload}) => {
                const note = state.notes.find(n => n.toDoId === payload.data.toDoId);
                if (note) {
                    note.done = payload.data.done;
                    localStorage.setItem("LIST", JSON.stringify(state.notes));
                }
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                const {toDoId} = action.meta.arg;
                state.notes = state.notes.filter(n => n.toDoId !== toDoId);
                localStorage.setItem("LIST", JSON.stringify(state.notes));
            })
    }
});

export const {messageClear} = authReducer.actions;
export default noteReducer.reducer;