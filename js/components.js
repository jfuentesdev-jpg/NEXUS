/* ============================================================
   NEXUS · components.js
   Fábricas de componentes DOM reutilizables (cards, etiquetas, migas).
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
 * La ficha de detalle se añadirá en la Fase 3 del Documento Maestro.
 */
export function crearTarjetaContenido(item) {
  const tarjeta = el('article', 'tarjeta');

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
 * Tarjeta de disciplina para la página de inicio.
 * El enlace protagonista lleva a Explorar filtrado por disciplina.
 */
export function crearTarjetaDisciplina(disciplina, totalContenidos) {
  const tarjeta = el('article', 'tarjeta tarjeta-disciplina');

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
