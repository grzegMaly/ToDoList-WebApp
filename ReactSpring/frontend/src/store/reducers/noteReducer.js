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
            const response = api.get("/lists", {withCredentials: true});
            return fulfillWithValue(response)
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const createNote = createAsyncThunk(
    "notes/",
    async (noteData, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = api.post("/lists", noteData, {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const updateNote = createAsyncThunk(
    "notes/",
    async ({toDoId, done}, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = api.patch(`/lists/${toDoId}`, done, {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
export const deleteNote = createAsyncThunk(
    "notes/",
    async ({toDoId}, {
        rejectWithValue,
        fulfillWithValue
    }) => {
        try {
            const response = api.delete(`/lists/${toDoId}`, {withCredentials: true});
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
    extraReducers: builder => {}
});

export const {messageClear} = authReducer.actions;
export default noteReducer.reducer;