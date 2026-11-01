# NEXUS — Ecosistema de Conocimiento (v0.1.0)

**Conecta el conocimiento.** Primera base funcional conforme al
[Documento Maestro v1.0](docs/Nexus-Documento-Maestro-v1.0.md) (Fases 1–2: fundación e interfaz principal).

Historial de versiones: [CHANGELOG.md](CHANGELOG.md).

## Ejecutar

El catálogo se carga con `fetch`, así que el proyecto debe servirse estático:

```bash
python -m http.server 8123      # opción A (Python)
npx http-server -p 8123 .       # opción B (Node)
```

Abrir `http://localhost:8123` en Chrome, Edge, Firefox o Safari.

## Alcance de esta versión

- Página de inicio: buscador central, disciplinas, contenidos destacados.
- Página de disciplinas: jerarquía Disciplina → Rama con conteos.
- Página de biblioteca (Explorar): búsqueda local + filtros (disciplina, rama, dificultad) sincronizados con la URL.
- Sistema visual Dark Technology (§11): oscuro/claro con preferencia persistente, header, cards, badges.
- Diseño responsive mobile-first y semántica accesible (enfoque WCAG 2.2 AA).

Fuera de alcance por ahora (Fase 3+): fichas de contenido, Markdown, rutas, relaciones visuales.

## Estructura

```
index.html            Página de inicio
pages/                Páginas interiores
css/                  tokens (sistema de diseño) · base · layout · componentes
js/                   data (catálogo) · theme · search · components · main
js/pages/             módulos por página (inicio, disciplinas, explorar)
data/                 disciplinas.json · catalogo.json
assets/               favicon (marca simplificada)
docs/                 Documento Maestro
```

## Añadir contenidos

Editar `data/catalogo.json`: un objeto por contenido con `id` (UUID), `codigo`
(`MAT-ALG-0001`), `slug`, `titulo`, `descripcion`, `disciplina`, `rama`, `tema`,
`dificultad`, `conocimientos_previos`, `palabras_clave`, `relaciones`, `estado`,
`destacado` y `fecha_actualizacion`. Buscador y filtros funcionan sin más cambios.

## Decisiones provisionales (pendientes §30)

- Tipografía: pila de sistema; familias definitivas se elegirán en desarrollo visual.
- Navegación: solo el subconjunto funcional del MVP (Inicio, Explorar, Disciplinas);
  Aprendizaje, Investigación, Recursos y Comunidad se añaden en sus fases.
- Las tarjetas aún no enlazan a fichas: la plantilla de contenido es la Fase 3.
