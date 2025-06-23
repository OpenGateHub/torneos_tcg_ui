import { QueryKeys } from "@/api/queryKeys";
import { getProfile } from "@/services/authService";
import { ProfileType } from "@/types/profile.types";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
    const token = localStorage.getItem("auth_token");
    const query = useQuery<{
        usuario: ProfileType;
    }>({
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
