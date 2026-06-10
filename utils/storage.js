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
    // Verificar si ya participó
    const q = query(collection(db, "pronosticos"), where("jugador", "==", datos.jugador));
    const existe = await getDocs(q);
    if (!existe.empty) {
      alert("⚠️ " + datos.jugador + " ya registró su pronóstico.");
      return false;
    }
    await addDoc(collection(db, "pronosticos"), {
      jugador: datos.jugador,
      golesLocal: datos.golesLocal,
      golesVisitante: datos.golesVisitante,
      fecha: new Date().toISOString()
    });
    console.log("Pronóstico guardado ✅");
    return true;
  } catch (error) {
    console.error("Error al guardar:", error);
    return false;
  }
}

// Obtener todos los pronósticos ordenados por fecha
async function obtenerPronosticos() {
  const q = query(collection(db, "pronosticos"), orderBy("fecha", "asc"));
  const snapshot = await getDocs(q);
  const lista = [];
  snapshot.forEach(doc => {
    lista.push({ id: doc.id, ...doc.data() });
  });
  return lista;
}

export { guardarPronostico, obtenerPronosticos };