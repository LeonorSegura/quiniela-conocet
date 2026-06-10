import { db } from "../services/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Guardar pronóstico en Firestore
async function guardarPronostico(datos) {
  try {
    // Verificar si ya participó en esta jornada
    const q = query(
      collection(db, "pronosticos"),
      where("jugador", "==", datos.jugador),
      where("jornada", "==", datos.jornada)
    );
    const existe = await getDocs(q);
    if (!existe.empty) {
      alert(`⚠️ ${datos.jugador} ya registró su pronóstico para la Jornada ${datos.jornada}.`);
      return false;
    }
    await addDoc(collection(db, "pronosticos"), {
      jugador: datos.jugador,
      jornada: datos.jornada,
      local: datos.local,
      visitante: datos.visitante,
      golesLocal: datos.golesLocal,
      golesVisitante: datos.golesVisitante,
      puntos: 0,
      fecha: new Date().toISOString()
    });
    console.log("Pronóstico guardado ✅");
    return true;
  } catch (error) {
    console.error("Error al guardar:", error);
    return false;
  }
}

// Obtener pronósticos por jornada
async function obtenerPronosticos(jornada = null) {
  let q;
  if (jornada) {
    q = query(
      collection(db, "pronosticos"),
      where("jornada", "==", jornada),
      orderBy("fecha", "asc")
    );
  } else {
    q = query(collection(db, "pronosticos"), orderBy("jugador", "asc"));
  }
  const snapshot = await getDocs(q);
  const lista = [];
  snapshot.forEach(doc => {
    lista.push({ id: doc.id, ...doc.data() });
  });
  return lista;
}

// Obtener puntos acumulados por jugador
async function obtenerRankingGeneral() {
  const snapshot = await getDocs(collection(db, "pronosticos"));
  const jugadores = {};
  snapshot.forEach(doc => {
    const d = doc.data();
    if (!jugadores[d.jugador]) {
      jugadores[d.jugador] = { jugador: d.jugador, puntos: 0, participaciones: 0 };
    }
    jugadores[d.jugador].puntos += d.puntos || 0;
    jugadores[d.jugador].participaciones += 1;
  });
  return Object.values(jugadores).sort((a, b) => b.puntos - a.puntos);
}

export { guardarPronostico, obtenerPronosticos, obtenerRankingGeneral };