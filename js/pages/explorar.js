/* ============================================================
   NEXUS · pages/explorar.js
   Biblioteca: búsqueda, filtros (disciplina, rama, dificultad)
   y sincronización del estado con la URL.
   ============================================================ */

import { getDisciplinas, getCatalogo } from '../data.js?v=0.1.0';
import { crearTarjetaContenido } from '../components.js?v=0.1.0';
import { buscar, prepararBusquedas } from '../search.js?v=0.1.0';

const DIFICULTADES = ['básica', 'intermedia'];

export function iniciar() {
  return Promise.all([getDisciplinas(), getCatalogo()])
    .then(([datosDisciplinas, datosCatalogo]) => {
      const contenido = datosCatalogo.contenido ?? [];
      const disciplinas = datosDisciplinas.disciplinas ?? [];
      const indice = prepararBusquedas(contenido);

      const ui = capturarControles();
      poblarFiltros(ui, disciplinas);
      aplicarParametros(ui, disciplinas);
      escucharEventos(ui, contenido, indice);
      refrescar(ui, contenido, indice);
    })
    .catch(mostrarError);
}

/* --- Controles --- */

function capturarControles() {
  return {
    formulario: document.getElementById('filtros'),
    busqueda: document.getElementById('busqueda'),
    disciplina: document.getElementById('filtro-disciplina'),
    rama: document.getElementById('filtro-rama'),
    dificultad: document.getElementById('filtro-dificultad'),
    meta: document.getElementById('resultado-meta'),
    salida: document.getElementById('resultados'),
    vacio: document.getElementById('estado-vacio'),
  };
}

function poblarFiltros(ui, disciplinas) {
  poblarSelect(ui.disciplina, 'Todas las disciplinas', disciplinas.map((d) => ({
    valor: d.slug,
    texto: d.nombre,
  })));

  poblarSelect(ui.dificultad, 'Todas', DIFICULTADES.map((d) => ({
    valor: d,
    texto: d.charAt(0).toUpperCase() + d.slice(1),
  })));
}

function poblarSelect(select, textoVacio, opciones) {
  select.replaceChildren(new Option(textoVacio, ''));
  opciones.forEach(({ valor, texto }) => select.append(new Option(texto, valor)));
}

/** El selector de rama depende de la disciplina elegida. */
function poblarRamas(ui, disciplinas) {
  const disciplina = disciplinas.find((d) => d.slug === ui.disciplina.value);
  const ramas = disciplina?.ramas ?? [];

  poblarSelect(ui.rama, 'Todas las ramas', ramas.map((r) => ({
    valor: r.slug,
    texto: r.nombre,
  })));
  ui.rama.disabled = !disciplina;
}

/* --- Estado inicial desde la URL (?q=&disciplina=&rama=&dificultad=) --- */

function aplicarParametros(ui, disciplinas) {
  const parametros = new URLSearchParams(window.location.search);

  ui.busqueda.value = parametros.get('q') ?? '';

  asignar(ui.disciplina, parametros.get('disciplina'));
  poblarRamas(ui, disciplinas);
  asignar(ui.rama, parametros.get('rama'));

  const dificultad = (parametros.get('dificultad') ?? '').toLowerCase();
  asignar(ui.dificultad, DIFICULTADES.includes(dificultad) ? dificultad : '');
}

function asignar(select, valor) {
  valor = valor ?? '';
  if ([...select.options].some((o) => o.value === valor)) select.value = valor;
}

/* --- Eventos --- */

function escucharEventos(ui, contenido, indice) {
  ui.formulario.addEventListener('submit', (evento) => evento.preventDefault());

  ui.disciplina.addEventListener('change', () => {
    ui.rama.value = '';
    ui.rama.disabled = !ui.disciplina.value;
    refrescar(ui, contenido, indice);
  });

  [ui.rama, ui.dificultad].forEach((select) => {
    select.addEventListener('change', () => refrescar(ui, contenido, indice));
  });

  let demora;
  ui.busqueda.addEventListener('input', () => {
    clearTimeout(demora);
    demora = setTimeout(() => refrescar(ui, contenido, indice), 250);
  });

  document.getElementById('limpiar-filtros')?.addEventListener('click', () => {
    ui.busqueda.value = '';
    ui.disciplina.value = '';
    ui.rama.value = '';
    ui.rama.disabled = true;
    ui.dificultad.value = '';
    refrescar(ui, contenido, indice);
    ui.busqueda.focus();
  });
}

/* --- Aplicación de filtros y búsqueda --- */

function refrescar(ui, contenido, indice) {
  const consulta = ui.busqueda.value.trim();
  const slugDisciplina = ui.disciplina.value;
  const slugRama = ui.rama.value;
  const dificultad = ui.dificultad.value;

  let lista = contenido;
  if (slugDisciplina) lista = lista.filter((x) => x.disciplina?.slug === slugDisciplina);
  if (slugRama) lista = lista.filter((x) => x.rama?.slug === slugRama);
  if (dificultad) lista = lista.filter((x) => x.dificultad === dificultad);

  if (consulta) {
    const preparados = new Map(indice.map((e) => [e.item.codigo, e]));
    lista = buscar(lista.map((x) => preparados.get(x.codigo)).filter(Boolean), consulta);
  } else {
    lista = [...lista].sort((a, b) =>
      (b.fecha_actualizacion ?? '').localeCompare(a.fecha_actualizacion ?? '')
    );
  }

  renderResultados(ui, lista, consulta);
  actualizarParametros(consulta, slugDisciplina, slugRama, dificultad);
}

function renderResultados(ui, lista, consulta) {
  ui.salida.replaceChildren(...lista.map(crearTarjetaContenido));
  ui.vacio.hidden = lista.length > 0;

  const sufijo = consulta ? ` para “${consulta}”` : '';
  ui.meta.textContent = `${lista.length} contenido${lista.length === 1 ? '' : 's'}${sufijo}`;
}

function actualizarParametros(consulta, disciplina, rama, dificultad) {
  const parametros = new URLSearchParams();
  if (consulta) parametros.set('q', consulta);
  if (disciplina) parametros.set('disciplina', disciplina);
  if (rama) parametros.set('rama', rama);
  if (dificultad) parametros.set('dificultad', dificultad);

  const cadena = parametros.toString();
  window.history.replaceState(null, '', `explorar.html${cadena ? `?${cadena}` : ''}`);
}

function mostrarError() {
  const contenedor = document.getElementById('resultados');
  if (!contenedor) return;
  const aviso = document.createElement('p');
  aviso.className = 'sin-resultados';
  aviso.textContent =
    'No se pudo cargar el catálogo. Verifica que el proyecto se sirva con un servidor estático (no directamente desde el archivo).';
  contenedor.replaceChildren(aviso);
}
