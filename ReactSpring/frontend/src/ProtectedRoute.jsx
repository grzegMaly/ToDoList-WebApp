import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {me} from "./store/reducers/authReducers.js";
import {Navigate, useLocation} from "react-router-dom";

export const ProtectedRoute = ({children}) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const {user, isLoading} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(me());
    }, [dispatch]);

    if (isLoading) {
        return <div className={`p-6 text-center font-bold text-2xl`}>Checking session</div>
    }

    if (user?.id && user?.username && user?.roles.length > 0) {
        return children;
    }
    localStorage.removeItem("USER");
    return <Navigate to={"/login"} replace state={{from: location}}/>
}
