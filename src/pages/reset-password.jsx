import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reestablecerPassword } from "@/services/authService";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [cargando, setCargando] = useState(false);

    const esFormularioValido = () => {
        return (
            nuevaContraseña === confirmarContraseña &&
            nuevaContraseña.length >= 8
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!esFormularioValido()) {
            toast.warning(
                "Las contraseñas no coinciden o son demasiado cortas."
            );
            return;
        }

        setCargando(true);
        try {
            await reestablecerPassword(token, nuevaContraseña);
            toast.success("Contraseña actualizada exitosamente");
            setTimeout(
                () =>
                    navigate("/login", {
                        state: { mensaje: "Contraseña actualizada" },
                    }),
                1500
            );
        } catch (error) {
            toast.error("Hubo un error al restablecer la contraseña");
            console.error("Error al restablecer contraseña:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Restablecer contraseña</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nueva Contraseña</Label>
                        <Input
                            type="password"
                            className="form-control"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="form-label">
                            Confirmar Contraseña
                        </Label>
                        <Input
                            type="password"
                            className="form-control"
                            value={confirmarContraseña}
                            onChange={(e) =>
                                setConfirmarContraseña(e.target.value)
                            }
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!esFormularioValido() || cargando}
                    >
                        {cargando ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

