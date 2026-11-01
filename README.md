# NEXUS — Ecosistema de Conocimiento

> Conecta el conocimiento.

Primera versión funcional (v0.1, Fases 1–2 del documento maestro):
inicio, navegación, disciplinas, buscador y filtros básicos sobre un núcleo inicial de contenidos.

## Cómo ejecutar

Es un sitio estático. Ábrelo con un servidor local (los módulos ES `fetch` no funcionan por `file://`):

```bash
python -m http.server 8080
```

Luego abre <http://localhost:8080/>. También sirve la extensión "Live Server" de VS Code.

## Estructura

```
index.html            Página de inicio (buscador central, disciplinas, destacados)
pages/
  explorar.html       Búsqueda y filtros básicos (disciplina · rama · dificultad · tipo)
css/
  styles.css          Sistema visual: tokens Dark Technology + componentes
  home.css, explorar.css   Hojas por página
js/
  theme.js            Tema (oscuro/claro/automático) + menú móvil, persistente
  data.js             Carga y validación del índice JSON
  search.js           Motor de búsqueda (títulos, descripciones, conceptos, palabras clave)
  ui.js               Componentes de render reutilizables (con escape anti-XSS)
  home.js, explorar.js
data/
  disciplinas.json    Disciplinas iniciales: Matemáticas, Ciencias (y sus ramas)
  contenidos.json     Núcleo de contenidos (UUID, código MAT-ALG-0001, slug, metadatos)
assets/               Logotipo y favicon (SVG geométrico)
docs/                 Documento maestro del proyecto (fuente de requisitos)
```

## Notas

- `data/contenidos.json` son **semillas editoriales en revisión** para demostrar la interfaz; el contenido real entra en la Fase 3 (Biblioteca, Markdown + JSON).
- Sin backend, sin dependencias externas, sin evaluaciones del aprendizaje (restricción del documento maestro).
- Decisiones pendientes (hosting, backend, fuentes tipográficas definitivas, etc.) se listan en el doc. maestro §30 y NO se anticipan aquí.
