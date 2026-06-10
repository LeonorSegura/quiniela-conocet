import { db } from "../services/firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnCalcular = document.getElementById("btnCalcular");
  if (!btnCalcular) return;

  btnCalcular.addEventListener("click", async () => {
    const golesLocal = parseInt(document.getElementById("golesLocalReal").value);
    const golesVisitante = parseInt(document.getElementById("golesVisitanteReal").value);

    // Determinar resultado real
    let resultadoReal = "empate";
    if (golesLocal > golesVisitante) resultadoReal = "local";
    if (golesLocal < golesVisitante) resultadoReal = "visitante";

    const contenedor = document.getElementById("resultadoAdmin");
    contenedor.innerHTML = `<div class="coffee">Calculando puntos...</div>`;

    try {
      const q = query(collection(db, "pronosticos"), orderBy("fecha", "asc"));
      const snapshot = await getDocs(q);

      let html = "";
      let promesas = [];

      snapshot.forEach(documento => {
        const datos = documento.data();
        let puntos = 0;

        // Marcador exacto = 3 puntos
        if (datos.golesLocal === golesLocal && datos.golesVisitante === golesVisitante) {
          puntos = 3;
        } else {
          // Ganador correcto = 1 punto
          let resultadoPronostico = "empate";
          if (datos.golesLocal > datos.golesVisitante) resultadoPronostico = "local";
          if (datos.golesLocal < datos.golesVisitante) resultadoPronostico = "visitante";
          if (resultadoPronostico === resultadoReal) puntos = 1;
        }

        // Actualizar en Firestore
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
          ✅ Resultado: México ${golesLocal} - ${golesVisitante} Sudáfrica
        </div>
        ${html}
      `;

    } catch(e) {
      console.error(e);
      contenedor.innerHTML = `<div class="coffee">❌ Error al calcular</div>`;
    }
  });
});