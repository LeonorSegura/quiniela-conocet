import { guardarPronostico } from "../utils/storage.js";

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

window.masMexico   = function() { golesMexico++; actualizar(); };
window.menosMexico = function() { if (golesMexico > 0) { golesMexico--; actualizar(); } };
window.masRival    = function() { golesRival++; actualizar(); };
window.menosRival  = function() { if (golesRival > 0) { golesRival--; actualizar(); } };

function initPronostico() {
  actualizar();

  const saludo = document.getElementById("saludo");
  if (saludo) {
    const nombre = localStorage.getItem("jugador") || "Participante";
    saludo.innerHTML = `Hola <b>${nombre}</b>, elige tu marcador.`;
  }

  const btnMasMexico   = document.getElementById("masMexico");
  const btnMenosMexico = document.getElementById("menosMexico");
  const btnMasRival    = document.getElementById("masRival");
  const btnMenosRival  = document.getElementById("menosRival");

  if (btnMasMexico)   btnMasMexico.addEventListener("click",   () => { golesMexico++; actualizar(); });
  if (btnMenosMexico) btnMenosMexico.addEventListener("click", () => { if (golesMexico > 0) { golesMexico--; actualizar(); } });
  if (btnMasRival)    btnMasRival.addEventListener("click",    () => { golesRival++; actualizar(); });
  if (btnMenosRival)  btnMenosRival.addEventListener("click",  () => { if (golesRival > 0) { golesRival--; actualizar(); } });

  const btnEnviar = document.getElementById("btnEnviar");
  if (btnEnviar) {
    btnEnviar.addEventListener("click", async () => {
      const jugador = localStorage.getItem("jugador") || "Invitado";
      const datos = {
        jugador,
        golesLocal: golesMexico,
        golesVisitante: golesRival,
        fecha: new Date().toISOString()
      };
      await guardarPronostico(datos);
localStorage.setItem("golesLocal", golesMexico);
localStorage.setItem("golesVisitante", golesRival);
window.location.href = "confirmacion.html";
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
      ⚽ México ${local} - ${visitante} Suiza<br><br>
      ✅ Pronóstico guardado
    </div>
  `;
});