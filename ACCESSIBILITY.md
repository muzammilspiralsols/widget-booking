# Documentación de Accesibilidad - WCAG 2.1 AA

## Cumplimiento de Estándares

El widget de reservas cumple con los estándares **WCAG 2.1 nivel AA** para accesibilidad web.

## Atributos ARIA Implementados

### 1. Navegación y Estructura

```html
<!-- Contenedor principal -->
<div class="widget-search-container" 
     role="search" 
     aria-label="Hotel booking search form">

<!-- Formulario -->
<form class="widget-form" 
      role="search" 
      aria-label="Hotel booking form">
```

### 2. Campos de Entrada

```html
<!-- Selector de hotel -->
<button class="field-trigger" 
        aria-haspopup="listbox" 
        aria-expanded="false" 
        aria-labelledby="hotel-label">
    <span class="field-value" aria-live="polite">Select hotel</span>
</button>

<!-- Selector de fechas -->
<button class="field-trigger" 
        aria-haspopup="dialog" 
        aria-expanded="false" 
        aria-labelledby="dates-label">
    <span class="field-value" aria-live="polite">Select dates</span>
</button>

<!-- Selector de ocupación -->
<button class="field-trigger" 
        aria-haspopup="dialog" 
        aria-expanded="false" 
        aria-labelledby="occupancy-label">
    <span class="field-value" aria-live="polite">2 adults, 0 children</span>
</button>

<!-- Código promocional -->
<input type="text" 
       class="promo-input" 
       aria-label="Promotional code" 
       placeholder="Promo code">
```

### 3. Dropdowns y Popups

```html
<!-- Dropdown de hoteles -->
<div class="field-dropdown" 
     role="listbox" 
     aria-labelledby="hotel-label">

<!-- Opciones de hotel -->
<div class="hotel-option" 
     role="option" 
     aria-selected="false" 
     tabindex="0">
    Hotel Name
</div>

<!-- Calendario -->
<div class="calendar-container" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="calendar-title">
    <h3 id="calendar-title">Select dates</h3>
</div>

<!-- Selector de ocupación -->
<div class="occupancy-dropdown" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="occupancy-title">
    <h3 id="occupancy-title">Select occupancy</h3>
</div>
```

### 4. Botones y Controles

```html
<!-- Botón de búsqueda -->
<button class="search-btn" 
        type="submit" 
        aria-label="Search for available rooms">
    Search
</button>

<!-- Botón de cerrar modal -->
<button class="widget-modal-close" 
        aria-label="Close search modal">
    ×
</button>

<!-- Controles de incremento/decremento -->
<button class="guest-control" 
        aria-label="Increase number of adults" 
        type="button">
    +
</button>
<button class="guest-control" 
        aria-label="Decrease number of adults" 
        type="button">
    -
</button>
```

### 5. Estados y Feedback

```html
<!-- Mensajes de error -->
<div class="error-message" 
     role="alert" 
     aria-live="assertive">
    Please select check-in and check-out dates
</div>

<!-- Estados de carga -->
<button class="search-btn loading" 
        aria-label="Searching for available rooms" 
        disabled>
    Searching...
</button>

<!-- Indicadores de estado -->
<span class="field-value" 
      aria-live="polite" 
      aria-atomic="true">
    2 adults, 1 child
</span>
```

## Características de Accesibilidad

### 1. Navegación por Teclado

- **Tab**: Navegación secuencial entre elementos
- **Enter/Space**: Activación de botones y enlaces
- **Escape**: Cierre de modales y dropdowns
- **Flechas**: Navegación en listas y calendarios
- **Home/End**: Navegación rápida en listas

### 2. Lectores de Pantalla

- **Estructura semántica**: Uso correcto de roles ARIA
- **Etiquetas descriptivas**: Labels y aria-label apropiados
- **Estados dinámicos**: aria-expanded, aria-selected, aria-live
- **Feedback inmediato**: Mensajes de error y confirmación

### 3. Contraste de Colores

- **Ratio mínimo**: 4.5:1 para texto normal
- **Ratio mínimo**: 3:1 para texto grande
- **Estados de foco**: Contraste mejorado para elementos interactivos
- **Modo oscuro**: Alternativa con contraste adecuado

### 4. Tamaño de Objetivos

