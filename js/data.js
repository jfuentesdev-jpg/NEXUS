/* ============================================================
   NEXUS · data.js
   Acceso al catálogo JSON. Los archivos se resuelven relativos a
   este módulo, por lo que las páginas de /pages/ pueden reutilizarlo.
   ============================================================ */

const DIRECTORIO = new URL('../data/', import.meta.url);

/** Caché de promesas: evita peticiones repetidas de un mismo archivo. */
const cache = new Map();

function cargar(archivo) {
  if (!cache.has(archivo)) {
    const promesa = fetch(new URL(archivo, DIRECTORIO)).then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} al cargar ${archivo}`);
      }
      return respuesta.json();
    });
    cache.set(archivo, promesa);
  }
  return cache.get(archivo);
}

export const getDisciplinas = () => cargar('disciplinas.json');
export const getCatalogo = () => cargar('catalogo.json');
