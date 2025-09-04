# Guía de Despliegue - DSG V2

## Estrategias de Despliegue

### 1. Despliegue en Servidor Dedicado

#### Preparación del Entorno

```bash
# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash dsgapp
sudo usermod -aG www-data dsgapp

# Crear directorios
sudo mkdir -p /var/www/dsg-v2
sudo chown dsgapp:www-data /var/www/dsg-v2
```

#### Configuración de Apache para Producción

```apache
<VirtualHost *:443>
    ServerName tu-dominio.com
    ServerAlias www.tu-dominio.com
    DocumentRoot /var/www/dsg-v2
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/tu-dominio.crt
    SSLCertificateKeyFile /etc/ssl/private/tu-dominio.key
    
    # Security Headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
    
    # Caching
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
        ExpiresByType application/font-woff "access plus 1 year"
        ExpiresByType application/font-woff2 "access plus 1 year"
    </IfModule>
    
    # Directory Security
    <Directory /var/www/dsg-v2>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Protect sensitive files
        <FilesMatch "\.(htaccess|htpasswd|ini|log|sh|sql|conf)$">
            Require all denied
        </FilesMatch>
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/dsg-v2_error.log
    CustomLog ${APACHE_LOG_DIR}/dsg-v2_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName tu-dominio.com
    ServerAlias www.tu-dominio.com
    Redirect permanent / https://tu-dominio.com/
</VirtualHost>
```

### 2. Despliegue con Docker

#### Dockerfile

```dockerfile
FROM nginx:alpine

# Copiar archivos de la aplicación
COPY . /usr/share/nginx/html

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  dsg-v2:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./logs:/var/log/nginx
    environment:
      - NGINX_HOST=tu-dominio.com
      - NGINX_PORT=80
    restart: unless-stopped
    
  # Opcional: Base de datos
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password_seguro
      MYSQL_DATABASE: dsg_v2
      MYSQL_USER: dsg_user
      MYSQL_PASSWORD: password_usuario
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  db_data:
```

#### Comandos de Despliegue

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Actualizar aplicación
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 3. Despliegue en CDN

#### Configuración para AWS CloudFront

```json
{
  "DistributionConfig": {
    "CallerReference": "dsg-v2-distribution",
    "Comment": "DSG V2 Static Site Distribution",
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-dsg-v2-bucket",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "managed-caching-optimized"
    },
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3-dsg-v2-bucket",
          "DomainName": "dsg-v2-bucket.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
  }
}
```

## Optimización para Producción

### 1. Minificación de Recursos

#### Script de Build

```bash
#!/bin/bash
# build.sh

echo "Iniciando proceso de build..."

# Crear directorio de distribución
mkdir -p dist

# Copiar archivos HTML
cp -r pages/ dist/
cp index.html dist/

# Minificar CSS
for file in assets/css/**/*.css; do
    npx clean-css-cli -o "dist/${file}" "${file}"
done

# Minificar JavaScript
for file in assets/js/**/*.js; do
    npx terser "${file}" -o "dist/${file}" --compress --mangle
done

# Optimizar imágenes
for file in assets/images/**/*.{jpg,jpeg,png}; do
    npx imagemin "${file}" --out-dir="dist/$(dirname "${file}")"
done

# Copiar otros recursos
cp -r assets/fonts/ dist/assets/
cp -r assets/data/ dist/assets/

echo "Build completado en directorio dist/"
```

### 2. Configuración de Cache

#### .htaccess para Apache

```apache
# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    
    # HTML files
    ExpiresByType text/html "access plus 1 hour"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    
    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # Fonts
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    
    # JSON Data
    ExpiresByType application/json "access plus 1 day"
ExpiresByType text/json "access plus 1 day"
</IfModule>

# Compression
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
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### 3. Monitoreo y Logs

#### Script de Monitoreo

```bash
#!/bin/bash
# monitor.sh

LOG_FILE="/var/log/dsg-v2/monitor.log"
ERROR_LOG="/var/log/apache2/dsg-v2_error.log"
ACCESS_LOG="/var/log/apache2/dsg-v2_access.log"

# Función para logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Verificar estado del servidor
if curl -f -s http://localhost > /dev/null; then
    log_message "INFO: Servidor respondiendo correctamente"
else
    log_message "ERROR: Servidor no responde"
    # Enviar alerta (email, Slack, etc.)
