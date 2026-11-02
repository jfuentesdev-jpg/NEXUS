# CHANGELOG — NEXUS

Este proyecto registra sus cambios visibles en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)
y versionado semántico (MAJOR.MINOR.PATCH; mientras la versión sea 0.x, el
proyecto sigue en desarrollo activo).

## [Sin publicar]

## [0.1.0] — 2026-11-01

Primera versión funcional de la interfaz (Fases 1–2 del Documento Maestro v1.0).
Estado: construcción en curso. Código publicado en el repositorio público
[jfuentesdev-jpg/NEXUS](https://github.com/jfuentesdev-jpg/NEXUS) (2026-11-01),
sin etiqueta de versión ni GitHub Release.

### Added
- Página de inicio con buscador central, sección de disciplinas y contenidos destacados.
- Biblioteca de exploración (página Explorar) con búsqueda local y sincronización de consulta y filtros en la URL.
- Navegación por disciplinas y ramas (página Disciplinas) con conteos por rama.
- Búsqueda por título, descripción, tema y palabras clave, tolerante a tildes y combinada con filtros por disciplina, rama y dificultad.
- Catálogo inicial de contenidos (7 entradas semilla con identificadores UUID y códigos del tipo `MAT-ALG-0001`) y estructura de disciplinas y ramas.
- Estructura modular del proyecto: HTML semántico, CSS por capas (`tokens` / `base` / `layout` / `components`) y JavaScript ES6+ en módulos con páginas desacopladas.
- Identidad visual Dark Technology del documento maestro (paleta `#090B12`, `#176BFF`, `#FFFFFF`, `#202A3B`) y favicon simplificado.

### Changed
- Header responsive: menú horizontal en escritorio (≥ 769 px); en pantallas de hasta 768 px, fila única con logotipo y botón hamburguesa, con menú desplegable de las secciones. Accesible por teclado (Escape con retorno de foco; foco al primer enlace al abrir por teclado), con atributos ARIA (`aria-expanded`, `aria-controls`, `aria-label` dinámico), despliegue discreto respetando `prefers-reduced-motion`, y cierre automático al seleccionar una opción o hacer clic fuera. Sin JavaScript, la navegación horizontal fluida sigue disponible.
- Referencias de CSS y JavaScript versionadas (`?v=0.1.0`) para invalidar la caché del navegador al actualizar y evitar estados que mezclan HTML nuevo con recursos antiguos.
- Ajustes de espaciado y anchos de filtros para ventanas de referencia de 360 a 1920 px, conservando la identidad visual de escritorio.
- Microinteracciones de identidad sin color nuevo: hover de tarjetas (borde de acento + sombra), resplandor del botón primario, anillo de foco en buscador y filtros, estados `disabled` uniformes, elevación de chips, hover del botón hamburguesa y transiciones en la navegación.
- Animaciones de entrada discretas: hero y contenidos destacados escalonados (hasta 240 ms), desactivadas con `prefers-reduced-motion` (incluidos sus retrasos).
- Estado vacío de Explorar con botón «Restablecer filtros» (misma función que «Limpiar»).
- Espacios de imagen preparados para el propietario (`--hero-background`, variables por disciplina y por rama, miniaturas opcionales vía campo `imagen` del catálogo): degradan en gradientes de identidad, sin 404 al arranque ni iconos de imagen faltante. Estructura `assets/images/{portada,disciplinas,contenidos}`.
- Imágenes propias del propietario integradas en esos espacios: portada del hero más las 8 ilustraciones de disciplinas y ramas, referenciadas con rutas relativas y `?v`. Las miniaturas de contenidos siguen pendientes y conservan el fallback gradiente (sin 404).
- Corrección móvil: la adaptación de componentes a ≤ 768 px (padding de tarjetas, badge, filtros apilados a ancho completo) vive ahora en `components.css` tras sus reglas base; antes perdía los empates de cascada contra el archivo base y no se aplicaba realmente.

### Removed
- Control de cambio claro/oscuro y su módulo de persistencia (`js/theme.js`): existieron solo durante el desarrollo de esta versión y se retiraron antes del lanzamiento. NEXUS queda en tema oscuro permanente, definido por la identidad del Documento Maestro (§11).

## Convenciones para próximos lanzamientos

- Toda nueva versión añade su entrada sobre la anterior (orden cronológico inverso).
- Registrar solo cambios verificables y relevantes; omitir ajustes internos insignificantes.
- No editar entradas ya publicadas; enmendarlas haría el historial poco fiable.
- Las correcciones que no cambian funcionalidad corresponden a la versión PATCH siguiente, no se reciclan en la actual.
- Actualizar README.md solo cuando la versión cambie información relevante para los usuarios.
