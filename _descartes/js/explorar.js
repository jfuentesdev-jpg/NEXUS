/* ============================================================
   NEXUS — explorar.js
   Página Explorar: búsqueda con filtros básicos
   (disciplina, rama, dificultad y tipo), según el MVP.
   ============================================================ */

import { obtenerIndice, NOMBRES } from './data.js';
import { buscar } from './search.js';
import { esc, construirMapas, tarjetaContenido } from './ui.js';

/** Llena un <select> con opciones [valor, texto]. */
function llenarSelect(select, opciones, incluirTodas = true) {
  const actual = select.value;
  select.innerHTML = '';
  if (incluirTodas) {
    select.append(new Option('Todas', ''));
  }
  for (const [valor, texto] of opciones) {
    select.append(new Option(texto, valor));
  }
  if (incluirTodas) select.value = opciones.some(([v]) => v === actual) ? actual : '';
}

/** Página Explorar. */
export async function iniciarExplorar() {
  const parametros = new URLSearchParams(window.location.search);
  const contenedorResultados = document.getElementById('resultados');
  const recuento = document.getElementById('recuento');

  try {
    const indice = await obtenerIndice();
    const mapas = construirMapas(indice.disciplinas);

    // Si un contenido llevó aquí con estado de error previo, se limpia.
    contenedorResultados.textContent = '';

    // --- Referencias ---
    const entrada = document.getElementById('campo-busqueda');
    const selDisciplina = document.getElementById('filtro-disciplina');
    const selRama = document.getElementById('filtro-rama');
    const selDificultad = document.getElementById('filtro-dificultad');
    const selTipo = document.getElementById('filtro-tipo');
    const formulario = document.getElementById('formulario-filtros');

    // --- Opciones de filtros ---
    llenarSelect(
      selDisciplina,
      indice.disciplinas.map((d) => [d.id, d.nombre])
    );
    llenarSelect(selDificultad, Object.entries(NOMBRES.dificultad));
    llenarSelect(selTipo, Object.entries(NOMBRES.tipo));

    // Ramas dependen de la disciplina elegida.
    const actualizarRamas = () => {
      const d = indice.disciplinas.find((x) => x.id === selDisciplina.value);
      llenarSelect(selRama, (d?.ramas ?? []).map((r) => [r.id, r.nombre]));
    };
    selDisciplina.addEventListener('change', actualizarRamas);

    // --- Estado inicial desde la URL ---
    const qInicial = parametros.get('q') ?? '';
    entrada.value = qInicial;
    selDisciplina.value = parametros.get('disciplina') ?? '';
    actualizarRamas();
    selRama.value = parametros.get('rama') ?? '';
    selDificultad.value = parametros.get('dificultad') ?? '';
    selTipo.value = parametros.get('tipo') ?? '';

    // --- Render de resultados ---
    const ejecutar = () => {
      const criterios = {
        contenidos: indice.contenidos,
        q: entrada.value,
        disciplina: selDisciplina.value,
        rama: selRama.value,
        dificultad: selDificultad.value,
        tipo: selTipo.value,
      };
      const resultado = buscar(criterios);

      recuento.textContent = resultado.length === 1
        ? '1 resultado'
        : `${resultado.length} resultados`;

      if (resultado.length === 0) {
        contenedorResultados.innerHTML = `
          <div class="estado-vacio">
            <p><strong>Sin resultados.</strong></p>
            <p>Ajusta la búsqueda o los filtros. Si la consulta es correcta,<br>
            el contenido puede estar pendiente de publicación editorial.</p>
          </div>`;
        return;
      }

      contenedorResultados.innerHTML = resultados
        .map((c) => tarjetaContenido(c, mapas, NOMBRES))
        .join('');
    };

    // Búsqueda con retardo mientras se escribe.
    let temporizador = 0;
    entrada.addEventListener('input', () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(ejecutar, 180);
    });
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      clearTimeout(temporizador);
      ejecutar();
    });
    for (const sel of [selDisciplina, selRama, selDificultad, selTipo]) {
      sel.addEventListener('change', ejecutar);
    }

    ejecutar();
  } catch (error) {
    console.error('NEXUS: fallo al cargar el índice.', error);
    contenedorResultados.innerHTML = `
      <div class="estado-error" role="alert">
        <strong>No se pudo cargar el índice de contenidos.</strong><br>
        Verifica que las páginas se sirvan con un servidor local y que existan
        data/disciplinas.json y data/contenidos.json.
      </div>`;
    recuento.textContent = '';
  }
}

iniciarExplorar();
