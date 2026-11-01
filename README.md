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

> El catálogo no se puede abrir doble-clicando el archivo (`file://`): los módulos ES se bloquean.
> Tras actualizar código, fuerza recarga (Ctrl+F5); las referencias estáticas llevan `?v=` que se
> incrementa con cada versión para invalidar la caché del navegador.

## Alcance de esta versión

- Página de inicio: buscador central, disciplinas, contenidos destacados.
- Página de disciplinas: jerarquía Disciplina → Rama con conteos.
- Página de biblioteca (Explorar): búsqueda local + filtros (disciplina, rama, dificultad) sincronizados con la URL.
- Sistema visual Dark Technology (§11) en tema oscuro permanente: header, cards, badges.
- Interacciones de identidad: hover/focus/disabled refinados, entrada del hero y de destacados (respeta `prefers-reduced-motion`), botón de restablecer en el estado vacío.
- Espacios de imagen preparados con degradado de identidad (hero, disciplinas y ramas, miniaturas de destacados) para incorporar archivos sin tocar HTML.
- Diseño responsive mobile-first y semántica accesible (enfoque WCAG 2.2 AA).

Fuera de alcance por ahora (Fase 3+): fichas de contenido, Markdown, rutas, relaciones visuales.

## Estructura

```
index.html            Página de inicio
pages/                Páginas interiores
css/                  tokens (sistema de diseño) · base · layout · componentes
js/                   data (catálogo) · nav · search · components · main
js/pages/             módulos por página (inicio, disciplinas, explorar)
data/                 disciplinas.json · catalogo.json
assets/               favicon (marca simplificada)
assets/images/        espacios de imagen preparados (portada · disciplinas · contenidos)
docs/                 Documento Maestro
```

## Incorporar imágenes (propietario)

Las imágenes se integran después: los espacios ya existen y, hasta colocar los
archivos, pintan un gradiente elegante de la identidad (nunca quedan huecos
rotos ni iconos de imagen faltante). Pasos:

1. Copiar el archivo en su carpeta bajo `assets/images/`:
   `portada/` (fondo del hero) · `disciplinas/` (matemáticas, ciencias y sus ramas) ·
   `contenidos/` (miniaturas de destacados).
2. Asignar la variable CSS correspondiente en `css/tokens.css` (empiezan en `none`):

   | Variable | Archivo esperado |
   |---|---|
   | `--hero-background` | `../assets/images/portada/portada.jpg` |
   | `--mathematics-image` | `../assets/images/disciplinas/matematicas.png` |
   | `--sciences-image` | `../assets/images/disciplinas/ciencias.png` |
   | `--algebra-image` | `../assets/images/disciplinas/algebra.png` |
   | `--arithmetic-image` | `../assets/images/disciplinas/aritmetica.png` |
   | `--geometry-image` | `../assets/images/disciplinas/geometria.png` |
   | `--trigonometry-image` | `../assets/images/disciplinas/trigonometria.png` |
   | `--physics-image` | `../assets/images/disciplinas/fisica.png` |
   | `--chemistry-image` | `../assets/images/disciplinas/quimica.png` |

   Dentro de `tokens.css` las rutas `url(...)` van con prefijo `../` (relativas al
   archivo CSS). No hace falta tocar HTML ni JavaScript: las tarjetas ya
   enlazan a estas variables.

3. Miniaturas de destacados (opcional): añadir al ítem de `data/catalogo.json`
   el campo `"imagen": "nombre-del-archivo.jpg"` y colocar ese archivo en
   `assets/images/contenidos/`; la tarjeta lo resuelve sola
   (`js/components.js`). Sin ese campo, los destacados muestran solo el marco
   gradiente.

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
