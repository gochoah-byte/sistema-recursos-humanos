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
 

    if (!empleadoId || !tipoSeleccionado || !archivo) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("empleado_id", empleadoId.toString());
      formData.append("tipo_documento_id", tipoSeleccionado.toString());
      formData.append("file", archivo);
     formData.append(
  "subido_por_usuario_id",
  empleadoId.toString()
);

      await subirDocumento(formData);

      setModal(false);
      setArchivo(null);
      setTipoSeleccionado("");

      await cargarDatos();

      alert("¡Documento subido correctamente!");
   } catch (error: any) {

  console.error(
    "ERROR COMPLETO:",
    error.response?.data || error
  );

  alert(
    error.response?.data?.message ||
    "Error al subir documento."
  );
}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expediente Digital</h2>

     

{/* RESUMEN EXPEDIENTES */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* COMPLETOS */}

  <div className="bg-[#eef2ea] rounded-2xl shadow-md p-6">

    <p className="text-sm text-gray-500 font-bold uppercase">
      Expedientes Completos
    </p>

    <h2 className="text-5xl font-bold text-[#8e9485] mt-2">

      {
        empleados.filter(
          (e) => calcularEstado(e.id) === 'Completo'
        ).length
      }

    </h2>

    <p className="text-gray-500 mt-2">
      Documentación completa
    </p>

  </div>


  {/* EN PROCESO */}

  <div className="bg-[#f6e7dd] rounded-2xl shadow-md p-6">

    <p className="text-sm text-gray-500 font-bold uppercase">
      En proceso
    </p>

    <h2 className="text-5xl font-bold text-[#c99b72] mt-2">

      {
        empleados.filter(
          (e) =>
            calcularEstado(e.id) === 'En Proceso'
        ).length
      }

    </h2>

    <p className="text-gray-500 mt-2">
      Documentos pendientes
    </p>

  </div>


  {/* INCOMPLETOS */}

  <div className="bg-[#f8e7e7] rounded-2xl shadow-md p-6">

    <p className="text-sm text-gray-500 font-bold uppercase">
      Incompletos
    </p>

    <h2 className="text-5xl font-bold text-[#d96b6b] mt-2">

      {
        empleados.filter(
          (e) =>
            calcularEstado(e.id) === 'Incompleto'
        ).length
      }

    </h2>

    <p className="text-gray-500 mt-2">
      Expedientes faltantes
    </p>

  </div>

</div>

     {/* TABLA EXPEDIENTES */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden">

  <div className="bg-[#a4ab9a] text-white px-6 py-4">

    <h3 className="text-2xl font-bold">
      Gestión de Expedientes
    </h3>

    <p className="text-sm opacity-80">
      Validación de documentos por empleado
    </p>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-gray-100">

      <tr className="text-gray-700">

  <th className="p-4 text-left">
    Empleado
  </th>

  <th className="p-4 text-left">
    DPI Persona
  </th>

  <th className="p-4 text-center">
    DPI
  </th>

  <th className="p-4 text-center">
    Penales
  </th>

  <th className="p-4 text-center">
    Policíacos
  </th>

  <th className="p-4 text-center">
    CV
  </th>

  <th className="p-4 text-center">
    Título
  </th>

  <th className="p-4 text-center">
    Contrato
  </th>

  <th className="p-4 text-center">
    Estado
  </th>

  <th className="p-4 text-center">
    Acciones
  </th>

</tr>

      </thead>

      <tbody>

        {empleados.map((emp) => {

          const docs =
            docsPorEmpleado[emp.id] || [];

          const tieneDoc = (
  nombre: string
) => {

  return docs.some((d: any) => {

    return (
      d.tipos_documento?.nombre
        ?.toLowerCase()
        .trim() ===
      nombre.toLowerCase().trim()
    );

  });

};
           
const obligatorios = [
  'DPI',
  'Penales',
  'Policíacos',
  'CV',
  'Título',
  'Contrato'
];

const totalSubidos =
  obligatorios.filter((tipo) =>
    tieneDoc(tipo)
  ).length;

let estado = 'Incompleto';

if (totalSubidos === obligatorios.length) {

  estado = 'Completo';

} else if (totalSubidos > 0) {

  estado = 'En Proceso';

}

          return (

            <tr
              key={emp.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4 font-medium">

                {emp.nombres} {emp.apellidos}

              </td>

              <td className="p-4 text-gray-600">

                {emp.dpi}

              </td>

              {/* DPI */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('DPI')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* PENALES */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('Penales')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* POLICIACOS */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('Policíacos')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* CV */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('CV')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* TITULO */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('Título')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* CONTRATO */}
              <td className="p-4 text-center">

                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    tieneDoc('Contrato')
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </td>

              {/* ESTADO */}
              <td className="p-4 text-center">

                {estado === 'Completo' ? (

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Completo
                  </span>

                ) : estado === 'En Proceso' ? (

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                    En proceso
                  </span>

                ) : (

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    Incompleto
                  </span>

                )}

              </td>

             {/* ACCIONES */}

<td className="p-4 text-center space-x-3">

  <button
    onClick={() => abrirModal(emp.id)}
    className="text-[#8e9485] hover:scale-125 transition text-xl"
  >
    ⬆️
  </button>

  <button
    className="text-blue-500 hover:scale-125 transition text-xl"
  >
    📝
  </button>

  <button
    className="text-red-500 hover:scale-125 transition text-xl"
  >
    🗑️
  </button>

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
                <option value="">
  Seleccione
</option>

{tipos.map((t) => (

  <option
    key={t.id}
    value={t.id}
  >
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