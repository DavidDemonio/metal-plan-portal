
#!/bin/bash

# Script de instalación para MetalScale
# Este script configura el entorno y despliega la aplicación

echo "===================================="
echo "    Instalación de MetalScale"
echo "===================================="

# Verificar si es root
if [ "$EUID" -ne 0 ]
  then echo "Este script debe ejecutarse como root o con sudo"
  exit 1
fi

# Solicitar información de la base de datos MySQL
echo "Configuración de la base de datos MySQL:"
read -p "Nombre de la base de datos: " DB_NAME
read -p "Usuario de MySQL: " DB_USER
read -p "Contraseña de MySQL: " DB_PASSWORD
read -p "Host de MySQL (por defecto 'localhost'): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

# Generar clave secreta para JWT
JWT_SECRET=$(openssl rand -hex 32)

# Verificar si existe la base de datos
echo "Verificando conexión a MySQL..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "Error: No se pudo conectar a MySQL o crear la base de datos."
    echo "Por favor, verifique las credenciales e intente nuevamente."
    exit 1
fi

echo "Base de datos verificada correctamente."

# Crear archivo .env
echo "Configurando variables de entorno..."
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
EOF

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Compilar la aplicación frontend
echo "Compilando aplicación frontend..."
npm run build

# Configurar servicios
echo "Configurando servicio systemd..."
cat > /etc/systemd/system/metalscale.service << EOF
[Unit]
Description=MetalScale Server
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(which node) server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd, habilitar y arrancar el servicio
echo "Iniciando servicio..."
systemctl daemon-reload
systemctl enable metalscale
systemctl start metalscale

if [ $? -ne 0 ]; then
    echo "Error: No se pudo iniciar el servicio."
    exit 1
fi

# Mostrar información final
echo ""
echo "===================================="
echo "  Instalación completada con éxito"
echo "===================================="
echo ""
echo "La aplicación está funcionando en:"
echo "http://localhost:3000"
echo ""
echo "Para acceder por primera vez, visite:"
echo "http://localhost:3000/login"
echo ""
echo "Se le pedirá crear una cuenta de administrador."
echo ""
echo "Para verificar el estado del servicio:"
echo "systemctl status metalscale"
echo ""
