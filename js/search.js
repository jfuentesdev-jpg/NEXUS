/* ============================================================
   NEXUS — search.js
   Motor de búsqueda y filtros básicos (Fase inicial del doc. maestro:
   títulos, descripciones, conceptos y palabras clave).
   ============================================================ */

const PESO = { titulo: 4, etiquetas: 3, rama: 2, descripcion: 1.5, disciplina: 1 };

/** Normaliza texto: minúsculas, sin acentos y sin espacios redundantes. */
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Puntaje de un contenido frente a una consulta normalizada (0 = no coincide). */
function puntuar(contenido, consultaNormalizada) {
  if (!consultaNormalizada) return 0;

  const campos = [
    [normalizar(contenido.titulo), PESO.titulo],
    [normalizar((contenido.etiquetas ?? []).join(' ')), PESO.etiquetas],
    [normalizar(contenido.rama), PESO.rama],
    [normalizar(contenido.descripcion), PESO.descripcion],
    [normalizar(contenido.disciplina), PESO.disciplina],
  ];

  const tokens = consultaNormalizada.split(/\s+/).filter(Boolean);
  let puntaje = 0;

  for (const token of tokens) {
    let acerto = false;
    for (const [texto, peso] of campos) {
      if (texto.includes(token)) {
        // coincidencia exacta de palabra completa pesa más que fragmento
        const limite = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        puntaje += limite.test(texto) ? peso : peso * 0.55;
        acerto = true;
      }
    }
    if (!acerto) return 0; // todos los términos deben coincidir
  }
  return puntaje;
}

/**
 * Filtra y ordena contenidos según consulta y filtros.
 * @param {Object} opciones
 * @param {Array} opciones.contenidos
 * @param {string} opciones.q — texto de búsqueda (sin normalizar).
 * @param {string} opciones.disciplina
 * @param {string} opciones.rama
 * @param {string} opciones.dificultad
 * @param {string} opciones.tipo
 * @returns {Array} contenidos coincidentes, de mayor a menor relevancia.
 */
export function buscar({ contenidos, q = '', disciplina = '', rama = '', dificultad = '', tipo = '' }) {
  const consulta = normalizar(q);
  const filas = contenidos.filter((c) =>
    (!disciplina || c.disciplina === disciplina) &&
    (!rama || c.rama === rama) &&
    (!dificultad || c.dificultad === dificultad) &&
    (!tipo || c.tipo === tipo)
  );

  if (!consulta) return filas;

  return filas
    .map((c) => ({ contenido: c, puntaje: puntuar(c, consulta) }))
    .filter((x) => x.puntaje > 0)
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((x) => x.contenido);
}

