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

  const nombres = docs.map((d: Documento) => {
    const tipo = tipos.find(
      (t) => Number(t.id) === Number(d.tipo_documento_id)
    );

    return tipo?.nombre?.toLowerCase() || "";
  });

  const obligatorios = [
    "dpi",
    "penal",
    "policia",
    "cv",
    "contrato",
    "titulo"
  ];

  const completos = obligatorios.filter((req) =>
    nombres.some((n) => n.includes(req))
  );

  if (completos.length === obligatorios.length) {
    return "Completo";
  }

  if (completos.length >= 3) {
    return "En Proceso";
  }

  return "Incompleto";
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
     {/* 🔹 ESTADÍSTICAS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* COMPLETOS */}
  <div className="bg-[#eef4ea] rounded-3xl p-6 shadow-lg">
    <h3 className="text-gray-500 text-sm font-semibold">
      EXPEDIENTES COMPLETOS
    </h3>

    <h1 className="text-5xl font-bold text-[#7b8b70] mt-4">
      {
        empleados.filter(
          (e) => calcularEstado(e.id) === "Completo"
        ).length
      }
    </h1>

    <p className="text-gray-500 mt-2">
      Documentación completa
    </p>
  </div>

  {/* EN PROCESO */}
<div className="bg-[#fbeae0] rounded-3xl p-6 shadow-lg">
    <h3 className="text-gray-500 text-sm font-semibold">
      EN PROCESO
    </h3>

    <h1 className="text-5xl font-bold text-[#c59c7d] mt-4">
      {
        empleados.filter(
          (e) => calcularEstado(e.id) === "En Proceso"
        ).length
      }
    </h1>

    <p className="text-gray-500 mt-2">
      Documentos pendientes
    </p>
  </div>

  {/* INCOMPLETOS */}
  <div className="bg-[#fdecec] rounded-3xl p-6 shadow-lg">
    <h3 className="text-gray-500 text-sm font-semibold">
      INCOMPLETOS
    </h3>

    <h1 className="text-5xl font-bold text-[#d46a6a] mt-4">
      {
        empleados.filter(
          (e) => calcularEstado(e.id) === "Incompleto"
        ).length
      }
    </h1>

    <p className="text-gray-500 mt-2">
      Expedientes faltantes
    </p>
  </div>
</div>
      {/* 🔹 TABLA */}
     <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

  <div className="bg-[#a4ab9a] text-white px-6 py-4 flex justify-between items-center">
    <div>
      <h3 className="text-xl font-bold">Gestión de Expedientes</h3>
      <p className="text-sm opacity-80">
        Validación de documentos por empleado
      </p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">

      <thead className="bg-gray-50 text-gray-700">
        <tr>
          <th className="p-4 text-left">Empleado</th>
          <th className="p-4 text-left">DPI</th>
          <th className="p-4 text-center">Penales</th>
          <th className="p-4 text-center">Policíacos</th>
          <th className="p-4 text-center">CV</th>
          <th className="p-4 text-center">Título</th>
          <th className="p-4 text-center">Contrato</th>
          <th className="p-4 text-center">Estado</th>
          <th className="p-4 text-center">Acciones</th>
        </tr>
      </thead>

     <tbody>
  {empleados.map((emp) => {
    const docs = docsPorEmpleado[emp.id] || [];

    const tieneDocumento = (nombre: string) => {
      return docs.some((d: Documento) => {
        const tipo = tipos.find(
          (t) => Number(t.id) === Number(d.tipo_documento_id)
        );

        return tipo?.nombre
          ?.toLowerCase()
          .includes(nombre.toLowerCase());
      });
    };

    const estado = calcularEstado(emp.id);

    return (
      <tr
        key={emp.id}
        className="border-b hover:bg-gray-50 transition-all"
      >
        {/* EMPLEADO */}
        <td className="p-4 font-semibold text-gray-800">
          {emp.nombres} {emp.apellidos}
        </td>

        {/* DPI */}
        <td className="p-4 text-gray-600">{emp.dpi}</td>

        {/* PENALES */}
        <td className="p-4 text-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              tieneDocumento("penal")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </td>

        {/* POLICIACOS */}
        <td className="p-4 text-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              tieneDocumento("policia")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </td>

        {/* CV */}
        <td className="p-4 text-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              tieneDocumento("cv")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </td>

        {/* TITULO */}
        <td className="p-4 text-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              tieneDocumento("titulo")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </td>

        {/* CONTRATO */}
        <td className="p-4 text-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              tieneDocumento("contrato")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </td>

        {/* ESTADO */}
        <td className="p-4 text-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              estado === "Completo"
                ? "bg-green-100 text-green-700"
                : estado === "En Proceso"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {estado}
          </span>
        </td>

        {/* ACCIONES */}
        <td className="p-4">
          <div className="flex justify-center gap-2">

            <button
              onClick={() => abrirModal(emp.id)}
              className="bg-[#a4ab9a] hover:bg-[#929a88] text-white px-3 py-1 rounded-lg text-sm"
            >
              Subir
            </button>

            <button
  onClick={() => {
    const docs = docsPorEmpleado[emp.id] || [];

    if (docs.length === 0) {
      alert("Este empleado no tiene documentos.");
      return;
    }

    const lista = docs
      .map((d: Documento) => {
        const tipo = tipos.find(
          (t) => Number(t.id) === Number(d.tipo_documento_id)
        );

        return `• ${tipo?.nombre || "Documento"}`;
      })
      .join("\n");

    alert(
      `DOCUMENTOS DE ${emp.nombres} ${emp.apellidos}\n\n${lista}`
    );
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
>
  Ver
</button>

            <button
  onClick={() => {
    const confirmar = confirm(
      `¿Deseas eliminar los documentos de ${emp.nombres}?`
    );

    if (!confirmar) return;

    alert(
      `Aquí conectarás el DELETE del backend para ${emp.nombres}`
    );
  }}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
>
  Eliminar
</button>

          </div>
        </td>
      </tr>
    );
  })}
</tbody>
    </table>
  </div>
</div>

      {/* 🔹 MODAL */}
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl border border-gray-100">
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
              className="bg-[#a4ab9a] hover:bg-[#8d9583] text-white w-full py-3 rounded-2xl transition-all font-semibold"
              >
                Subir
              </button>
            </form>

            <button
              onClick={() => setModal(false)}
              className="mt-4 w-full text-gray-500 hover:text-gray-700 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};