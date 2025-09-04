# Imágenes para la Aplicación Móvil

## Estructura de Carpetas
- `/icons/` - Iconos de características de la aplicación
- `/screenshots/` - Capturas de pantalla de la aplicación

## Especificaciones Técnicas

### Iconos Flotantes
- **Tamaño**: 80x80px (2x para pantallas de alta densidad)
- **Formato**: PNG con transparencia
- **Estilo**: En línea con la paleta blanco y negro, con un toque de color sutil si es necesario
- **Iconos necesarios**:
  1. `icon-catalogo.png` - Para el catálogo de productos
  2. `icon-pedidos.png` - Para el seguimiento de pedidos
  3. `icon-ofertas.png` - Para ofertas exclusivas

### Capturas de Pantalla
- **Tamaño**:
  - Versión grande: 300x600px (para escritorio)
  - Versión móvil: 200x400px (para dispositivos móviles)
- **Formato**: PNG o JPG de alta calidad
- **Contenido**:
  - `app-preview.png` - Vista previa principal de la app
  - `app-preview-mobile.png` - Versión optimizada para móviles

## Recomendaciones de Diseño
- Mantener la coherencia con la paleta de colores blanco y negro
- Usar sombras sutiles para dar profundidad
- Asegurar que el texto sea legible en todos los fondos
- Optimizar imágenes para web sin perder calidad

## Cómo Agregar Nuevas Imágenes
1. Colocar los archivos en la carpeta correspondiente
2. Actualizar las referencias en `app_movil.html` si es necesario
3. Optimizar las imágenes usando herramientas como TinyPNG antes de subirlas
