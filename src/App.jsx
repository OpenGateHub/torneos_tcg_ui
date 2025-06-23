// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./router";
const queryClient = new QueryClient();
function App() {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AppRouter />
                    <ToastContainer position="top-right" autoClose={3000} />
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
