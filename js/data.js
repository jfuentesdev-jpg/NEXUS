/* ============================================================
   NEXUS — data.js
   Carga y acceso a los datos estructurados (JSON, sin backend).
   El index (disciplinas/contenidos) es la única fuente de datos.
   ============================================================ */

const rutaDisciplinas = new URL('../data/disciplinas.json', import.meta.url);
const rutaContenidos = new URL('../data/contenidos.json', import.meta.url);

/** Caché interna del índice cargado. */
let indice = null;

/**
 * Lee y valida el JSON de un archivo de datos.
 * @param {string} url — dirección del recurso.
 * @param {string} clave — clave del objeto raíz esperada.
 * @returns {Promise<Array<any>>}
 */
async function cargarJson(url, clave) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} al cargar ${url}`);
  }
  const datos = await respuesta.json();
  const lista = datos?.[clave];
  if (!Array.isArray(lista)) {
    throw new Error(`Formato inválido en ${url}: se esperaba un arreglo "${clave}".`);
  }
  return lista;
}

/**
 * Carga el índice completo (disciplinas + contenidos) una sola vez.
 * @returns {Promise<{disciplinas: Array, contenidos: Array, porId: Map}>}
 */
export async function obtenerIndice() {
  if (indice) return indice;

  const [disciplinas, contenidos] = await Promise.all([
    cargarJson(rutaDisciplinas, 'disciplinas'),
    cargarJson(rutaContenidos, 'contenidos'),
  ]);

  const porId = new Map(contenidos.map((c) => [c.id, c]));
  indice = { disciplinas, contenidos, porId };
  return indice;
}

/** Mapa id → nombre para disciplinas, ramas y tipos. */
export const NOMBRES = {
  tipo: { concepto: 'Concepto', articulo: 'Artículo' },
  dificultad: { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' },
  estado: {
    revision: 'En revisión académica',
    publicado: 'Publicado',
  },
};
