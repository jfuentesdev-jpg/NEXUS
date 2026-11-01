/* ============================================================
   NEXUS · pages/inicio.js
   Renderiza Disciplinas y Contenidos destacados de la página de inicio.
   ============================================================ */

import { getDisciplinas, getCatalogo } from '../data.js';
import { crearTarjetaContenido, crearTarjetaDisciplina } from '../components.js';

export function iniciar() {
  conectarBuscador();

  return Promise.all([getDisciplinas(), getCatalogo()])
    .then(([datosDisciplinas, datosCatalogo]) => {
      const contenido = datosCatalogo.contenido ?? [];
      renderDisciplinas(datosDisciplinas.disciplinas ?? [], contenido);

      const destacados = contenido.filter((item) => item.destacado);
      renderDestacados(destacados.length ? destacados : contenido.slice(0, 4));
    })
    .catch(mostrarError);
}

/* Búsqueda central del hero → Explorar con la consulta en la URL. */
function conectarBuscador() {
  const formulario = document.querySelector('.buscador--hero');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const consulta = formulario.querySelector('input')?.value.trim();
    const destino = consulta
      ? `pages/explorar.html?q=${encodeURIComponent(consulta)}`
      : 'pages/explorar.html';
    window.location.assign(destino);
  });
}

function renderDisciplinas(disciplinas, contenido) {
  const contenedor = document.getElementById('rejilla-disciplinas');
  if (!contenedor) return;

  const tarjetas = disciplinas.map((disciplina) => {
    const total = contenido.filter((x) => x.disciplina?.slug === disciplina.slug).length;
    return crearTarjetaDisciplina(disciplina, total);
  });

  contenedor.replaceChildren(...tarjetas);
}

function renderDestacados(items) {
  const contenedor = document.getElementById('rejilla-destacados');
  if (!contenedor) return;
  contenedor.replaceChildren(...items.map(crearTarjetaContenido));
}

function mostrarError() {
  ['rejilla-disciplinas', 'rejilla-destacados'].forEach((id) => {
    const contenedor = document.getElementById(id);
    if (contenedor) {
      const aviso = document.createElement('p');
      aviso.className = 'sin-resultados';
      aviso.textContent =
        'No se pudo cargar el catálogo. Verifica que el proyecto se sirva con un servidor estático (no directamente desde el archivo).';
      contenedor.replaceChildren(aviso);
    }
  });
}
