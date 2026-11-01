/* ============================================================
   NEXUS — ui.js
   Componentes reutilizables de render (Fase 2 del doc. maestro).
   Toda interpolación dinámica pasa por esc() para evitar XSS.
   ============================================================ */

/** Escapa texto para uso seguro en HTML. */
export const esc = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (car) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[car])
  );

/** Mapa id → nombre de disciplinas y ramas a partir del índice. */
export function construirMapas(disciplinas) {
  const mapa = new Map();
  const mapaRamas = new Map();
  for (const d of disciplinas) {
    mapa.set(d.id, d.nombre);
    for (const r of d.ramas ?? []) mapaRamas.set(r.id, r.nombre);
  }
  return { mapa, mapaRamas };
}

/** Metadatos legibles de un contenido. */
export function metaContenido(contenido, mapas, nombres) {
  return [
    mapas.mapa.get(contenido.disciplina) ?? contenido.disciplina,
    mapas.mapaRamas.get(contenido.rama) ?? contenido.rama,
    nombres.dificultad[contenido.dificultad] ?? contenido.dificultad,
  ].join(' · ');
}

/** Tarjeta de contenido (biblioteca/destacados/resultados). */
export function tarjetaContenido(contenido, mapas, nombres) {
  const tipoNombre = nombres.tipo[contenido.tipo] ?? contenido.tipo;
  const estadoNombre = nombres.estado[contenido.estado] ?? contenido.estado;
  const etiquetas = (contenido.etiquetas ?? [])
    .slice(0, 3)
    .map((e) => `<span class="chip">${esc(e)}</span>`)
    .join('');

  return `
    <article class="tarjeta tarjeta-contenido">
      <div class="fila-tope">
        <span class="distintivo distintivo-suave">${esc(tipoNombre)}</span>
        <span class="codigo mono">${esc(contenido.codigo)}</span>
      </div>
      <h3>${esc(contenido.titulo)}</h3>
      <p class="descripcion">${esc(contenido.descripcion)}</p>
      <div class="pie-tarjeta">
        <span class="metadato">${esc(metaContenido(contenido, mapas, nombres))}</span>
        ${etiquetas}
      </div>
      <p class="metadato" style="margin: 0.5rem 0 0;">
        <span class="distintivo">${esc(estadoNombre)}</span>
      </p>
    </article>`;
}
