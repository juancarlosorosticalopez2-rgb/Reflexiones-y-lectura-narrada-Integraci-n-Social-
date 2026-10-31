# Reflexiones: Integración, Pensamiento Crítico, Colaboración y Sociedad

Una experiencia editorial interactiva de audio y lectura narrada con voz de alta fidelidad, ambientación acústica serena, tipografía de revista cultural y sincronización de texto en tiempo real para explorar cuatro ensayos filosóficos contemporáneos.

## Decisiones del Usuario y Puntos Críticos

> [!IMPORTANT]
> Se adoptaron las opciones recomendadas por defecto:
> - **Estilo de Experiencia**: Reproductor editorial con audio narrado, texto sincronizado, visualizador armónico y ambientación de fondo.
> - **Estilo Sonoro**: Narración reflexiva, cálida y pausada, acompañada opcionalmente de un lecho sonoro ambiental generado vía Web Audio API.
> - **Estructura de Contenido**: Cuatro capítulos temáticos profundos e independientes con opción de escucha continua o navegación por capítulos.

- **Voz y Motor de Audio**: Se integrará un endpoint backend (`/api/tts`) con `@google/genai` (`gemini-3.8-flash-lite-tts`) generando audio WAV mono de 24kHz con perfiles de voz seleccionables (`Kore`, `Fenrir`, `Puck`, `Charon`, `Zephyr`). Además, se implementa fallback automático al motor nativo `window.speechSynthesis` para garantizar reproducción instantánea sin fricción en cualquier entorno.
- **Diseño Visual**: Estilo curatorial y editorial contemporáneo inspirado en el catálogo institucional y publicaciones de pensamiento (tonos pergamino cálido `#FBF9F5`, tinta carbón `#1C1917`, terracota tenue y hairlines minimalistas), cumpliendo con la constitución anti-slop (cero píldoras decorativas, sin números mecánicos ni pseudo-código).

---

## 1. Visión General y Concepto Central

- **Qué hace**: Ofrece una lectura narrada completa, inmersiva y pausada de cuatro reflexiones interconectadas sobre los pilares del progreso humano:
  1. *Integración: La trama de las diferencias* (Conectar disciplinas, culturas y miradas sin anular la singularidad).
  2. *Pensamiento Crítico: La sospecha lúcida* (Discernimiento frente a sesgos, burbujas algorítmicas y certezas apresuradas).
  3. *Colaboración: Sinfonía de inteligencias* (Sinergia colectiva, vulnerabilidad intelectual y construcción comunitaria).
  4. *Sociedad: El tejido de la empatía* (Bienes comunes, convivencia democrática y responsabilidad ética ante el porvenir).
- **Audiencia Objetivo**: Estudiantes, pensadores, educadores, equipos colaborativos y amantes de la filosofía contemporánea y el formato audiolibro/ensayo narrado.
- **Valor Clave**: Combina la profundidad del ensayo humanístico con la comodidad de un reproductor de audio moderno con sincronización párrafo a párrafo, visualizador de frecuencias y controles de velocidad.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos de Usuario Clave
1. **Inicio y Descubrimiento**: El usuario ingresa a una portada editorial limpia con el manifiesto central y los 4 capítulos accesibles en una grilla armónica.
2. **Escucha y Lectura Sincronizada**: Al pulsar "Reproducir Reflexión", el reproductor se activa, resaltando sutilmente el párrafo y frase en lectura, con indicador de tiempo transcurrido y barra de progreso fluida.
3. **Interacción Directa con el Texto**: El usuario puede hacer clic en cualquier párrafo del ensayo para saltar inmediatamente la narración a ese punto exacto.
4. **Personalización Sonora**: Selector de voz (Kore, Fenrir, Puck, Zephyr), velocidad de lectura (0.75x, 1x, 1.25x, 1.5x), tono y conmutador de música ambiental armónica con volumen independiente.
5. **Citas y Notas al Margen**: Citas destacadas (*pull quotes*) y preguntas para debate al final de cada capítulo, con opción de copiar cita o descargar el audio/texto.

### Identidad Visual y Estilo Editorial
- **Atmósfera y Paleta**:
  - Fondo papel artesanal cálido: `bg-[#FAF7F2]` (Modo Claro) / `dark:bg-[#121110]` (Modo Oscuro curatorial).
  - Superficies de lectura: `bg-[#FFFFFF]` / `dark:bg-[#1A1816]` con bordes ultra-delgados `border-stone-200` / `dark:border-stone-800`.
  - Tipografía principal: Tinta carbón `text-stone-900` / `dark:text-stone-100` y tonos secundarios `text-stone-600` / `dark:text-stone-400`.
  - Acento curatorial: Terracota profundo `text-[#9A3412]` / `bg-[#9A3412]` para acciones primarias y progreso activo.
- **Tipografía y Jerarquía**:
  - Títulos y capitulares: Tipografía serif editorial elegante (Playfair Display / Georgia / Merriweather).
  - Cuerpo de lectura: Serif de libro legible y espaciado (Lora / Charter) con `max-w-2xl` y `leading-relaxed` (65-75 caracteres por línea).
  - Metadatos: Texto sobrio sin bordes con separadores sutiles `·` (`4 min de escucha · Capítulo 01`).
