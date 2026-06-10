import { guardarPronostico } from "../utils/storage.js";
import CONFIG from "../data/config.js";

// ── Página: participar.html ──
document.addEventListener("DOMContentLoaded", () => {
  const btnGuardar = document.getElementById("btnGuardar");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const nombre = document.getElementById("nombre").value.trim();
      if (nombre === "") {
        alert("Escribe tu nombre para continuar.");
        return;
      }
      localStorage.setItem("jugador", nombre);
      window.location.href = "pronostico.html";
    });
  }
});

// ── Página: pronostico.html ──
let golesMexico = 0;
let golesRival = 0;

function actualizar() {
  const mx = document.getElementById("mx");
  const rv = document.getElementById("rv");
  if (mx) mx.innerText = golesMexico;
  if (rv) rv.innerText = golesRival;
}

function initPronostico() {
  actualizar();

  // Mostrar info del partido desde CONFIG
  const localNombre = document.getElementById("local");
  const visitanteNombre = document.getElementById("visitante");
  const localBandera = document.getElementById("localBandera");
  const visitanteBandera = document.getElementById("visitanteBandera");
  const jornadaTexto = document.getElementById("jornadaTexto");

  if (localNombre) localNombre.innerText = CONFIG.local.nombre;
  if (visitanteNombre) visitanteNombre.innerText = CONFIG.visitante.nombre;
  if (localBandera) localBandera.innerText = CONFIG.local.bandera;
  if (visitanteBandera) visitanteBandera.innerText = CONFIG.visitante.bandera;
  if (jornadaTexto) jornadaTexto.innerText = `⚽ JORNADA ${CONFIG.jornada} · ${CONFIG.torneo}`;

  const saludo = document.getElementById("saludo");
  if (saludo) {
    const nombre = localStorage.getItem("jugador") || "Participante";
    saludo.innerHTML = `Hola <b>${nombre}</b>, elige tu marcador.`;
  }

  // Verificar si está abierto
  if (!CONFIG.abierto) {
    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.innerText = "⛔ PRONÓSTICOS CERRADOS";
      btnEnviar.style.background = "#666";
    }
    return;
  }

  const btnMasMexico   = document.getElementById("masMexico");
  const btnMenosMexico = document.getEle