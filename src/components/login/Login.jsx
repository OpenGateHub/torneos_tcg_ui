import { useState, useContext } from "react";
import { loginUsuario } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { EyeOpen } from "../icons/eye-open";
import { EyeOff } from "../icons/eye-off";
import { toast } from "react-toastify";

const Login = () => {
    const { login } = useContext(AuthContext); // ← Usamos la función login del contexto
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const esFormularioValido = () => {
        return email.includes("@") && password.length >= 8;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const { token } = await loginUsuario({ email, password });

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
            setCargando(false);
        }
    };

    return (
        <div className="container-sm py-5">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        <input
                            type={showPassword ? "text" : 'password'}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            style={{
                                position: "absolute",
                                top: 5,
                                right: 4,
                            }}
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOpen /> : <EyeOff />}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!esFormularioValido() || cargando}
                >
                    {cargando ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            Ingresando...
                        </>
                    ) : (
                        "Ingresar"
                    )}
                </button>
                <div className="mt-3">
                    <p className="text-muted">
                        ¿Olvidaste tu contraseña?{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0 align-baseline"
                            onClick={() => navigate("/olvide-password")}
                        >
                            Recuperar acceso
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