fi

# Verificar uso de disco
DISK_USAGE=$(df /var/www/dsg-v2 | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    log_message "WARNING: Uso de disco alto: ${DISK_USAGE}%"
fi

# Analizar logs de error
ERROR_COUNT=$(tail -n 100 $ERROR_LOG | grep "$(date '+%Y-%m-%d')" | wc -l)
if [ $ERROR_COUNT -gt 10 ]; then
    log_message "WARNING: Alto número de errores hoy: $ERROR_COUNT"
fi
```

## Estrategias de Backup

### 1. Backup Automático

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/dsg-v2"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/var/www/dsg-v2"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Crear backup comprimido
tar -czf "$BACKUP_DIR/dsg-v2_$DATE.tar.gz" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)"

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "dsg-v2_*.tar.gz" -mtime +7 -delete

echo "Backup completado: dsg-v2_$DATE.tar.gz"
```

### 2. Configurar Cron

```bash
# Editar crontab
crontab -e

# Agregar líneas:
# Backup diario a las 2:00 AM
0 2 * * * /path/to/backup.sh

# Monitoreo cada 5 minutos
*/5 * * * * /path/to/monitor.sh

# Limpiar logs semanalmente
0 3 * * 0 find /var/log/dsg-v2 -name "*.log" -mtime +30 -delete
```

## Rollback y Recuperación

### Procedimiento de Rollback

```bash
#!/bin/bash
# rollback.sh

if [ -z "$1" ]; then
    echo "Uso: $0 <archivo_backup>"
    echo "Backups disponibles:"
    ls -la /backup/dsg-v2/
    exit 1
fi

BACKUP_FILE="$1"
SOURCE_DIR="/var/www/dsg-v2"
BACKUP_CURRENT="/backup/dsg-v2/current_$(date +%Y%m%d_%H%M%S).tar.gz"

# Crear backup del estado actual
echo "Creando backup del estado actual..."
tar -czf "$BACKUP_CURRENT" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)"

# Detener servicios
echo "Deteniendo servicios..."
sudo systemctl stop apache2

# Restaurar backup
echo "Restaurando desde $BACKUP_FILE..."
rm -rf "$SOURCE_DIR"
tar -xzf "$BACKUP_FILE" -C "$(dirname $SOURCE_DIR)"

# Restaurar permisos
chown -R dsgapp:www-data "$SOURCE_DIR"
chmod -R 755 "$SOURCE_DIR"

# Reiniciar servicios
echo "Reiniciando servicios..."
sudo systemctl start apache2

echo "Rollback completado. Backup del estado anterior: $BACKUP_CURRENT"
```

## Checklist de Despliegue

### Pre-Despliegue
- [ ] Código probado en entorno de desarrollo
- [ ] Backup del entorno actual creado
- [ ] Certificados SSL válidos
- [ ] DNS configurado correctamente
- [ ] Recursos optimizados (minificados)
- [ ] Variables de entorno configuradas

### Durante el Despliegue
- [ ] Servicios detenidos correctamente
- [ ] Archivos copiados sin errores
- [ ] Permisos aplicados correctamente
- [ ] Base de datos migrada (si aplica)
- [ ] Configuración actualizada
- [ ] Servicios reiniciados

### Post-Despliegue
- [ ] Sitio web accesible
- [ ] Funcionalidades principales probadas
- [ ] Logs sin errores críticos
- [ ] Performance aceptable
- [ ] Monitoreo activado
- [ ] Backup post-despliegue creado

## Troubleshooting

### Problemas Comunes

**Error 500 después del despliegue**:
- Verificar logs de error del servidor
- Comprobar permisos de archivos
- Revisar configuración de virtual host

**Recursos no cargan (404)**:
- Verificar rutas en archivos HTML
- Comprobar estructura de directorios
- Revisar configuración de rewrite rules

**Performance lenta**:
- Verificar compresión habilitada
- Comprobar cache configurado
- Analizar tamaño de recursos
- Revisar configuración de CDN

### Comandos Útiles

```bash
# Verificar estado de Apache
sudo systemctl status apache2

# Verificar configuración de Apache
sudo apache2ctl configtest

# Ver logs en tiempo real
sudo tail -f /var/log/apache2/dsg-v2_error.log

# Verificar uso de recursos
htop
df -h
free -h

# Probar conectividad
curl -I http://tu-dominio.com
```