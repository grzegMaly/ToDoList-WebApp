import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import index from "./store/index.js";
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <Provider store={index}>
        <App/>
        <Toaster
            toastOptions={{
                position: "top-center",
                style: {
                    color: "white",
                    background: "#20b6d1"
                }
            }}
        />
    </Provider>,
)
