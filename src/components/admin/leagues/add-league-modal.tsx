import { apiUrls } from "@/api/apiUrls";
import { QueryKeys } from "@/api/queryKeys";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@/hooks/use-form";
import { useSession } from "@/hooks/use-session";
import axiosClient from "@/services/axios";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export const AddLeagueModal = ({
    onClose,
    open,
}: {
    onClose: () => void;
    open: boolean;
}) => {
    const session = useSession();
    const queryClient = useQueryClient();
    const { formData, getFieldProps } = useForm({
        name: "",
        description: "",
        companyId: session?.data?.user_company?.company,
        startDate: "",
        endDate: "",
    });

    const companyId = session?.data?.user_company.company;

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            await axiosClient.post(apiUrls.leagues.base, {
                ...formData,
                companyId,
            });
        },
        onSuccess(data, variables, context) {
            onClose();
            Swal.fire({
                icon: "success",
                title: "Liga registrada",
                text: "La liga se registró correctamente",
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.LEAGUE_LIST]
            })
        },
    });
    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(formData);
    };
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent aria-describedby="add-league-description">
                <DialogHeader>
                    <DialogTitle>Registrar torneo</DialogTitle>
                </DialogHeader>
                <form
                    id="add-league-form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                            placeholder="Nombre de la liga"
                            {...getFieldProps("name")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha Inicio</Label>
                        <Input type="date" {...getFieldProps("startDate")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha Fin</Label>
                        <Input type="date" {...getFieldProps("endDate")} />
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" form="add-league-form">
                        Registrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
