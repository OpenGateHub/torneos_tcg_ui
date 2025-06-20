import { Link, Trophy, Users, User, Settings } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo del usuario logueado
const currentUser = {
  name: "Juan Pérez",
  email: "juan@example.com",
  role: "Administrador",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Opciones del menú
const menuItems = [
  {
    title: "Ligas",
    url: "/ligas",
    icon: Link,
  },
  {
    title: "Torneos",
    url: "/torneos",
    icon: Trophy,
  },
  {
    title: "Usuarios",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Información del Perfil",
    url: "/perfil",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Panel de Control</span>
            <span className="text-xs text-muted-foreground">Gestión de Torneos</span>
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
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{currentUser.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate">{currentUser.email}</span>
            </div>
          </div>
        </div>
        <div className="px-2 pb-2">
          <Badge variant="secondary" className="w-full justify-center">
            {currentUser.role}
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
