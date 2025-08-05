import { useEffect, useState, useContext } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import {
    Edit,
    Mail,
    Calendar,
    Shield,
    User,
    Trophy,
    Target,
    Award,
    Settings,
    Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/use-session";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CreateFormStore } from "@/components/store/create_form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/api/queryKeys";
import { EditFormStore } from "@/components/store/edit_form";

export const Profile = () => {
    const navigate = useNavigate();
    const session = useSession();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [userData, setUserData] = useState({
        name: "Javier Mora",
        email: "javier@email.com",
        memberSince: "6/20/2025",
        role: "admin", // o "jugador"
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Entrenador Pokémon apasionado con más de 5 años de experiencia en torneos competitivos.",
        last_name: "",
        dni: "",
        provincia: "",
        fechaNacimiento: "",
    });
    const [companyData, setCompanyData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        coin_name: "",
    });

    const [showStoreQuestionModal, setShowStoreQuestionModal] = useState(false);
    const [showStoreInfoModal, setShowStoreInfoModal] = useState(false);
    const [showNoStoreModal, setShowNoStoreModal] = useState(false);
    const profileMutation = useMutation({
        mutationFn: async (userData) => {
            await axiosClient.put(
                apiUrls.users.mutation(session.data.usuario.id),
                {
                    show_is_company_modal: false,
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.PROFILE],
            });
            setShowNoStoreModal(false);
        },
    });

    const achievements = [
        {
            title: "Primer Torneo",
            description: "Completaste tu primer torneo",
            date: "Dic 2024",
        },
        {
            title: "Racha de 5",
            description: "Ganaste 5 partidas consecutivas",
            date: "Ene 2025",
        },
        {
            title: "Veterano",
            description: "Miembro por más de 6 meses",
            date: "Jun 2025",
        },
    ];

    const updateProfile = async (userData) => {
        try {
            const { data } = await axiosClient.put(
                apiUrls.users.mutation(userData.id),
                userData
            );
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleSave = () => {
        // Aquí iría la lógica para guardar los cambios
        setIsEditing(false);
        console.log("Guardando cambios:", userData);
        updateProfile(userData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Aquí podrías revertir los cambios si es necesario
    };

    const handleStoreYes = () => {
        setShowStoreQuestionModal(false);
        setShowStoreInfoModal(true);
    };
    const handleStoreNo = () => {
        setShowStoreQuestionModal(false);
        setShowNoStoreModal(true);
    };
    const handleDontShowAgain = () => {
        /// api call
        profileMutation.mutate();
    };

    useEffect(() => {
        const cargarPerfil = async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                setUserData({
                    avatar: "",
                    bio: "",
                    email: data.usuario.email,
                    name: data.usuario.nombre,
                    memberSince: data.usuario.createdAt,
                    role: data.usuario.rol,
                    id: data.usuario.id,
                    last_name: data.usuario.last_name,
                    dni: data.usuario.dni,
                    provincia: data.usuario.provincia,
                    birthdate: data.usuario.birthdate,
                });
                if (data?.usuario.show_is_company_modal) {
                    setShowStoreQuestionModal(true);
                }
            } catch (error) {
                console.error("Error al obtener perfil:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        cargarPerfil();
    }, [navigate]);

    useEffect(() => {
        try {
            if (!session.isLoading && session?.data?.user_company?.Company) {
                setCompanyData(session.data.user_company.Company);
            }
        } catch (error) {
            console.error("Error al cargar datos de company:", error);
            // Reseteamos companyData a un estado seguro
            setCompanyData({
                name: "",
                email: "",
                address: "",
                phone: "",
                coin_name: ""
            });
        }
    }, [session.data]);

    if (isLoading)
        return <p className="text-center mt-4">Cargando perfil...</p>;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header del Perfil */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                                        <AvatarImage
                                            src={
                                                userData.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={userData.name}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {userData.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!isEditing && (
                                        <Button
                                            size="sm"
                                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                        <h1 className="text-2xl md:text-3xl font-bold">
                                            {userData.name}
                                        </h1>
                                        <Badge
                                            variant={
                                                userData.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={`w-fit ${
                                                userData.role === "admin"
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                    : "bg-gradient-to-r from-blue-600 to-cyan-600"
                                            }`}
                                        >
                                            {userData.role === "admin" ? (
                                                <>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Administrador
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-3 h-3 mr-1" />
                                                    Jugador
                                                </>
                                            )}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{userData.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Miembro desde{" "}
                                                {userData.memberSince}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground max-w-2xl">
                                        {userData.bio}
                                    </p>
                                </div>
                                <div className="space-y-4 flex justify-between gap-4">
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Settings className="w-4 h-4" />
                                        Editar Perfil
                                    </Button>

                                    {!Boolean(
                                        session?.data?.user_company?.company
                                    ) && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setShowStoreInfoModal(true)
                                            }
                                        >
                                            <Settings className="w-4 h-4" />
                                            Tienda
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulario de Edición */}
                    {isEditing && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Editar Perfil</CardTitle>
                                <CardDescription>
                                    Actualiza tu información personal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            value={userData.name}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">
                                            Apellido
                                        </Label>
                                        <Input
                                            id="apellido"
                                            value={userData.last_name}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    last_name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dni">DNI</Label>
                                        <Input
                                            id="dni"
                                            value={userData.dni}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    dni: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="provincia">
                                            Provincia
                                        </Label>
                                        <Input
                                            id="provincia"
                                            value={userData.provincia}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    provincia: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fechaNacimiento">
                                            Fecha de Nacimiento
                                        </Label>
                                        <Input
                                            id="fechaNacimiento"
                                            type="date"
                                            value={userData.fechaNacimiento}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    fechaNacimiento:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    className="space-y-2"
                                    style={{
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={userData.role}
                                        onValueChange={(value) =>
                                            setUserData({
                                                ...userData,
                                                role: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jugador">
                                                Jugador
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Administrador
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biografía</Label>
                                    <textarea
                                        id="bio"
                                        className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                                        value={userData.bio}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                bio: e.target.value,
                                            })
                                        }
                                        placeholder="Cuéntanos sobre ti..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button onClick={handleSave}>
                                        Guardar Cambios
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Estadísticas */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg">
                                            <stat.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div> */}

                    {/* Información Detallada */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Información Personal */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Nombre Completo
                                    </span>
                                    <span className="font-medium">
                                        {userData.name}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Email
                                    </span>
                                    <span className="font-medium">
                                        {userData.email}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Rol
                                    </span>
                                    <Badge
                                        variant={
                                            userData.role === "admin"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {userData.role === "admin"
                                            ? "Administrador"
                                            : "Jugador"}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Miembro desde
                                    </span>
                                    <span className="font-medium">
                                        {userData.memberSince}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Provincia
                                    </span>
                                    <span className="font-medium">
                                        {userData.provincia}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        DNI
                                    </span>
                                    <span className="font-medium">
                                        {userData.dni}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logros */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ultimos resultados</CardTitle>
                                <CardDescription>
                                    Tus últimos resultados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {achievements.map((achievement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Award className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {achievement.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Información de la tienda</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {companyData?.name ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">
                                                Nombre
                                            </span>
                                            <span className="font-medium">
                                                {companyData?.name}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">
                                                Email
                                            </span>
                                            <span className="font-medium">
                                                {companyData?.email}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">
                                                Moneda
                                            </span>
                                            <Badge>{companyData?.coin_name}</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">
                                                Dirección
                                            </span>
                                            <span className="font-medium">
                                                {companyData?.address}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <div className="mb-4">
                                            <Store className="h-12 w-12 mx-auto text-gray-300" />
                                        </div>
                                        <p className="text-lg font-medium mb-2">No hay tienda asociada</p>
                                        <p className="text-sm">
                                            {session?.data?.user_company?.company 
                                                ? "Los datos de la tienda no están disponibles en este momento."
                                                : "Aún no tienes una tienda asociada a tu cuenta."
                                            }
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            {companyData?.name && (
                                <CardFooter>
                                    <Button
                                        onClick={() =>
                                            setShowEditCompanyModal(true)
                                        }
                                    >
                                        Editar
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Store Question Modal */}
            <Dialog
                open={showStoreQuestionModal}
                onOpenChange={setShowStoreQuestionModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eres una tienda?</DialogTitle>
                        <DialogDescription>
                            Por favor, indícanos si eres una tienda.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button onClick={handleStoreYes}>Sí</Button>
                        <Button variant="outline" onClick={handleStoreNo}>
                            No
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Store Info Modal */}
            <Dialog
                open={showStoreInfoModal}
                onOpenChange={setShowStoreInfoModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Registrar Información de la Tienda
                        </DialogTitle>
                        <CreateFormStore
                            form_id={"create_store_form"}
                            onSuccess={() => {
                                setShowStoreInfoModal(false);
                            }}
                        />
                    </DialogHeader>
                    {/* Aquí puedes agregar el formulario para registrar la tienda */}
                    <DialogFooter>
                        <Button type="submit" form="create_store_form">
                            Registrar
                        </Button>
                        <Button
                            onClick={() => setShowStoreInfoModal(false)}
                            variant="outline"
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* No Store Modal */}
            <Dialog open={showNoStoreModal} onOpenChange={setShowNoStoreModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>No eres una tienda</DialogTitle>
                        <DialogDescription>
                            ¿Quieres que no te mostremos este mensaje
                            nuevamente?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                        <Button onClick={handleDontShowAgain}>
                            Sí, no mostrar más
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowNoStoreModal(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT COMPANY MODAL */}

            <Dialog
                open={showEditCompanyModal}
                onOpenChange={setShowEditCompanyModal}
            >
                <DialogTitle>Edit tienda</DialogTitle>
                <DialogContent>
                    <DialogHeader>Editar tienda</DialogHeader>
                    <EditFormStore
                        form_id="edit_store_form"
                        onSuccess={() => {
                            // hide dialog
                            setShowEditCompanyModal(false);
                        }}
                        store={companyData}
                    />

                    <DialogFooter>
                        <Button form="edit_store_form" type="submit">
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Profile;
