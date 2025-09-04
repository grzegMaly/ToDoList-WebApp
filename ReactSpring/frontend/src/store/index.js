import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";

const index = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
    devTools: true
});

export default index;