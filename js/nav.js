/* ============================================================
   NEXUS · nav.js
   Navegación adaptable: menú hamburguesa en pantallas pequeñas
   (≤ 620 px). Mejora progresiva: sin JS, la navegación horizontal
   fluida sigue disponible. No duplica la navegación existente.
   ============================================================ */

const MQ_MOVIL = window.matchMedia('(max-width: 620px)');

export function iniciarNavegacion() {
  const boton = document.getElementById('boton-menu');
  const navegacion = document.getElementById('menu-principal');
  if (!boton || !navegacion) return;

  /* Solo con JS se activa el modo hamburguesa y se revela el botón. */
  document.body.classList.add('nav-con-js');
  boton.hidden = false;

  const estaAbierta = () => boton.getAttribute('aria-expanded') === 'true';

  function cerrar() {
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    boton.title = 'Abrir menú';
    navegacion.classList.remove('navegacion--abierta');
  }

  function abrir() {
    boton.setAttribute('aria-expanded', 'true');
    boton.setAttribute('aria-label', 'Cerrar menú');
    boton.title = 'Cerrar menú';
    navegacion.classList.add('navegacion--abierta');
  }

  boton.addEventListener('click', () => (estaAbierta() ? cerrar() : abrir()));

  /* Cerrar al seleccionar una opción del menú. */
  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', cerrar);
  });

  /* Cerrar al hacer clic fuera del menú y del botón. */
  document.addEventListener('click', (evento) => {
    if (
      estaAbierta() &&
      !boton.contains(evento.target) &&
      !navegacion.contains(evento.target)
    ) {
      cerrar();
    }
  });

  /* Cerrar con Escape y devolver el foco al botón. */
  window.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && estaAbierta()) {
      cerrar();
      boton.focus();
    }
  });

  /* Al pasar a escritorio, restablecer el estado. */
  MQ_MOVIL.addEventListener('change', (evento) => {
    if (!evento.matches) cerrar();
  });
}
