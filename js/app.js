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

  const saludo = document.getElementById("saludo");
  if (saludo) {
    const nombre = localStorage.getItem("jugador") || "Participante";
    saludo.innerHTML = `Hola <b>${nombre}</b>, elige tu marcador.`;
  }

  if (!CONFIG.abierto) {
    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.innerText = "⛔ PRONÓSTICOS CERRADOS";
      btnEnviar.style.background = "#666";
    }
    return;
  }

  const btnMasMexico    = document.getElementById("masMexico");
  const btnMenosMexico  = document.getElementById("menosMexico");
  const btnMasChequia   = document.getElementById("masChequia");
  const btnMenosChequia = document.getElementById("menosChequia");

  if (btnMasMexico)    btnMasMexico.addEventListener("click",    () => { golesMexico++; actualizar(); });
  if (btnMenosMexico)  btnMenosMexico.addEventListener("click",  () => { if (golesMexico > 0) { golesMexico--; actualizar(); } });
  if (btnMasChequia)   btnMasChequia.addEventListener("click",   () => { golesRival++; actualizar(); });
  if (btnMenosChequia) btnMenosChequia.addEventListener("click", () => { if (golesRival > 0) { golesRival--; actualizar(); } });

  const btnEnviar = document.getElementById("btnEnviar");
  if (btnEnviar) {
    btnEnviar.addEventListener("click", async () => {
      const jugador = localStorage.getItem("jugador") || "Invitado";
      const datos = {
        jugador,
        jornada: CONFIG.jornada,
        local: CONFIG.local.nombre,
        visitante: CONFIG.visitante.nombre,
        golesLocal: golesMexico,
        golesVisitante: golesRival,
        fecha: new Date().toISOString()
      };
      const guardado = await guardarPronostico(datos);
      if (guardado !== false) {
        localStorage.setItem("golesLocal", golesMexico);
        localStorage.setItem("golesVisitante", golesRival);
        window.location.href = "confirmacion.html";
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPronostico);
} else {
  initPronostico();
}

// ── Página: confirmacion.html ──
document.addEventListener("DOMContentLoaded", () => {
  const resumen = document.getElementById("resumen");
  if (!resumen) return;
  const jugador = localStorage.getItem("jugador") || "Invitado";
  const local = parseInt(localStorage.getItem("golesLocal")) || 0;
  const visitante = parseInt(localStorage.getItem("golesVisitante")) || 0;
  resumen.innerHTML = `
    <div class="coffee">
      <h2>👤 ${jugador}</h2><br>
      ${CONFIG.local.bandera} ${CONFIG.local.nombre} ${local} - ${visitante} ${CONFIG.visitante.nombre} ${CONFIG.visitante.bandera}<br><br>
      ✅ Pronóstico guardado
    </div>
  `;
});