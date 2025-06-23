"use client"

import { useState } from "react"
import { Menu, X, Trophy, Users, Calendar, Zap, Play, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: Trophy,
      title: "Torneos Competitivos",
      description: "Participa en torneos oficiales y comunitarios con premios increíbles",
    },
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Conecta con miles de entrenadores de todo el mundo",
    },
    {
      icon: Calendar,
      title: "Eventos Regulares",
      description: "Nuevos torneos cada semana con diferentes formatos y reglas",
    },
    {
      icon: Zap,
      title: "Emparejamiento Inteligente",
      description: "Sistema avanzado que te empareja con rivales de tu nivel",
    },
  ]

  const stats = [
    { number: "50K+", label: "Entrenadores Activos" },
    { number: "1,200+", label: "Torneos Completados" },
    { number: "₡2M+", label: "En Premios Otorgados" },
    { number: "4.9★", label: "Calificación de Usuarios" },
  ]

  const steps = [
    {
      step: "1",
      title: "Regístrate",
      description: "Crea tu cuenta de entrenador en menos de 2 minutos",
    },
    {
      step: "2",
      title: "Construye tu Deck",
      description: "Importa o construye tu mazo favorito con nuestro editor",
    },
    {
      step: "3",
      title: "Únete a Torneos",
      description: "Encuentra el torneo perfecto para tu nivel y formato",
    },
    {
      step: "4",
      title: "¡Compite y Gana!",
      description: "Demuestra tus habilidades y gana premios increíbles",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
                PokéTournaments
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Características
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Cómo Funciona
              </a>
              <a href="#tournaments" className="text-gray-600 hover:text-blue-600 transition-colors">
                Torneos
              </a>
              <Button variant="outline" className="mr-2">
                Iniciar Sesión
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
                Registrarse
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Características
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Cómo Funciona
                </a>
                <a href="#tournaments" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Torneos
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline">Iniciar Sesión</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">Registrarse</Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border-blue-200">
          🎉 ¡Nuevo torneo semanal disponible!
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-600 bg-clip-text text-transparent">
          Conviértete en el
          <br />
          <span className="text-5xl md:text-7xl">Maestro Pokémon</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Únete a la plataforma de torneos de cartas Pokémon más grande del mundo. Compite, mejora tus habilidades y
          gana premios increíbles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-lg px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Comenzar Ahora
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3">
            Ver Torneos Activos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir PokéTournaments?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma más completa para competir en torneos de cartas Pokémon
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comenzar es súper fácil, solo sigue estos simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para ser el próximo campeón?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de entrenadores que ya están compitiendo por la gloria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              <Trophy className="w-5 h-5 mr-2" />
              Crear Cuenta Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
            >
              Ver Torneos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PokéTournaments</span>
              </div>
              <p className="text-gray-400">La plataforma líder en torneos de cartas Pokémon</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Torneos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rankings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Premios
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reglas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PokéTournaments. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
