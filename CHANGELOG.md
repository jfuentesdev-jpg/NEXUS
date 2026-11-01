# CHANGELOG — NEXUS

Este proyecto registra sus cambios visibles en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)
y versionado semántico (MAJOR.MINOR.PATCH; mientras la versión sea 0.x, el
proyecto sigue en desarrollo activo).

## [Sin publicar]

## [0.1.0] — 2026-11-01

Primera versión funcional de la interfaz (Fases 1–2 del Documento Maestro v1.0).
Estado: construcción en curso, sin publicación pública.

### Added
- Página de inicio con buscador central, sección de disciplinas y contenidos destacados.
- Biblioteca de exploración (página Explorar) con búsqueda local y sincronización de consulta y filtros en la URL.
- Navegación por disciplinas y ramas (página Disciplinas) con conteos por rama.
- Búsqueda por título, descripción, tema y palabras clave, tolerante a tildes y combinada con filtros por disciplina, rama y dificultad.
- Tema oscuro/claro con preferencia persistente en `localStorage` y detección automática del tema del sistema.
- Catálogo inicial de contenidos (7 entradas semilla con identificadores UUID y códigos del tipo `MAT-ALG-0001`) y estructura de disciplinas y ramas.
- Estructura modular del proyecto: HTML semántico, CSS por capas (`tokens` / `base` / `layout` / `components`) y JavaScript ES6+ en módulos con páginas desacopladas.
- Identidad visual Dark Technology del documento maestro (paleta `#090B12`, `#176BFF`, `#FFFFFF`, `#202A3B`) y favicon simplificado.

### Changed
- Header responsive: menú horizontal en escritorio (≥ 769 px); en pantallas de hasta 768 px, fila única con logotipo y botón hamburguesa, con menú desplegable que reúne las secciones y el selector de tema. Accesible por teclado (Escape con retorno de foco; foco al primer enlace al abrir por teclado), con atributos ARIA (`aria-expanded`, `aria-controls`, `aria-label` dinámico), despliegue discreto respetando `prefers-reduced-motion`, y cierre automático al seleccionar una opción o hacer clic fuera. Sin JavaScript, la navegación horizontal fluida sigue disponible.
- Referencias de CSS y JavaScript versionadas (`?v=0.1.0`) para invalidar la caché del navegador al actualizar y evitar estados que mezclan HTML nuevo con recursos antiguos.
- Ajustes de espaciado y anchos de filtros para ventanas de referencia de 360 a 1920 px, conservando la identidad visual de escritorio.

## Convenciones para próximos lanzamientos

- Toda nueva versión añade su entrada sobre la anterior (orden cronológico inverso).
- Registrar solo cambios verificables y relevantes; omitir ajustes internos insignificantes.
- No editar entradas ya publicadas; enmendarlas haría el historial poco fiable.
- Las correcciones que no cambian funcionalidad corresponden a la versión PATCH siguiente, no se reciclan en la actual.
- Actualizar README.md solo cuando la versión cambie información relevante para los usuarios.
