import { useState } from "react";
import { toast } from "react-toastify";
import { solicitarTokenRecuperacion } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OlvidePassword = () => {
    const [email, setEmail] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            await solicitarTokenRecuperacion({ email });
            toast.success(
                "Revisa tu correo para continuar con la recuperación."
            );
        } catch (error) {
            console.error(error);
            toast.error(
                "No pudimos enviar el email. ¿Estás seguro que esa cuenta existe?"
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Recuperar contraseña
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}  className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="tu correo electronico"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cargando}
                        >
                            {cargando ? "Enviando..." : "Enviar instrucciones"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default OlvidePassword;
