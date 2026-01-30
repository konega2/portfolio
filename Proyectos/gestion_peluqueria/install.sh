#!/bin/bash

echo "🚀 Instalando Sistema de Gestión de Peluquería..."
echo ""

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Error: Node.js no está instalado."
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Instalar dependencias del servidor
echo "📦 Instalando dependencias del servidor..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del servidor"
    exit 1
fi

echo "✅ Dependencias del servidor instaladas"
echo ""

# Instalar dependencias del cliente
echo "📦 Instalando dependencias del cliente..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del cliente"
    exit 1
fi

cd ..
echo "✅ Dependencias del cliente instaladas"
echo ""

echo "🎉 ¡Instalación completada!"
echo ""
echo "Para iniciar la aplicación ejecuta:"
echo "  npm run dev"
echo ""
echo "Usuarios de prueba:"
echo "  Admin: admin / admin123"
echo "  Empleado: empleado1 / empleado123"
echo ""
