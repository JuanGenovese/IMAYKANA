#!/bin/bash

# ==============================================================================
# Script de Automatización de Base de Datos - IMAYKANA
# ==============================================================================

# Detener el script ante cualquier error
set -e

# Cargar las variables de entorno desde el archivo .env si existe
if [ -f .env ]; then
  # exportar variables ignorando comentarios y líneas vacías
  export $(grep -v '^#' .env | xargs)
fi

# Definir el entorno (prioridad: argumento de línea de comandos > .env > dev)
ENTORNO=${1:-$NEXT_PUBLIC_ENTORNO}
ENTORNO=${ENTORNO:-dev}

# Normalizar a minúsculas
ENTORNO=$(echo "$ENTORNO" | tr '[:upper:]' '[:lower:]')

# Validar que el entorno sea uno de los válidos
if [[ ! "$ENTORNO" =~ ^(local|dev|prod)$ ]]; then
  echo "❌ Error: Entorno '$ENTORNO' no válido. Use 'local', 'dev' o 'prod'."
  exit 1
fi

echo "=================================================================="
echo "🚀 INICIANDO ACTUALIZACIÓN DE BASE DE DATOS - IMAYKANA"
echo "=================================================================="
echo "📍 Entorno seleccionado: $ENTORNO"

# Exportar para que drizzle.config.ts y baseline_migrations.js lo detecten
export NEXT_PUBLIC_ENTORNO="$ENTORNO"

# Mostrar URL de conexión (con contraseña oculta para seguridad)
case "$ENTORNO" in
  local)
    DB_URL="$DATABASE_LOCAL_URL"
    ;;
  dev)
    DB_URL="$DATABASE_DEV_URL"
    ;;
  prod)
    DB_URL="$DATABASE_PROD_URL"
    ;;
esac

if [ -z "$DB_URL" ]; then
  echo "❌ Error: No se encontró una cadena de conexión para el entorno '$ENTORNO' en el archivo .env."
  exit 1
fi

# Ocultar credenciales de la consola
DB_URL_MASKED=$(echo "$DB_URL" | sed -E 's/:([^@:]+)@/:******@/g')
echo "🔌 Conectando a: $DB_URL_MASKED"

echo "------------------------------------------------------------------"
echo "📦 Ejecutando migraciones de Drizzle..."
npm run db:migrate

echo "=================================================================="
echo "✅ ACTUALIZACIÓN FINALIZADA CON ÉXITO"
echo "=================================================================="
