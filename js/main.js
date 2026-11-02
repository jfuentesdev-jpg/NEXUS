/* ============================================================
   NEXUS · main.js
   Punto de entrada: inicia la navegación adaptable y despacha el
   módulo de la página activa según <body data-page="...">.
   ============================================================ */

import { iniciarNavegacion } from './nav.js?v=0.1.2';

iniciarNavegacion();

const paginas = {
  inicio: () => import('./pages/inicio.js?v=0.1.2'),
  disciplinas: () => import('./pages/disciplinas.js?v=0.1.2'),
  explorar: () => import('./pages/explorar.js?v=0.1.2'),
};

const cargar = paginas[document.body.dataset.page ?? 'inicio'];

Promise.resolve(cargar?.())
  .then((modulo) => modulo?.iniciar?.())
  .catch((error) => console.error('[NEXUS] Error al iniciar la página:', error));
