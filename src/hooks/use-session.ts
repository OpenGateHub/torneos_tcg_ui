import { QueryKeys } from "@/api/queryKeys";
import { getProfile } from "@/services/authService";
import { Session } from "@/types/profile.types";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
    const token = localStorage.getItem("auth_token");
    const query = useQuery<Session>({
        queryFn: () => getProfile(token),
        queryKey: [QueryKeys.PROFILE],
    });
    if (!Boolean(token)) {
        window.location.href = "/";
    }
    return {
        ...query,
    }
};
