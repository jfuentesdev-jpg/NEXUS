/* ============================================================
   NEXUS · main.js
   Punto de entrada: inicia el tema y despacha el módulo de la
   página activa según <body data-page="...">.
   ============================================================ */

import { iniciarTema } from './theme.js';

iniciarTema();

const paginas = {
  inicio: () => import('./pages/inicio.js'),
  disciplinas: () => import('./pages/disciplinas.js'),
  explorar: () => import('./pages/explorar.js'),
};

const cargar = paginas[document.body.dataset.page ?? 'inicio'];

Promise.resolve(cargar?.())
  .then((modulo) => modulo?.iniciar?.())
  .catch((error) => console.error('[NEXUS] Error al iniciar la página:', error));
