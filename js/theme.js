/* ============================================================
   NEXUS · theme.js
   Temas oscuro/claro con preferencia persistente.
   Sin preferencia guardada → sigue al sistema (§11, Temas).
   ============================================================ */

const CLAVE = 'nexus-tema';
const MQ_CLARO = window.matchMedia('(prefers-color-scheme: light)');

function temaSistema() {
  return MQ_CLARO.matches ? 'claro' : 'oscuro';
}

function resolver() {
  try {
    const pref = localStorage.getItem(CLAVE);
    if (pref === 'oscuro' || pref === 'claro') return pref;
  } catch (error) {
    /* almacenamiento no disponible: se usa el tema del sistema */
  }
  return temaSistema();
}

function actualizarBoton(tema) {
  const boton = document.getElementById('boton-tema');
  if (!boton) return;
  const destino = tema === 'claro' ? 'oscuro' : 'claro';
  boton.title = `Cambiar a tema ${destino}`;
  boton.setAttribute('aria-label', `Cambiar a tema ${destino}`);
}

export function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  actualizarBoton(tema);
}

export function alternarTema() {
  const actual = document.documentElement.dataset.theme;
  const nuevo = actual === 'claro' ? 'oscuro' : 'claro';
  try {
    localStorage.setItem(CLAVE, nuevo);
  } catch (error) {
    /* sin persistencia: el cambio vale para esta visita */
  }
  aplicarTema(nuevo);
}

export function iniciarTema() {
  aplicarTema(resolver());
  MQ_CLARO.addEventListener('change', () => {
    try {
      if (!localStorage.getItem(CLAVE)) aplicarTema(temaSistema());
    } catch (error) {
      /* la preferencia manual tiene prioridad */
    }
  });
  document.getElementById('boton-tema')?.addEventListener('click', alternarTema);
}
