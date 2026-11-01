/* ============================================================
   NEXUS · components.js
   Fábricas de componentes DOM reutilizables (cards, etiquetas,
   migas, espacios de imagen).
   Se construye siempre con textContent: sin inyección de HTML.
   ============================================================ */

const FORMATO_FECHA = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Convierte 2026-11-01 en una fecha legible, evitando desfases de zona horaria. */
export function formatearFecha(iso) {
  if (!iso) return '';
  const [anho, mes, dia] = iso.split('-').map(Number);
  return FORMATO_FECHA.format(new Date(anho, mes - 1, dia));
}

function el(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto != null) nodo.textContent = texto;
  return nodo;
}

/* mapa slug (data/*.json) → variable CSS del espacio de imagen
   definida en css/tokens.css (vale `none` hasta que el propietario
   coloque el archivo). */
const VARIABLES_IMAGEN = new Map([
  ['matematicas', '--mathematics-image'],
  ['ciencias', '--sciences-image'],
  ['algebra', '--algebra-image'],
  ['aritmetica', '--arithmetic-image'],
  ['geometria', '--geometry-image'],
  ['trigonometria', '--trigonometry-image'],
  ['fisica', '--physics-image'],
  ['quimica', '--chemistry-image'],
]);

/**
 * Espacio decorativo de imagen para tarjetas.
 * Enlaza la tarjeta con la variable de su slug (disciplina o rama);
 * sin archivo, pinta el gradiente de identidad (--gradiente-marco).
 * Cuando el propietario defina la variable en tokens.css, la imagen
 * aparece sin tocar HTML ni JS.
 */
export function crearArte(slug, modificador = '') {
  const arte = el('div', `tarjeta-arte${modificador ? ` ${modificador}` : ''}`);
  const variable = VARIABLES_IMAGEN.get(slug);
  if (variable) arte.style.setProperty('--imagen-slot', `var(${variable})`);
  arte.setAttribute('aria-hidden', 'true');
  return arte;
}

/**
 * Miniatura opcional de un contenido destacado (solo se pinta si el
 * propietario declaró el campo "imagen" en data/catalogo.json; el
 * archivo vive en assets/images/contenidos/).
 */
function crearMiniatura(item) {
  const miniatura = el('div', 'tarjeta-miniatura');
  miniatura.setAttribute('aria-hidden', 'true');
  if (item.imagen) {
    const ruta = new URL(`../assets/images/contenidos/${item.imagen}`, import.meta.url);
    miniatura.style.setProperty('--imagen-tarjeta', `url("${ruta.href}")`);
  }
  return miniatura;
}

export function crearEtiqueta(titulo, variante = '') {
  return el('span', `etiqueta${variante ? ` etiqueta--${variante}` : ''}`, titulo);
}

export function crearMigas(partes) {
  const contenedor = el('div', 'tarjeta-migas');
  partes.filter(Boolean).forEach((parte, indice) => {
    if (indice > 0) contenedor.append(el('span', 'migas-sep', '›'));
    contenedor.append(el('span', null, parte));
  });
  return contenedor;
}

function capitalizar(texto) {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';
}

/**
 * Tarjeta de contenido (biblioteca).
 * - `animar` solo en destacados del inicio: entrada escalonada
 *   (hasta 240 ms) y hueco visible de miniatura preparado.
 * - Fuera del inicio, la miniatura aparece únicamente si el ítem
 *   declaró una imagen (los resultados de Explorar re-renderizan con
 *   cada tecla; nunca se les aplica la animación).
 * La ficha de detalle se añadirá en la Fase 3 del Documento Maestro.
 */
export function crearTarjetaContenido(item, indice = 0, animar = false) {
  const tarjeta = el('article', 'tarjeta');

  if (animar) {
    tarjeta.classList.add('tarjeta--anima');
    tarjeta.style.setProperty('--demora-entrada', `${Math.min(indice * 40, 240)}ms`);
  }

  const declarada = Boolean(item.imagen);
  if (declarada || animar) tarjeta.append(crearMiniatura(item));

  tarjeta.append(crearMigas([item.disciplina?.nombre, item.rama?.nombre, item.tema]));
  tarjeta.append(el('h3', 'tarjeta-titulo', item.titulo));
  tarjeta.append(el('p', 'tarjeta-descripcion', item.descripcion));

  const pie = el('div', 'tarjeta-pie');

  const grupoIzq = el('div', 'tarjeta-meta-grupo');
  grupoIzq.append(crearEtiqueta(capitalizar(item.dificultad), item.dificultad));
  grupoIzq.append(el('span', 'tarjeta-codigo', item.codigo));
  pie.append(grupoIzq);

  pie.append(el('span', null, `Actualizado ${formatearFecha(item.fecha_actualizacion)}`));
  tarjeta.append(pie);

  return tarjeta;
}

/**
 * Tarjeta de disciplina para la página de inicio, con su espacio de
 * imagen (96 px) sangrando sobre el borde superior.
 * El enlace protagonista lleva a Explorar filtrado por disciplina.
 */
export function crearTarjetaDisciplina(disciplina, totalContenidos) {
  const tarjeta = el('article', 'tarjeta tarjeta-disciplina');

  tarjeta.append(crearArte(disciplina.slug));

  const cabecera = el('div', 'tarjeta-cabecera');
  cabecera.append(el('span', 'inicial', disciplina.nombre.charAt(0)));

  const bloqueTitulo = el('div');
  const titulo = el('h3', 'tarjeta-titulo');
  const enlace = document.createElement('a');
  enlace.href = `pages/explorar.html?disciplina=${disciplina.slug}`;
  enlace.textContent = disciplina.nombre;
  titulo.append(enlace);
  bloqueTitulo.append(titulo);
  bloqueTitulo.append(
    el('p', 'tarjeta-metadatos', `${disciplina.ramas.length} ramas · ${totalContenidos} contenidos`)
  );

  cabecera.append(bloqueTitulo);
  tarjeta.append(cabecera);
  tarjeta.append(el('p', 'tarjeta-descripcion', disciplina.descripcion));

  const ramas = el('ul', 'ramas-mini');
  disciplina.ramas.forEach((rama) => {
    const li = document.createElement('li');
    const enlaceRama = document.createElement('a');
    enlaceRama.href = `pages/explorar.html?disciplina=${disciplina.slug}&rama=${rama.slug}`;
    enlaceRama.textContent = rama.nombre;
    li.append(enlaceRama);
    ramas.append(li);
  });

  tarjeta.append(ramas);
  return tarjeta;
}
