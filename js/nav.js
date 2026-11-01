/* ============================================================
   NEXUS · nav.js
   Navegación adaptable:
   - Escritorio (≥ 769 px): menú horizontal original.
   - Móvil (≤ 768 px): fila única (logotipo + hamburguesa) y
     menú desplegable con las secciones y el selector de tema.
   Mejora progresiva: sin JS, la navegación horizontal fluida
   sigue disponible. Reutiliza la única navegación del documento.
   ============================================================ */

const MQ_MOVIL = window.matchMedia('(max-width: 768px)');

export function iniciarNavegacion() {
  const boton = document.getElementById('boton-menu');
  const navegacion = document.getElementById('menu-principal');
  if (!boton || !navegacion) return;

  /* Solo con JS se activa el modo móvil y se revela el botón. */
  document.body.classList.add('nav-con-js');
  boton.hidden = false;

  /* El selector de tema se traslada al panel en móvil y vuelve a la
     barra en escritorio, sin duplicar markup. */
  const botonTema = document.getElementById('boton-tema');
  const padreOriginal = botonTema?.parentElement ?? null;
  const hermanoOriginal = botonTema?.nextElementSibling ?? null;

  function reubicarSelectorTema() {
    if (!botonTema) return;
    if (MQ_MOVIL.matches) {
      if (botonTema.parentElement !== navegacion) navegacion.append(botonTema);
    } else if (padreOriginal && botonTema.parentElement !== padreOriginal) {
      if (hermanoOriginal) {
        padreOriginal.insertBefore(botonTema, hermanoOriginal);
      } else {
        padreOriginal.append(botonTema);
      }
    }
  }

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

  boton.addEventListener('click', (evento) => {
    if (estaAbierta()) {
      cerrar();
    } else {
      abrir();
      /* Apertura por teclado: el foco pasa al primer enlace. */
      if (evento.detail === 0) navegacion.querySelector('a')?.focus();
    }
  });

  /* Cerrar al seleccionar una sección. */
  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', cerrar);
  });

  /* Cerrar al hacer clic fuera del botón y del panel. */
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

  function aplicarEstado() {
    reubicarSelectorTema();
    if (!MQ_MOVIL.matches) cerrar();
  }

  MQ_MOVIL.addEventListener('change', aplicarEstado);
  aplicarEstado();
}
