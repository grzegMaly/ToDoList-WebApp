import authReducer from "./reducers/authReducers.js";
import noteReducer from "./reducers/noteReducer.js";

const rootReducer = {
    auth: authReducer,
    notes: noteReducer
}

export default rootReducer;