import type React from "react";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import { loginUsuario } from "@/services/authService";

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { token } = await loginUsuario(formData);

            login(token); // ← Esta es la clave: actualizamos el contexto y redirige desde ahí
            toast.success("¡Bienvenido de nuevo! 👋");
            // No hace falta navigate('/perfil'), el contexto ya lo hace si querés, o podés mantenerlo acá si querés ir directo
            navigate("/perfil");
        } catch (error) {
            console.error("Error en login:", error);

            const mensaje =
                error.response.data.mensaje ||
                "Error desconocido. Intenta nuevamente.";
            const mensajeNormalizado = mensaje
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            if (mensajeNormalizado.includes("confirmar tu cuenta")) {
                toast.warning(
                    "Debes confirmar tu correo electrónico antes de iniciar sesión."
                );
            } else {
                toast.error("Credenciales incorrectas o cuenta inexistente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-5">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-center">
                    Ingresa tus credenciales para acceder
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 pr-10"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to={"/crear-cuenta"}
                            className="p-0 h-auto font-semibold"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
