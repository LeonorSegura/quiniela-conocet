import { obtenerPronosticos } from "../utils/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("rankingContainer");
  if (!contenedor) return;

  contenedor.innerHTML = `<p style="text-align:center;color:#fff;">Cargando...</p>`;

  try {
    const lista = await obtenerPronosticos();

    if (lista.length === 0) {
      contenedor.innerHTML = `
        <div class="coffee">
          Todavía no hay participantes registrados.
        </div>
      `;
      return;
    }

    let html = "";
    lista.forEach((item, index) => {
      const medalla = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
      html += `
        <div class="coffee">
          ${medalla} <b>${item.jugador}</b><br><br>
          Pronóstico: 🇲🇽 ${item.golesLocal} - ${item.golesVisitante} 🏳️<br><br>
          ⭐ 0 puntos (provisional)
        </div>
      `;
    });

    contenedor.innerHTML = html;
  } catch(e) {
    console.error("Error ranking:", e);
  }
});