- **Disciplina Anti-Slop**:
  - Sin píldoras flotantes ni insignias de colores estridentes.
  - Sin prefijos mecánicos de código (`//`, `>_`); numeración editorial natural (`Capítulo 1: La trama de las diferencias`).
  - Sin gradientes púrpuras genéricos ni tarjetas anidadas redundantes.
  - Header con contrato de 3 zonas: Wordmark a la izquierda, enlaces directos a los capítulos al centro, y acción rápida de escucha a la derecha.

---

## 3. Decisiones de Producto y Compensaciones

- **Generación de Audio Híbrida (Gemini TTS + Web Speech API + Web Audio Synthesizer)**:
  - *Enfoque*: El backend utiliza `gemini-3.8-flash-lite-tts` para generar archivos de voz WAV mono 24kHz de calidad de estudio. En caso de latencia o falta de clave de API, el reproductor conmuta de forma transparente al motor nativo `SpeechSynthesis` del navegador, garantizando que el usuario **siempre** escuche la narración sin esperas ni errores.
  - *Por qué*: Ofrece la máxima calidad de voz posible cuando hay conectividad y backend disponible, con 100% de confiabilidad local en cualquier navegador.
- **Ambientación Acústica Generativa**:
  - *Enfoque*: Generador de acordes y frecuencias armónicas suaves (onda seno cálida con filtro pasa-bajos y paneo estéreo suave) directamente mediante `AudioContext` de Web Audio API.
  - *Por qué*: No requiere cargar archivos pesados de audio MP3 de terceros, no sufre problemas de derechos de autor ni errores de red 404, y permite un control dinámico y reactivo del volumen del lecho sonoro.
- **Sincronización Párrafo por Párrafo**:
  - *Enfoque*: Estructura de datos indexada por párrafos con estimación de duración y eventos de avance `onboundary` y de tiempo de audio.
  - *Por qué*: Permite al usuario tanto escuchar en segundo plano como seguir la lectura visualmente, o saltar a la sección deseada con un solo clic.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INTERFAZ DE USUARIO (React 19)                  │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Top Bar Editorial     │  │  Selector de Capítulos & Modos      │  │
│  └───────────┬─────────────┘  └──────────────────┬──────────────────┘  │
│              │                                   │                     │
│  ┌───────────▼───────────────────────────────────▼──────────────────┐  │
│  │  Lienzo de Lectura Narrada (Drop Caps, Pull Quotes, Notas)       │  │
│  │  - Resaltado de párrafo activo en tiempo real                    │  │
│  │  - Clic en párrafo para salto directo de reproducción            │  │
│  └───────────────────────────────────┬──────────────────────────────┘  │
│                                      │                                 │
│  ┌───────────────────────────────────▼──────────────────────────────┐  │
│  │  Reproductor Sticky & Visualizador de Frecuencias                │  │
│  │  - Play/Pause · Scrubbing · Velocidad · Volumen de Voz y Música  │  │
│  └───────────┬───────────────────────────────────┬──────────────────┘  │
└──────────────┼───────────────────────────────────┼─────────────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────────┐   ┌─────────────────────────────────────┐
│    Web Audio API Drone       │   │  Audio Engine Controller            │
│  (Ambientación armónica      │   │  - Unary Gemini WAV TTS Cache       │
│   generativa en cliente)     │   │  - Web Speech API Fallback          │
└──────────────────────────────┘   └──────────────────┬──────────────────┘
                                                      │
                                                      ▼ fetch('/api/tts')
                                   ┌─────────────────────────────────────┐
                                   │  Servidor Express (server.ts)       │
                                   │  - @google/genai SDK                │
                                   │  - gemini-3.8-flash-lite-tts        │
                                   │  - Retorno de audio WAV base64      │
                                   └─────────────────────────────────────┘
```

### Componentes Principales
- `App.tsx`: Contenedor principal con gestión de tema claro/oscuro, estado de capítulo activo y reproductor global.
- `src/data/reflections.ts`: Catálogo completo de los 4 ensayos con títulos, subtítulos, párrafos numerados, citas clave y preguntas de reflexión.
- `src/components/AudioPlayer.tsx`: Barra de reproducción editorial con visualizador de ondas animado, controles de salto ±10s, barra de progreso y reguladores de volumen dual (voz y ambiente).
- `src/components/ReadingCanvas.tsx`: Vista de lectura tipográfica con columnas optimizadas, capitulares y párrafos interactivos.
- `src/components/VoiceSettingsModal.tsx`: Ajustes de timbre vocal, motor y velocidad.
- `src/utils/audioSynthesizer.ts`: Motor Web Audio API para el lecho sonoro ambiental (pads ambientales serenos).
- `server.ts`: Servidor Express con ruta `/api/tts` que invoca `ai.models.generateContent` con `gemini-3.8-flash-lite-tts`.

### Plan de Verificación
1. **Compilación y Linting**: Ejecución de `compile_applet` para asegurar cero errores de TypeScript y empaquetado Vite.
2. **Prueba de Reproducción**: Comprobación del ciclo completo de reproducción de audio, salto de párrafos, cambio de velocidad y ambientación de fondo.
3. **Diseño Responsivo**: Verificación de legibilidad en pantallas móviles y escritorio (1440px).
