# NEXUS — Ecosistema de Conocimiento

**Conecta el conocimiento.** Plataforma estática para consultar, explorar y estudiar
conceptos de matemáticas y ciencias, organizados por disciplina, rama y tema.
Definida en el [Documento Maestro v1.0](docs/Nexus-Documento-Maestro-v1.0.md).

Registro de cambios: [CHANGELOG.md](CHANGELOG.md) — única fuente del historial de versiones.

## Propósito y objetivos

- Centralizar el conocimiento académico en un catálogo navegable y compartible.
- Ofrecer búsqueda tolerante a tildes y filtros combinados (disciplina, rama, dificultad).
- Mantener una interfaz rápida, accesible (enfoque WCAG 2.2 AA) y sin dependencias
  externas: sin frameworks, sin backend y con servidores estáticos de cualquier tipo.
- Conservar siempre la identidad visual propia (tema oscuro permanente, Dark Technology).

## Disciplinas y organización del conocimiento

La organización jerárquica del catálogo es **Disciplina → Rama → Tema**. Cada contenido
declara además su dificultad (básica, intermedia) y sus conocimientos previos.

- **Matemáticas**: Álgebra, Aritmética, Geometría y Trigonometría.
- **Ciencias**: Física y Química.

El catálogo vive en `data/catalogo.json` y crece con cada fase editorial; buscador y
filtros lo cubren sin cambios de código.

## Características

- **Inicio**: buscador central, tarjetas de disciplinas y contenidos destacados.
- **Disciplinas**: jerarquía completa con conteos por rama.
- **Explorar (biblioteca)**: búsqueda por título, descripción, tema y palabras clave,
  combinable con filtros, con la consulta y los filtros sincronizados en la URL.
- **Navegación responsive**: menú horizontal en escritorio; en móvil, menú desplegable
  operable por teclado con cierre con Escape y clic fuera.
- **Interacciones**: hover, foco y estados deshabilitados refinados; entrada animada
  del hero y de destacados respetando `prefers-reduced-motion`; estado vacío con
  botón de restablecimiento.
- **Espacios de imagen preparados**: hero, disciplina/ramas y miniaturas de destacados
  pintan un degradado elegante mientras no existan archivos; al definirlos aparecen sin
  tocar HTML ni JavaScript.
- **Sistema visual Dark Technology**: tema oscuro permanente con la paleta de identidad,
  sistema de diseño por tokens y diseño responsive mobile-first.

## Tecnologías

- HTML5 semántico.
- CSS3 por capas: tokens (sistema de diseño), base, layout y componentes.
- JavaScript ES6+ nativo en módulos, sin frameworks ni dependencias de terceros.
- Datos en JSON cargados con `fetch`.
- Servible con cualquier servidor de archivos estáticos.

## Instalación y ejecución

Requisitos: un navegador moderno (Chrome, Edge, Firefox o Safari). Para servir el
proyecto, cualquier servidor estático; del sistema local basta uno de:

```bash
python -m http.server 8123      # opción A (Python)
npx http-server -p 8123 .       # opción B (Node)
```

Abrir `http://localhost:8123`.

> El catálogo no se puede abrir doble-clicando el archivo (`file://`): los módulos ES se bloquean.
> Tras actualizar código, fuerza recarga (Ctrl+F5); las referencias estáticas llevan `?v=` que se
> incrementa con cada edición publicada para invalidar la caché del navegador.

## Uso

- Busca desde el hero de inicio o desde la biblioteca; ejemplos: `ecuaciones`,
  `Pitágoras`, `velocidad`.
- Combina palabra de búsqueda con los filtros de disciplina, rama y dificultad.
- La URL conserva consulta y filtros: comparte el enlace de un resultado para reproducirlo.

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

La integración se hace sobre espacios preparados: si falta el archivo,
el espacio pinta un gradiente elegante de la identidad (nunca quedan huecos
rotos ni iconos de imagen faltante). Estado actual: **portada y las 8
imágenes de disciplinas/ramas están integradas**; las **miniaturas de
contenidos están pendientes**. Pasos para las que falten:

1. Copiar el archivo en su carpeta bajo `assets/images/`:
   `portada/` (fondo del hero) · `disciplinas/` (matemáticas, ciencias y sus ramas) ·
   `contenidos/` (miniaturas de destacados).
2. Asignar la variable CSS correspondiente en `css/tokens.css` (empiezan en `none`):

   | Variable | Archivo integrado (o previsto) |
   |---|---|
   | `--hero-background` | `../assets/images/portada/portada.jpg` ✓ |
   | `--mathematics-image` | `../assets/images/disciplinas/matematicas.jpg` ✓ |
   | `--sciences-image` | `../assets/images/disciplinas/ciencias.jpg` ✓ |
   | `--algebra-image` | `../assets/images/disciplinas/algebra.jpg` ✓ |
   | `--arithmetic-image` | `../assets/images/disciplinas/aritmetica.jpg` ✓ |
   | `--geometry-image` | `../assets/images/disciplinas/geometria.jpg` ✓ |
   | `--trigonometry-image` | `../assets/images/disciplinas/trigonometria.jpg` ✓ |
   | `--physics-image` | `../assets/images/disciplinas/fisica.jpg` ✓ |
   | `--chemistry-image` | `../assets/images/disciplinas/quimica.jpg` ✓ |

   Dentro de `tokens.css` las rutas `url(...)` van con prefijo `../` (relativas al
   archivo CSS) y llevan `?v=` de caché. No hace falta tocar HTML ni JavaScript:
   las tarjetas ya
   enlazan a estas variables.

3. Miniaturas de destacados (pendientes): añadir al ítem de `data/catalogo.json`
   el campo `"imagen": "nombre-del-archivo.jpg"` y colocar ese archivo en
   `assets/images/contenidos/`; la tarjeta lo resuelve sola
   (`js/components.js`). Sin ese campo, los destacados muestran solo el marco
   gradiente. Correspondencias verificadas con el catálogo actual:
   `ecuaciones.jpg` → `MAT-ALG-0001` (Ecuaciones lineales con una variable),
   `funciones.jpg` → `MAT-ALG-0003` (Ecuación cuadrática),
   `geometria.jpg` → `MAT-GEO-0005` (Teorema de Pitágoras).

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
