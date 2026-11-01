/* ============================================================
   NEXUS · main.js
   Punto de entrada: inicia el tema y despacha el módulo de la
   página activa según <body data-page="...">.
   ============================================================ */

import { iniciarTema } from './theme.js?v=0.1.0';
import { iniciarNavegacion } from './nav.js?v=0.1.0';

iniciarTema();
iniciarNavegacion();

const paginas = {
  inicio: () => import('./pages/inicio.js?v=0.1.0'),
  disciplinas: () => import('./pages/disciplinas.js?v=0.1.0'),
  explorar: () => import('./pages/explorar.js?v=0.1.0'),
};

const cargar = paginas[document.body.dataset.page ?? 'inicio'];

Promise.resolve(cargar?.())
  .then((modulo) => modulo?.iniciar?.())
  .catch((error) => console.error('[NEXUS] Error al iniciar la página:', error));
