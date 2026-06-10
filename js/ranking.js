import { obtenerRankingGeneral, obtenerPronosticos } from "../utils/storage.js";
import CONFIG from "../data/config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("rankingContainer");
  if (!contenedor) return;

  contenedor.innerHTML = `<p style="text-align:center;color:#fff;">Cargando...</p>`;

  try {
    const general = await obtenerRankingGeneral();

    if (general.length === 0) {
      contenedor.innerHTML = `<div class="coffee">Todavía no hay participantes registrados.</div>`;
      return;
    }

    let html = `
      <div class="coffee" style="background:rgba(24,201,100,.15);margin-bottom:10px;">
        <b>🏆 RANKING GENERAL</b><br>
        <small style="color:#c8d0da">Puntos acumulados todas las jornadas</small>
      </div>
    `;

    general.forEach((item, index) => {
      const medalla = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
      html += `
        <div class="coffee">
          ${medalla} <b>${item.jugador}</b><br><br>
          ⭐ <b style="color:#18C964">${item.puntos} puntos</b>
          &nbsp;·&nbsp; ${item.participaciones} jornada(s)
        </div>
      `;
    });

    const jornada = await obtenerPronosticos(CONFIG.jornada);
    if (jornada.length > 0) {
      html += `
        <div class="coffee" style="background:rgba(245,196,81,.15);margin-top:20px;">
          <b>⚽ JORNADA ${CONFIG.jornada} — ${CONFIG.local.nombre} vs ${CONFIG.visitante.nombre}</b>
        </div>
      `;
      jornada.forEach(item => {
        html += `
          <div class="coffee">
            👤 <b>${item.jugador}</b><br><br>
            ${CONFIG.local.bandera} ${item.golesLocal} - ${item.golesVisitante} ${CONFIG.visitante.bandera}<br>
            ⭐ ${item.puntos} puntos
          </div>
        `;
      });
    }

    contenedor.innerHTML = html;

  } catch(e) {
    console.error("Error ranking:", e);
    contenedor.innerHTML = `<div class="coffee">❌ Error al cargar el ranking</div>`;
  }
});