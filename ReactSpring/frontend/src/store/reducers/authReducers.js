import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../utils/api.js";

export const login = createAsyncThunk(
    "auth/login",
    async (loginInfo, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.post("/auth/public/login", loginInfo);
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data)
        }
    });
export const registerUser = createAsyncThunk(
    "auth/register",
    async (registerInfo, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.post("/auth/public/register", registerInfo);
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data)
        }
    }
);
export const me = createAsyncThunk(
    "auth/me",
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.get("/auth/me", {withCredentials: true});
            return fulfillWithValue(response);
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

export const authReducer = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("USER")) || {
            id: null,
            username: null,
            roles: null
        },
        isLoading: false,
        errorMessage: '',
        successMessage: '',
    },
    reducers: {
        messageClear: state => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, {payload}) => {
                state.successMessage = payload.data.message;
                state.user = payload.data.data;
                state.isLoading = false;
                localStorage.setItem("USER", JSON.stringify(state.user));
            })
            .addCase(login.rejected, (state, {payload}) => {
                state.errorMessage = payload.message;
                state.isLoading = false;
                console.log("rejected:", payload)
            })
            .addCase(registerUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, {payload}) => {
                state.successMessage = payload.data.message;
                state.user = payload.data.data;
                state.isLoading = false;
                localStorage.setItem("USER", JSON.stringify(state.user));
            })
            .addCase(registerUser.rejected, (state, {payload}) => {
                state.errorMessage = payload.message;
                state.isLoading = false;
            })
            .addCase(me.pending, state => {
                state.isLoading = true;
            })
            .addCase(me.fulfilled, (state, {payload}) => {
                state.user = payload.data
                localStorage.setItem("USER", JSON.stringify(state.user))
                state.isLoading = false;
            })
            .addCase(me.rejected, (state, {payload}) => {
                state.errorMessage = payload.message;
                state.isLoading = false;
                localStorage.removeItem("USER");
            })
    }
});

export const {messageClear}  = authReducer.actions;
export default authReducer.reducer;