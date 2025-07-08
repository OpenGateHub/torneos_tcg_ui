import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";
import { QueryKeys } from "@/api/queryKeys";
import { useSession } from "@/hooks/use-session";
import { CompanyType } from "@/types/profile.types";

type Props = {
    form_id: string;
    onSuccess: () => void;
    store: CompanyType;
};

export const EditFormStore = ({ form_id, onSuccess, store }: Props) => {
    const session = useSession();
    const [storeData, setStoreData] = useState(store);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const { data } = await axiosClient.put(
                apiUrls.store.mutation(store.id),
                {
                    ...storeData,
                    userId: session.data.usuario.id,
                }
            );
            return data;
        },
        onSuccess: () => {
            onSuccess();
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.PROFILE],
            });
        },
    });
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate();
    };
    return (
        <form id={form_id} onSubmit={onSubmit}>
            {" "}
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la Tienda</Label>
                    <Input
                        id="name"
                        value={storeData.name}
                        onChange={(e) =>
                            setStoreData({
                                ...storeData,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea
                        id="address"
                        value={storeData.address}
                        onChange={(e) =>
                            setStoreData({
                                ...storeData,
                                address: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact">Contacto</Label>
                    <Input
                        id="contact"
                        value={storeData.email}
                        onChange={(e) =>
                            setStoreData({
                                ...storeData,
                                email: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="coinName">Nombre de la Coin</Label>
                    <Input
                        id="coinName"
                        value={storeData.coin_name}
                        onChange={(e) =>
                            setStoreData({
                                ...storeData,
                                coin_name: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
        </form>
    );
};
