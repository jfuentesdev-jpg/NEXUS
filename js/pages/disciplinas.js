/* ============================================================
   NEXUS · pages/disciplinas.js
   Página de disciplinas: jerarquía Disciplina → Rama con conteos.
   ============================================================ */

import { getDisciplinas, getCatalogo } from '../data.js?v=0.1.0';

export function iniciar() {
  return Promise.all([getDisciplinas(), getCatalogo()])
    .then(([datosDisciplinas, datosCatalogo]) => {
      const contenedor = document.getElementById('lista-disciplinas');
      if (!contenedor) return;

      const contenido = datosCatalogo.contenido ?? [];
      contenedor.replaceChildren(
        ...(datosDisciplinas.disciplinas ?? []).map((disciplina) =>
          crearBloque(disciplina, contenido)
        )
      );
    })
    .catch(mostrarError);
}

function crearBloque(disciplina, contenido) {
  const seccion = document.createElement('section');
  seccion.className = 'disciplina-bloque';
  seccion.id = disciplina.slug;

  const titulo = document.createElement('h2');
  titulo.textContent = disciplina.nombre;
  seccion.append(titulo);

  const intro = document.createElement('p');
  intro.className = 'disciplina-intro';
  intro.textContent = disciplina.descripcion;
  seccion.append(intro);

  const rejilla = document.createElement('div');
  rejilla.className = 'rejilla rejilla--ramas';

  disciplina.ramas.forEach((rama) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';

    const tituloRama = document.createElement('h3');
    tituloRama.className = 'tarjeta-titulo';
    tituloRama.textContent = rama.nombre;

    const descripcion = document.createElement('p');
    descripcion.className = 'tarjeta-descripcion';
    descripcion.textContent = rama.descripcion;

    const pie = document.createElement('div');
    pie.className = 'tarjeta-pie';

    const enlace = document.createElement('a');
    enlace.href = `explorar.html?disciplina=${disciplina.slug}&rama=${rama.slug}`;
    enlace.textContent = 'Explorar';

    const total = contenido.filter((x) => x.rama?.slug === rama.slug).length;
    const meta = document.createElement('span');
    meta.textContent = `${total} contenido${total === 1 ? '' : 's'}`;

    pie.append(enlace, meta);
    tarjeta.append(tituloRama, descripcion, pie);
    rejilla.append(tarjeta);
  });

  seccion.append(rejilla);
  return seccion;
}

function mostrarError() {
  const contenedor = document.getElementById('lista-disciplinas');
  if (!contenedor) return;
  const aviso = document.createElement('p');
  aviso.className = 'sin-resultados';
  aviso.textContent =
    'No se pudo cargar el catálogo. Verifica que el proyecto se sirva con un servidor estático (no directamente desde el archivo).';
  contenedor.replaceChildren(aviso);
}
