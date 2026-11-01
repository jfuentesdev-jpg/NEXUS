/* ============================================================
   NEXUS · search.js
   Búsqueda local sobre el catálogo (etapa inicial §13):
   títulos, descripciones, conceptos, palabras clave.
   Ponderación: título > palabras clave/tema > resto de campos.
   ============================================================ */

/** Quita mayúsculas y tildes para hacer la búsqueda tolerante. */
export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Prepara índices de búsqueda para una lista de contenidos.
 * @param {Array} contenido Ítems del catálogo.
 * @returns {Array} Ítems con sus campos de búsqueda normalizados.
 */
export function prepararBusquedas(contenido) {
  return contenido.map((item) => {
    const terminos = [
      item.titulo,
      item.descripcion,
      item.tema,
      item.codigo,
      item.disciplina?.nombre,
      item.rama?.nombre,
      ...(item.palabras_clave ?? []),
    ].join(' ');

    return {
      item,
      texto: normalizar(terminos),
      titulo: normalizar(item.titulo),
      tema: normalizar(item.tema),
      palabras: normalizar((item.palabras_clave ?? []).join(' ')),
    };
  });
}

/**
 * Busca en el índice preparado. Todos los términos de la consulta
 * deben estar presentes (Y lógico).
 * @param {Array} preparados Salida de prepararBusquedas().
 * @param {string} consulta Texto libre del usuario.
 * @returns {Array} Contenidos ordenados por relevancia (desc).
 */
export function buscar(preparados, consulta) {
  const tokens = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const resultados = [];

  for (const campos of preparados) {
    let puntos = 0;

    for (const token of tokens) {
      if (!campos.texto.includes(token)) {
        puntos = 0;
        break;
      }
      puntos += 1;
      if (campos.titulo.includes(token)) puntos += 5;
      if (campos.tema.includes(token)) puntos += 2;
      if (campos.palabras.includes(token)) puntos += 2;
    }

    if (puntos > 0) resultados.push({ item: campos.item, puntos });
  }

  // sort() es estable: empates conservan el orden del catálogo.
  resultados.sort((a, b) => b.puntos - a.puntos);
  return resultados.map((r) => r.item);
}
