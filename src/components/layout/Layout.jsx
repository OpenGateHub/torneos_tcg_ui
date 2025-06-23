import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <header>
                <Navbar />
            </header>
            <Outlet />
        </div>
    );
};

export default Layout;
