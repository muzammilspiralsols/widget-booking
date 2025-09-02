# Manual de Integración HTML

## Cómo insertar el widget en cualquier web

### 1. Integración Básica

Para integrar el widget en tu página web, simplemente incluye los siguientes elementos:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Hotel</title>
    
    <!-- Incluir CSS del widget -->
    <link rel="stylesheet" href="https://cdn.miwidget.com/widget.css">
</head>
<body>
    <!-- Tu contenido web -->
    <h1>Bienvenido a nuestro hotel</h1>
    
    <!-- Widget de búsqueda -->
    <div id="widget-search" data-hotel-id="12345"></div>
    
    <!-- Incluir JavaScript del widget -->
    <script type="module" src="https://cdn.miwidget.com/widget.js"></script>
</body>
</html>
```

### 2. Integración Avanzada

Para configuraciones más complejas:

```html
<div id="widget-search" 
     data-hotel-id="12345"
     data-type="chain"
     data-layout="inline"
     data-theme="light"
     data-locale="es"
     data-currency="EUR"
     data-show-promo-code="true"
     data-show-hotel-selector="true"
     data-external-url="https://www.miweb.com/buscar"
     data-api-url="https://api.miweb.com">
</div>
```

### 3. Personalización de Estilos

#### Colores Personalizados

```html
<style>
:root {
  --primary-color: #e74c3c;
  --text-color: #2c3e50;
  --background: #ecf0f1;
  --border-color: #bdc3c7;
  --text-size: 14px;
  --font-family: "Helvetica Neue", Arial, sans-serif;
}
</style>
<link rel="stylesheet" href="https://cdn.miwidget.com/widget.css">
```

#### Tema Oscuro

```html
<div id="widget-search" 
     data-hotel-id="12345"
     data-theme="dark">
</div>
```

### 4. Control Programático

#### Actualizar Datos del Widget

```html
<script>
// Esperar a que el widget se cargue
document.addEventListener('DOMContentLoaded', function() {
    // Obtener instancia del widget
    const widget = window.getWidgetInstance('widget-search');
    
    // Actualizar datos
    widget.updateData({
        idHotel: 'hotel-456',
        promoCode: 'VERANO2024',
        openCalendar: true,
        checkIn: '15-08-2024',
        checkOut: '20-08-2024'
    });
});
</script>
```

#### Añadir Parámetros a la URL

```html
<script>
const widget = window.getWidgetInstance('widget-search');
widget.updateParams({
    'il_like': 'DBL',
    'source': 'widget',
    'campaign': 'verano2024'
});
</script>
```

### 5. Ejemplos de Integración

#### WordPress

```php
// En tu archivo functions.php
function add_booking_widget() {
    wp_enqueue_style('booking-widget', 'https://cdn.miwidget.com/widget.css');
    wp_enqueue_script('booking-widget', 'https://cdn.miwidget.com/widget.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'add_booking_widget');

// En tu template
echo '<div id="widget-search" data-hotel-id="' . get_option('hotel_id') . '"></div>';
```

#### React

```jsx
import React, { useEffect } from 'react';

function BookingWidget() {
    useEffect(() => {
        // Cargar CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.miwidget.com/widget.css';
        document.head.appendChild(link);

        // Cargar JS
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://cdn.miwidget.com/widget.js';
        document.body.appendChild(script);

        return () => {
            // Cleanup
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    return <div id="widget-search" data-hotel-id="12345" />;
}
```

#### Vue.js

```vue
<template>
  <div id="widget-search" :data-hotel-id="hotelId"></div>
</template>

<script>
export default {
  data() {
    return {
      hotelId: '12345'
    }
  },
  mounted() {
    // Cargar recursos del widget
    this.loadWidgetResources();
  },
  methods: {
    loadWidgetResources() {
      // CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.miwidget.com/widget.css';
      document.head.appendChild(link);

      // JS
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://cdn.miwidget.com/widget.js';
      document.body.appendChild(script);
    }
  }
}
</script>
```

### 6. Configuraciones Específicas

#### Para Cadenas Hoteleras

```html
<div id="widget-search" 
     data-hotel-id="all-hotels"
     data-type="chain"
     data-show-hotel-selector="true"
     data-external-url="https://www.micadena.com/buscar">
</div>
```

#### Para Hoteles Individuales

```html
<div id="widget-search" 
     data-hotel-id="hotel-123"
     data-type="hotel"
     data-external-url="https://www.mihotel.com/reservar">
</div>
```

#### Con Verificación de Disponibilidad

```html
<div id="widget-search" 
     data-hotel-id="12345"
     data-api-url="https://api.miweb.com"
     data-external-url="https://www.miweb.com/buscar">
</div>
```

### 7. Solución de Problemas

#### El widget no aparece

1. Verifica que el CSS y JS se carguen correctamente
2. Asegúrate de que el elemento tenga un ID único
3. Comprueba la consola del navegador para errores

#### Los estilos no se aplican

1. Verifica que el CSS se cargue antes que el JS
2. Comprueba que no haya conflictos con otros estilos
3. Usa las variables CSS personalizadas

#### El widget no responde

1. Verifica que el JavaScript se cargue correctamente
2. Asegúrate de usar `type="module"` en el script
3. Comprueba la consola para errores de JavaScript

### 8. Mejores Prácticas

1. **Carga Asíncrona**: Carga el widget de forma asíncrona para no bloquear la página
2. **IDs Únicos**: Usa IDs únicos para múltiples widgets en la misma página
3. **Responsive**: El widget es responsive por defecto, no añadas estilos que lo rompan
4. **Accesibilidad**: El widget cumple WCAG 2.1 AA, mantén la accesibilidad de tu página
5. **Testing**: Prueba en diferentes navegadores y dispositivos

### 9. Soporte

Para soporte técnico o preguntas sobre la integración:

- **Email**: soporte@miwidget.com
- **Documentación**: https://docs.miwidget.com
- **GitHub**: https://github.com/miwidget/booking-widget
