/* ============================================================
   NEXUS — theme.js
   Selector de tema (oscuro / claro / automático) con preferencia
   persistente, según la identidad visual del documento maestro.
   ============================================================ */

const CLAVE = 'nexus:tema';

/** Aplica el atributo data-tema en <html>. */
function aplicar(valor) {
  const raiz = document.documentElement;
  if (valor === 'oscuro' || valor === 'claro') {
    raiz.setAttribute('data-tema', valor);
  } else {
    raiz.removeAttribute('data-tema'); // automático: lo decide el sistema
  }
}

/** Preferencia guardada, si existe y es válida. */
export function temaGuardado() {
  const valor = localStorage.getItem(CLAVE);
  return valor === 'oscuro' || valor === 'claro' || valor === 'auto' ? valor : null;
}

/**
 * Conecta el <select> del tema con la preferencia persistente.
 * @param {HTMLSelectElement|null} selectorTema
 */
export function iniciarTema(selectorTema) {
  if (!selectorTema) return;

  const guardado = temaGuardado();
  if (guardado) selectorTema.value = guardado;
  else selectorTema.value = 'auto';

  // Refleja de inmediato la preferencia elegida en esta sesión.
  if (selectorTema.value !== 'auto') aplicar(selectorTema.value);

  selectorTema.addEventListener('change', () => {
    const valor = selectorTema.value;
    if (valor === 'auto') {
      localStorage.removeItem(CLAVE);
      aplicar('auto');
    } else {
      localStorage.setItem(CLAVE, valor);
      aplicar(valor);
    }
  });
}

/* Aplicación temprana del tema guardado (evita destello al cargar). */
if (temaGuardado()) aplicar(temaGuardado());

/**
 * Menú de navegación móvil: botón hamburguesa accesible.
 * @param {HTMLButtonElement|null} botonMenu
 * @param {HTMLElement|null} listaNavegacion
 */
export function iniciarMenu(botonMenu, listaNavegacion) {
  if (!botonMenu || !listaNavegacion) return;

  const cerrar = () => {
    listaNavegacion.setAttribute('data-abierta', 'false');
    botonMenu.setAttribute('aria-expanded', 'false');
  };

  botonMenu.addEventListener('click', () => {
    const abierta = botonMenu.getAttribute('aria-expanded') === 'true';
    listaNavegacion.setAttribute('data-abierta', String(!abierta));
    botonMenu.setAttribute('aria-expanded', String(!abierta));
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && botonMenu.getAttribute('aria-expanded') === 'true') {
      cerrar();
      botonMenu.focus();
    }
  });

  document.addEventListener('click', (evento) => {
    if (
      botonMenu.getAttribute('aria-expanded') === 'true' &&
      !listaNavegacion.contains(evento.target) &&
      !botonMenu.contains(evento.target)
    ) {
      cerrar();
    }
  });
}

/* Autoconexión de los controles de encabezado de la página actual. */
iniciarTema(document.getElementById('selector-tema'));
iniciarMenu(document.getElementById('boton-menu'), document.getElementById('navegacion-lista'));
