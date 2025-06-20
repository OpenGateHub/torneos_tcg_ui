// src/App.jsx
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./router";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRouter />
                <ToastContainer position="top-center" autoClose={3000} />
            </AuthProvider>
        </BrowserRouter>
    );
} 

export default App;
