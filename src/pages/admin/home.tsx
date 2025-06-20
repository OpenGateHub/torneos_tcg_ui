import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const AdminHomePage = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Ligas Activas</CardTitle>
                        <CardDescription>
                            Total de ligas en curso
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Torneos</CardTitle>
                        <CardDescription>Torneos programados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios</CardTitle>
                        <CardDescription>
                            Total de usuarios registrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                    </CardContent>
                </Card>
            </div>

            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Bienvenido al Panel de Control
                </h2>
                <p className="text-muted-foreground">
                    Selecciona una opción del menú lateral para comenzar a
                    gestionar ligas, torneos y usuarios.
                </p>
            </div>
        </div>
    );
};