- **Área mínima**: 44x44 píxeles para elementos interactivos
- **Espaciado**: Separación adecuada entre elementos
- **Responsive**: Adaptación a diferentes tamaños de pantalla

## Pruebas Realizadas

### 1. Herramientas de Testing

- **axe-core**: Análisis automático de accesibilidad
- **WAVE**: Evaluación visual de accesibilidad
- **Lighthouse**: Auditoría de accesibilidad
- **NVDA**: Pruebas con lector de pantalla
- **JAWS**: Pruebas con lector de pantalla
- **VoiceOver**: Pruebas en macOS/iOS

### 2. Navegadores Probados

- **Chrome**: 60+ (Windows, macOS, Android)
- **Safari**: 12+ (macOS, iOS)
- **Firefox**: 55+ (Windows, macOS, Android)
- **Edge**: 79+ (Windows)

### 3. Dispositivos Probados

- **Desktop**: Windows, macOS, Linux
- **Tablet**: iPad, Android tablets
- **Mobile**: iPhone, Android phones
- **Assistive Technology**: Lectores de pantalla, navegación por teclado

## Casos de Uso Específicos

### 1. Usuario con Discapacidad Visual

```html
<!-- Ejemplo de uso con lector de pantalla -->
<div class="widget-search-container" 
     role="search" 
     aria-label="Hotel booking search form">
    
    <!-- El lector anunciará: "Hotel booking search form, search landmark" -->
    <form class="widget-form" role="search">
        
        <!-- El lector anunciará: "Select hotel, button, collapsed" -->
        <button class="field-trigger" 
                aria-haspopup="listbox" 
                aria-expanded="false">
            <span class="field-value" aria-live="polite">Select hotel</span>
        </button>
    </form>
</div>
```

### 2. Usuario con Discapacidad Motora

- **Navegación por teclado**: Todos los elementos son accesibles sin mouse
- **Tamaño de objetivos**: Botones y controles de tamaño adecuado
- **Tiempo de respuesta**: Sin límites de tiempo estrictos
- **Alternativas de entrada**: Soporte para tecnologías asistivas

### 3. Usuario con Discapacidad Cognitiva

- **Instrucciones claras**: Texto descriptivo y ayuda contextual
- **Feedback inmediato**: Mensajes de error claros y útiles
- **Consistencia**: Comportamiento predecible en toda la interfaz
- **Simplificación**: Flujo de usuario intuitivo y directo

## Mejores Prácticas Implementadas

### 1. Estructura Semántica

```html
<!-- Uso correcto de elementos semánticos -->
<main role="main">
    <section role="search" aria-label="Hotel booking">
        <form role="search">
            <fieldset>
                <legend>Search criteria</legend>
                <!-- Campos del formulario -->
            </fieldset>
        </form>
    </section>
</main>
```

### 2. Gestión de Foco

```javascript
// Ejemplo de gestión de foco en modales
function openModal() {
    // Guardar elemento con foco
    this.previousActiveElement = document.activeElement;
    
    // Abrir modal
    this.modal.show();
    
    // Mover foco al modal
    this.modal.querySelector('[tabindex="0"]').focus();
    
    // Atrapar foco dentro del modal
    this.trapFocus();
}

function closeModal() {
    // Cerrar modal
    this.modal.hide();
    
    // Restaurar foco
    if (this.previousActiveElement) {
        this.previousActiveElement.focus();
    }
}
```

### 3. Feedback Visual y Auditivo

```css
/* Indicadores de foco visibles */
.field-trigger:focus {
    outline: 2px solid var(--widget-cl-focus);
    outline-offset: 2px;
}

/* Estados de error */
.error-message {
    color: var(--widget-cl-error);
    font-weight: bold;
}

/* Estados de éxito */
.success-message {
    color: var(--widget-cl-success);
}
```

## Recursos Adicionales

### 1. Documentación WCAG

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/)

### 2. Herramientas de Testing

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### 3. Lectores de Pantalla

- [NVDA (Windows)](https://www.nvaccess.org/)
- [JAWS (Windows)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS/iOS)](https://www.apple.com/accessibility/vision/)

## Contacto

Para preguntas sobre accesibilidad o reportar problemas:

- **Email**: accessibility@miwidget.com
- **GitHub Issues**: https://github.com/miwidget/booking-widget/issues
- **Documentación**: https://docs.miwidget.com/accessibility
