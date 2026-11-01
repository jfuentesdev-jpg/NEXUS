/* ============================================================
   NEXUS — home.js
   Página de inicio: buscador central con resultados en vivo y
   contenidos destacados (Fase 2 del doc. maestro).
   ============================================================ */

import { obtenerIndice, NOMBRES } from './data.js';
import { buscar } from './search.js';
import { esc, construirMapas, tarjetaContenido } from './ui.js';

/** Renderiza la lista de resultados en vivo del buscador del hero. */
function montarBuscadorHero(contenidos, mapas) {
  const entrada = document.getElementById('buscador-inicio');
  const contenedor = document.getElementById('resultados-inicio');
  const formulario = document.getElementById('formulario-buscador');
  if (!entrada || !contenedor || !formulario) return;

  const lista = document.createElement('ul');
  contenedor.append(lista);

  const cerrar = () => {
    lista.replaceChildren();
    contenedor.hidden = true;
  };

  const render = () => {
    const consulta = entrada.value;
    const resultados = buscar({ contenidos, q: consulta }).slice(0, 6);

    if (!consulta.trim() || resultados.length === 0) {
      cerrar();
      return;
    }

    lista.innerHTML = resultados
      .map(
        (c) => `
        <li>
          <a href="pages/explorar.html?q=${encodeURIComponent(consulta)}&disciplina=${encodeURIComponent(c.disciplina)}">
            <span class="resultado-titulo">${esc(c.titulo)}</span><br>
            <span class="resultado-meta">
              ${esc(NOMBRES.tipo[c.tipo] ?? c.tipo)} · ${esc(mapas.mapa.get(c.disciplina) ?? '')}
            </span>
          </a>
        </li>`
      )
      .join('');
    contenedor.hidden = false;
  };

  // Botones de ejemplo ("pistas") del hero.
  document.querySelectorAll('.pistas button').forEach((boton) => {
    boton.addEventListener('click', () => {
      entrada.value = boton.dataset.pista;
      entrada.dispatchEvent(new Event('input', { bubbles: true }));
      entrada.focus();
    });
  });

  entrada.addEventListener('input', render);
  entrada.addEventListener('focus', render);
  document.addEventListener('click', (e) => {
    if (!contenedor.contains(e.target) && e.target !== entrada) cerrar();
  });
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = `pages/explorar.html?q=${encodeURIComponent(entrada.value)}`;
  });
}

/** Pinta las tarjetas de contenidos destacados. */
function montarDestacados(contenidos, mapas) {
  const contenedor = document.getElementById('destacados');
  if (!contenedor) return;

  const destacados = contenidos
    .filter((c) => c.destacado)
    .slice(0, 6);

  contenedor.innerHTML = destacados
    .map((c) => tarjetaContenido(c, mapas, NOMBRES))
    .join('');
}

/** Punto de entrada de la página de inicio. */
export async function iniciarHome() {
  const contenedorDestacados = document.getElementById('destacados');
  try {
    const indice = await obtenerIndice();
    const mapas = construirMapas(indice.disciplinas);
    montarBuscadorHero(indice.contenidos, mapas);
    montarDestacados(indice.contenidos, mapas);
  } catch (error) {
    console.error('NEXUS: fallo al cargar el índice.', error);
    if (contenedorDestacados) {
      contenedorDestacados.innerHTML = `
        <div class="estado-error" role="alert">
          <strong>No se pudo cargar el índice de contenidos.</strong><br>
          Verifica que las páginas se sirvan con un servidor local.
        </div>`;
    }
  }
}

iniciarHome();
