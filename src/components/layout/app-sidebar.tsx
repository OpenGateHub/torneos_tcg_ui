import {
    Link,
    Trophy,
    Users,
    User,
    Settings,
    LayoutDashboard,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";

// Opciones del menú
const menuItems = [
    {
        title: "Inicio",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Ligas",
        url: "/admin/ligas",
        icon: Link,
    },
    {
        title: "Torneos",
        url: "/admin/torneos",
        icon: Trophy,
    },
    {
        title: "Usuarios",
        url: "/admin/usuarios",
        icon: Users,
    },
    {
        title: "Información del Perfil",
        url: "/admin/perfil",
        icon: User,
    },
];

export function AppSidebar() {
    const session = useSession();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Settings className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                            Panel de Control
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Gestión de Torneos
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <RouterLink
                                            to={item.url}
                                            className="flex items-center gap-3"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </RouterLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={
                                session?.data?.usuario?.createdAt ||
                                "/placeholder.svg"
                            }
                            alt={session?.data?.usuario?.nombre}
                        />
                        <AvatarFallback>
                            {session?.data?.usuario.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                            {session?.data?.usuario.nombre}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground truncate">
                                {session?.data?.usuario?.email}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="px-2 pb-2">
                    <Badge
                        variant="secondary"
                        className="w-full justify-center"
                    >
                        {session?.data?.usuario.rol === "admin"
                            ? "Administrador"
                            : "Jugador"}
                    </Badge>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
