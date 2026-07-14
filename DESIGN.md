# Sistema de Diseño de Baki.lat

Este documento contiene la especificación y guía oficial del sistema de diseño para **Baki.lat**. Aquí se describen los colores, tipografía, bordes y comportamientos interactivos para garantizar la consistencia visual a lo largo de toda la plataforma en sus variantes de modo claro (Light Mode) y modo oscuro (Dark Mode).

---

## 🎨 Paleta de Colores (Theme Colors)

Los colores se gestionan de manera dinámica a través de variables CSS declaradas en `src/app/globals.css` y expuestas en el archivo de configuración `@theme` de Tailwind CSS v4.

### 1. Color Primario (Brand Accent)

El color insignia de **Baki** es un naranja vibrante, que inspira energía, dinamismo y optimismo en el comercio emprendedor.

*   **Primary (`--color-primary`)**: `#FF5C00`
    *   *Uso*: Botones de llamada a la acción (CTA) principales, enlaces destacados, badges de estado activos e iconos principales.
*   **On-Primary (`--color-on-primary`)**: `#ffffff`
    *   *Uso*: Color de texto/icono cuando se coloca encima de fondos con el color primario.

---

### 2. Modos de Color (Light & Dark Variants)

| Nombre Variable | Propósito Visual | Light Mode (Default) | Dark Mode (`.dark`) |
| :--- | :--- | :--- | :--- |
| `--color-background` | Fondo principal de las páginas | `#ffffff` | `#191c1d` |
| `--color-on-background`| Texto/iconos sobre el fondo principal | `#191c1d` | `#f8f9fa` |
| `--color-surface` | Fondo para tarjetas y componentes aislados | `#ffffff` | `#191c1d` |
| `--color-on-surface` | Texto/iconos dentro de componentes y tarjetas | `#191c1d` | `#f8f9fa` |
| `--color-surface-container` | Contenedores secundarios, bloques bento, etc. | `#f5f5f5` | `#2e3132` |
| `--color-surface-container-high` | Cabeceras de ventanas, bordes especiales o tarjetas elevadas | `#e5e5e5` | `#3f4243` |
| `--color-on-surface-variant` | Texto secundario o descriptivo | `#5f6368` | `#e4beb1` |
| `--color-outline` | Líneas de división, bordes de inputs y divisores sutiles | `#cbd5e1` | `#8f7065` |

---

## 📋 Tipografía

El sistema de fuentes combina tres familias para lograr jerarquía visual y legibilidad:

1.  **Headline / Display (`Plus Jakarta Sans` / `Hanken Grotesk`)**
    *   *Uso*: Encabezados principales (`h1`, `h2`, `h3`).
    *   *Estilo*: Pesos pesados (normalmente `font-black` o `font-extrabold`) con `tracking-tight`.
2.  **Body (`Anybody` / `Geist Sans`)**
    *   *Uso*: Párrafos descriptivos, textos informativos y contenido en general.
    *   *Estilo*: Peso `font-normal` o `font-medium` con altura de línea relajada (`leading-relaxed`).
3.  **Label / Acciones (`Arimo` / `Geist Mono`)**
    *   *Uso*: Textos cortos, etiquetas de botones, badges y menús de navegación.
    *   *Estilo*: Peso `font-semibold` o `font-bold` con espaciado uniforme.

---

## 📐 Bordes y Esquinas (Border Radius)

Las esquinas en Baki siguen una progresión para dar una apariencia moderna y "blanda" (friendly):

*   **DEFAULT (`rounded`)**: `0.5rem` (`8px`) - Utilizado en botones pequeños y elementos de interfaz compactos.
*   **lg (`rounded-lg`)**: `0.75rem` (`12px`) - Utilizado en badges complejos e inputs de formulario.
*   **xl (`rounded-xl`)**: `1rem` (`16px`) - Utilizado en Bento boxes e iconos contenedores grandes.
*   **2xl (`rounded-2xl`)**: `1.5rem` (`24px`) - Utilizado en botones de CTA de gran formato y tarjetas de precios.
*   **3xl / 3rem (`rounded-[2rem]`)**: `2rem` (`32px`) - Utilizado en la mockup del teléfono celular y secciones envolventes.
*   **full (`rounded-full`)**: `9999px` - Utilizado en badges de píldora y botones circulares de interacción móvil.

---

## ✨ Micro-animaciones y Efectos Visuales

Para lograr una experiencia premium y "viva", implementamos los siguientes efectos interactivos:

### 1. Efecto Glassmorphism (`.glass-card`)
Tarjetas translúcidas con desenfoque de fondo.
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2. Flotación de Mockup (`.animate-float`)
Animación infinita de elevación para la vista del smartphone en la sección Hero.
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
```

### 3. Degradado en Fondo Hero (`.hero-gradient`)
Un fondo radial de dos puntos con opacidades sutiles del color de la marca para centrar la atención en el título principal.
```css
.hero-gradient {
  background: radial-gradient(circle at top right, rgba(255, 92, 0, 0.12), transparent 40%),
              radial-gradient(circle at bottom left, rgba(255, 92, 0, 0.04), transparent 40%);
}
```
