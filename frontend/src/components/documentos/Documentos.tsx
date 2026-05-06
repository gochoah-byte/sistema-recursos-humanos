import React, { useEffect, useState } from "react";
import { EmpleadosService } from "../../service/empleados.service";
import {
  getTiposDocumento,
  getDocumentosPorEmpleado,
  subirDocumento,
} from "../../service/documentos.service";

/* 🔹 TIPOS */
interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
}

interface TipoDocumento {
  id: number;
  nombre: string;
  es_obligatorio: boolean;
}

interface Documento {
  id: number;
  tipo_documento_id: number;
}


type DocsPorEmpleado = {
  [key: number]: Documento[];
};

export const Documentos: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [docsPorEmpleado, setDocsPorEmpleado] = useState<DocsPorEmpleado>({});

  const [modal, setModal] = useState(false);
  const [empleadoId, setEmpleadoId] = useState<number | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | "">("");
  const [archivo, setArchivo] = useState<File | null>(null);

  /* 🔹 FUNCIÓN ANTES DEL useEffect */
  const cargarDatos = async () => {
    try {
      const empleadosData = await EmpleadosService.getAll();
      const tiposRes = await getTiposDocumento();

      setEmpleados(empleadosData);
      setTipos(tiposRes.data);

      const docsTemp: DocsPorEmpleado = {};

      for (const emp of empleadosData) {
        const docsRes = await getDocumentosPorEmpleado(emp.id);
        docsTemp[emp.id] = docsRes.data;
      }

      setDocsPorEmpleado(docsTemp);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

 useEffect(() => {
  const init = async () => {
    await cargarDatos();
  };

  init();
}, []);

  const calcularEstado = (empleadoId: number) => {
    const docs = docsPorEmpleado[empleadoId] || [];
    const obligatorios = tipos.filter((t) => t.es_obligatorio);

    if (docs.length === 0) return "Incompleto";

    const completo = obligatorios.every((t) =>
      docs.some((d) => Number(d.tipo_documento_id) === Number(t.id))
    );

    return completo ? "Completo" : "En Proceso";
  };

  const abrirModal = (id: number) => {
    setEmpleadoId(id);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuarioId = usuarioSesion.id || "1";

    if (!empleadoId || !tipoSeleccionado || !archivo) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("empleado_id", empleadoId.toString());
      formData.append("tipo_documento_id", tipoSeleccionado.toString());
      formData.append("file", archivo);
      formData.append("subido_por_usuario_id", usuarioId.toString());

      await subirDocumento(formData);

      setModal(false);
      setArchivo(null);
      setTipoSeleccionado("");

      await cargarDatos();

      alert("¡Documento subido correctamente!");
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al subir documento.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expediente Digital</h2>

      {/* 🔹 FOLDERS */}
      <div className="flex gap-3 mb-6">
        <button className="bg-green-100 px-4 py-2 rounded">
          Obligatorios
        </button>
        <button className="bg-yellow-100 px-4 py-2 rounded">
          Académicos
        </button>
        <button className="bg-blue-100 px-4 py-2 rounded">
          Contratos
        </button>
      </div>

      {/* 🔹 TABLA */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Empleado</th>
            <th className="p-2">DPI</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>

        <tbody>
          {empleados.map((emp) => {
            const estado = calcularEstado(emp.id);

            return (
              <tr key={emp.id}>
                <td className="p-2">
                  {emp.nombres} {emp.apellidos}
                </td>
                <td className="p-2">{emp.dpi}</td>

                <td className="p-2">
                  <span
                    className={`font-bold ${
                      estado === "Completo"
                        ? "text-green-500"
                        : estado === "Incompleto"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    ● {estado}
                  </span>
                </td>

                <td className="p-2">
                  <button
                    onClick={() => abrirModal(emp.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Subir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 🔹 MODAL */}
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Subir Documento</h3>

            <form onSubmit={handleSubmit}>
              {/* ✔️ ACCESIBLE */}
              <label htmlFor="tipoDocumento">Tipo Documento</label>
              <select
                id="tipoDocumento"
                className="w-full mb-3 border p-2"
                value={tipoSeleccionado}
                onChange={(e) =>
                  setTipoSeleccionado(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Seleccione</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              <label htmlFor="archivo">Archivo</label>
              <input
                id="archivo"
                type="file"
                className="w-full mb-3"
                onChange={(e) =>
                  setArchivo(e.target.files?.[0] || null)
                }
              />

              <button
                type="submit"
                className="bg-green-500 text-white w-full py-2 rounded"
              >
                Subir
              </button>
            </form>

            <button
              onClick={() => setModal(false)}
              className="mt-3 w-full text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};