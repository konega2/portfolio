#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║      💇 Sistema de Gestión para Peluquerías 💇              ║"
echo "║                                                               ║"
echo "║              ¡Primer inicio del sistema!                      ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "📥 Descárgalo desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Verificar si hay dependencias instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del servidor..."
    npm install
    echo ""
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependencias del cliente..."
    cd client
    npm install
    cd ..
    echo ""
fi

echo "✅ Dependencias instaladas"
echo ""
echo "🚀 Iniciando el sistema..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📱 Frontend:  http://localhost:3000"
echo "  🖥️  Backend:   http://localhost:5000"
echo ""
echo "  👤 Usuario:   admin"
echo "  🔑 Password:  admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Consejos:"
echo "   • El sistema incluye datos de demostración"
echo "   • Puedes instalar la app en tu móvil (PWA)"
echo "   • Lee GUIA_USUARIO.md para más información"
echo ""
echo "⚠️  Presiona Ctrl+C para detener el servidor"
echo ""
sleep 3

npm run dev
