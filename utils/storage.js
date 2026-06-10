import { db } from "../services/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Guardar pronóstico en Firestore
async function guardarPronostico(datos) {
  try {
    await addDoc(collection(db, "pronosticos"), {
      jugador: datos.jugador,
      golesLocal: datos.golesLocal,
      golesVisitante: datos.golesVisitante,
      fecha: new Date().toISOString()
    });
    console.log("Pronóstico guardado ✅");
  } catch (error) {
    console.error("Error al guardar:", error);
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