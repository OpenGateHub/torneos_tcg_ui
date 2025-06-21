import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export const useSession = () => {
    const { auth } = useContext(AuthContext);
    return {
        auth,
    };
};
