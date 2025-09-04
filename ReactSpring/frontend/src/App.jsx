import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {WelcomePage} from "./pages/WelcomePage.jsx";
import {RegisterPage} from "./pages/RegisterPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {NotFoundPage} from "./pages/NotFoundPage.jsx";
import {ToDoListPage} from "./pages/ToDoListPage.jsx";
import {ProtectedRoute} from "./ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<WelcomePage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>
                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/todo-list"} element={<ProtectedRoute><ToDoListPage/></ProtectedRoute>}/>
                <Route path={"/*"} element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    )
}

export default App
