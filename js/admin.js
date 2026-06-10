import { db } from "../services/firebase.js";
import CONFIG from "../data/config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnCalcular = document.getElementById("btnCalcular");
  if (!btnCalcular) return;

  // Mostrar jornada actual
  const info = document.getElementById("infoJornada");
  if (info) {
    info.innerHTML = `
      <div class="coffee">
        ⚽ Jornada ${CONFIG.jornada}<br>
        ${CONFIG.local.bandera} ${CONFIG.local.nombre} vs ${CONFIG.visitante.nombre} ${CONFIG.visitante.bandera}
      </div>
    `;
  }

  btnCalcular.addEventListener("click", async () => {
    const golesLocal = parseInt(document.getElementById("golesLocalReal").value);
    const golesVisitante = parseInt(document.getElementById("golesVisitanteReal").value);

    let resultadoReal = "empate";
    if (golesLocal > golesVisitante) resultadoReal = "local";
    if (golesLocal < golesVisitante) resultadoReal = "visitante";

    const contenedor = document.getElementById("resultadoAdmin");
    contenedor.innerHTML = `<div class="coffee">Calculando puntos...</div>`;

    try {
      const q = query(
        collection(db, "pronosticos"),
        where("jornada", "==", CONFIG.jornada),
        orderBy("fecha", "asc")
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        contenedor.innerHTML = `<div class="coffee">⚠️ No hay pronósticos para la Jornada ${CONFIG.jornada}</div>`;
        return;
      }

      let html = "";
      let promesas = [];

      snapshot.forEach(documento => {
        const datos = documento.data();
        let puntos = 0;

        if (datos.golesLocal === golesLocal && datos.golesVisitante === golesVisitante) {
          puntos = 3;
        } else {
          let resultadoPronostico = "empate";
          if (datos.golesLocal > datos.golesVisitante) resultadoPronostico = "local";
          if (datos.golesLocal < datos.golesVisitante) resultadoPronostico = "visitante";
          if (resultadoPronostico === resultadoReal) puntos = 1;
        }

        promesas.push(updateDoc(doc(db, "pronosticos", documento.id), { puntos }));

        const medalla = puntos === 3 ? "🥇" : puntos === 1 ? "✅" : "❌";
        html += `
          <div class="coffee">
            ${medalla} <b>${datos.jugador}</b><br>
            Pronóstico: ${datos.golesLocal} - ${datos.golesVisitante}<br>
            <b style="color:#18C964">${puntos} puntos</b>
          </div>
        `;
      });

      await Promise.all(promesas);
      contenedor.innerHTML = `
        <div class="coffee" style="color:#18C964">
          ✅ Resultado J${CONFIG.jornada}: ${CONFIG.local.nombre} ${golesLocal} - ${golesVisitante} ${CONFIG.visitante.nombre}
        </div>
        ${html}
      `;

    } catch(e) {
      console.error(e);
      contenedor.innerHTML = `<div class="coffee">❌ Error al calcular</div>`;
    }
  });
});