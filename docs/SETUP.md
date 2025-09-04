# Guía de Instalación - DSG V2

## Requisitos del Sistema

### Requisitos Mínimos
- **Servidor Web**: Apache 2.4+ o Nginx 1.18+
- **PHP**: 7.4+ (si se requiere backend)
- **Base de Datos**: MySQL 5.7+ o PostgreSQL 12+
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Requisitos Recomendados
- **RAM**: 4GB mínimo, 8GB recomendado
- **Almacenamiento**: 2GB espacio libre
- **Conexión**: Banda ancha para funcionalidades en tiempo real

## Instalación Local

### Paso 1: Descarga del Proyecto

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/dsg-v2.git
cd dsg-v2
```

### Paso 2: Configuración del Servidor Web

#### Opción A: Apache

1. Copia el proyecto a tu directorio web:
```bash
cp -r dsg-v2/ /var/www/html/
```

2. Configura el Virtual Host:
```apache
<VirtualHost *:80>
    ServerName dsg-v2.local
    DocumentRoot /var/www/html/dsg-v2
    
    <Directory /var/www/html/dsg-v2>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/dsg-v2_error.log
    CustomLog ${APACHE_LOG_DIR}/dsg-v2_access.log combined
</VirtualHost>
```

#### Opción B: Nginx

```nginx
server {
    listen 80;
    server_name dsg-v2.local;
    root /var/www/html/dsg-v2;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Paso 3: Configuración de Base de Datos (Opcional)

Si planeas integrar con backend:

```sql
-- Crear base de datos
CREATE DATABASE dsg_v2;

-- Crear usuario
CREATE USER 'dsg_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON dsg_v2.* TO 'dsg_user'@'localhost';
FLUSH PRIVILEGES;
```

### Paso 4: Configuración de Archivos

1. **Configurar rutas en config/app.js**:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost/dsg-v2/api',
    ASSETS_URL: 'http://localhost/dsg-v2/assets',
    DEBUG: true
};
```

2. **Verificar permisos de archivos**:
```bash
chmod -R 755 assets/
chmod -R 644 assets/css/
chmod -R 644 assets/js/
```

## Instalación en Servidor de Producción

### Paso 1: Preparación del Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install apache2 mysql-server php libapache2-mod-php

# Habilitar módulos necesarios
sudo a2enmod rewrite
sudo a2enmod ssl
```

### Paso 2: Configuración SSL

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache

# Obtener certificado SSL
sudo certbot --apache -d tu-dominio.com
```

### Paso 3: Optimización

1. **Compresión Gzip**:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

2. **Cache de navegador**:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
</IfModule>
```

## Verificación de Instalación

### Lista de Verificación

- [ ] Servidor web funcionando
- [ ] Archivos copiados correctamente
- [ ] Permisos configurados
- [ ] Virtual host configurado
- [ ] DNS/hosts configurado
- [ ] SSL configurado (producción)
- [ ] Base de datos conectada (si aplica)

### Pruebas Funcionales

1. **Acceso a página principal**:
   - Visita `http://tu-dominio.com`
   - Verifica que carga correctamente

2. **Prueba de dashboards**:
   - Accede a `/pages/admin-dashboard/admin-dashboard.html`
   - Accede a `/pages/client-dashboard/dashboard.html`

3. **Prueba de recursos**:
   - Verifica que CSS se carga correctamente
   - Verifica que JavaScript funciona
   - Verifica que imágenes se muestran

## Solución de Problemas

### Problemas Comunes

**Error 404 en recursos**:
- Verificar rutas en archivos HTML
- Comprobar permisos de archivos
- Revisar configuración del servidor

**JavaScript no funciona**:
- Abrir consola del navegador
- Verificar errores de sintaxis
- Comprobar rutas de archivos JS

**CSS no se aplica**:
- Verificar rutas en archivos HTML
- Comprobar sintaxis CSS
- Revisar cache del navegador

### Logs Útiles

- **Apache**: `/var/log/apache2/error.log`
- **Nginx**: `/var/log/nginx/error.log`
- **Navegador**: Consola de desarrollador (F12)

## Siguiente Paso

Una vez completada la instalación, consulta `DEPLOYMENT.md` para configuraciones avanzadas de despliegue.