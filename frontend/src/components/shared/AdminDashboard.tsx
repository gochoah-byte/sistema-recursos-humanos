import React, { useState, useEffect } from 'react';

// IMPORTACIONES DE TUS COMPONENTES Y SERVICIOS
import { EmpleadosList } from '../empleados/EmpleadosList';
import { ModalPuesto} from '../puesto/ModalPuesto';
import { ModalDepartamento } from '../departamento/ModalDepartamento';
import { UsuariosModulo } from './UsuariosModulo';
import { Documentos } from '../documentos/Documentos';
import { NominaService } from '../../service/nomina.service';
import { AuditoriaService } from '../../service/auditoria.service';
import { PuestosService } from '../../service/puestos.service';
import { DepartamentosService } from '../../service/departamentos.service';


// ==========================================
// COMPONENTE INTERNO: Módulo de Nómina (Funcional)
// ==========================================
const ModuloNomina: React.FC = () => {
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<any[]>([]);

  

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const data = await NominaService.getPeriodos();
        setPeriodos(data);
      } catch (error) {
        console.error("Error cargando periodos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPeriodos();
  }, []);

  const handleVerDetalles = async (periodoId: number) => {
  try {

    const detalles =
  await NominaService.getDetalles();

console.log('TODOS LOS DETALLES:', detalles);

const filtrados =
  detalles.filter(
    (d: any) =>
      Number(d.periodo_nomina_id) === Number(periodoId)
  );

console.log('PERIODO SELECCIONADO:', periodoId);
console.log('FILTRADOS:', filtrados);

setDetalleSeleccionado(filtrados);
  } catch (error) {

    console.error(error);

    alert('Error cargando detalles');

  }
};

  const handleCrearPeriodo = async () => {
    const fechaInicio = prompt("Ingrese la fecha de inicio (YYYY-MM-DD):");
    const fechaFin = prompt("Ingrese la fecha de fin (YYYY-MM-DD):");
    if (fechaInicio && fechaFin) {
      try {
        await NominaService.createPeriodo({ fecha_inicio: fechaInicio, fecha_fin: fechaFin, estado: 'ABIERTO' });
        const data = await NominaService.getPeriodos(); // Recargar
        setPeriodos(data);
      } catch (error) {
        alert("Error al crear el período.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">Períodos de nómina y planillas.</p>
        <button onClick={handleCrearPeriodo} className="bg-[#fbeae0] text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-[#e8d5cb] font-bold">
          + Abrir Nuevo Período
        </button>
      </div>
      {loading ? <p>Cargando nóminas...</p> : (<>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3">ID</th>
              <th className="p-3">Fecha Inicio</th>
              <th className="p-3">Fecha Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold">{p.id}</td>
                <td className="p-3">{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                <td className="p-3">{new Date(p.fecha_fin).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.estado === 'ABIERTO' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                 
                  <button   onClick={() => handleVerDetalles(p.id)}   className="text-blue-500 hover:underline text-sm font-bold">Ver Detalles</button>
                  {p.estado === 'ABIERTO' && (
  <button
  onClick={async () => {

    const confirmar =
      window.confirm(
        '¿Está seguro de cerrar esta planilla?'
      );

    if (!confirmar) return;

    await NominaService.cerrarPeriodo(p.id);

    const data =
      await NominaService.getPeriodos();

    setPeriodos(data);

  }}
  className="text-orange-500 hover:underline text-sm font-bold"
>
  Cerrar Planilla
</button>
)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

{detalleSeleccionado.length > 0 && (
  <div className="mt-6 bg-white p-4 border rounded">

    <h2 className="text-xl font-bold mb-4">
  Detalles de la Planilla ({detalleSeleccionado.length} empleados)
</h2>
<button
  onClick={() => setDetalleSeleccionado([])}
  className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
>
  Ocultar Detalles
</button>
<div className="max-h-96 overflow-y-auto">


    <table className="w-full">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Salario Base</th>
          <th>Deducciones</th>
          <th>Salario Neto</th>
        </tr>
      </thead>

      <tbody>
        {detalleSeleccionado.map((d: any) => (
          <tr key={d.id}>
            <td>
              {d.empleados?.nombres} {d.empleados?.apellidos}
            </td>

            <td>
              Q{d.salario_base_snapshot}
            </td>

            <td>
              Q{d.deducciones_total}
            </td>

            <td>
              Q{d.salario_neto}
            </td>
          </tr>
        ))}
      </tbody>

    </table>
    <div className="mt-4 font-bold">
  Total Empleados: {detalleSeleccionado.length}
</div>

<div className="font-bold text-green-600">
  Total Nómina: Q{
    detalleSeleccionado.reduce(
      (sum: number, d: any) =>
        sum + Number(d.salario_neto),
      0
    ).toFixed(2)
  }
</div>
</div>
  </div>
)}

        </>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE INTERNO: Módulo de Reportes/Auditoría (Funcional)
// ==========================================
const ModuloAuditoria: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await AuditoriaService.getAll();
        setLogs(data.slice(0, 5)); // Mostrar solo los últimos 5 eventos para no saturar
      } catch (error) {
        console.error("Error cargando auditoría:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="w-full">
      <h3 className="font-bold text-gray-700 mb-4">Últimas Acciones en el Sistema</h3>
      {loading ? <p>Cargando bitácora...</p> : (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="p-4 border-b hover:bg-gray-50 grid grid-cols-4 items-center">
              <div className="font-bold text-gray-700 text-sm">
                 <span className={`w-2 h-2 inline-block rounded-full mr-2 ${log.accion === 'DELETE' ? 'bg-red-500' : log.accion === 'INSERT' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                 {log.accion}
              </div>
              <div className="text-sm text-gray-600 font-mono">Tabla: {log.entidad} (ID: {log.entidad_id})</div>
              <div className="text-sm text-gray-500 col-span-2 truncate">{log.descripcion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL DEL DASHBOARD
// ==========================================
export const AdminDashboard: React.FC = () => {
  // Estado para los departamentos (Extraído de los empleados reales)
  const [puestos, setPuestos] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const [showPuestoModal, setShowPuestoModal] = useState(false);

 
  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const puestosDB =
          await PuestosService.getAll();

        const departamentosDB =
          await DepartamentosService.getAll();

        setPuestos(puestosDB);

        setDepartamentos(departamentosDB);

      } catch (error) {

        console.error(error);

      }
    };

    cargarDatos();

  }, []);

  const handleGuardarPuesto = async (nombre: string) => {

    try {

      // CREAR
      await PuestosService.create({
        nombre
      });

      // RECARGAR DESDE BD
      const puestosDB =
        await PuestosService.getAll();

      setPuestos(puestosDB);

    } catch (error) {

      console.error(error);

      alert('Error al guardar puesto');

    }
  };

  const handleGuardarDepartamento = async (nombre: string) => {

    try {

      await DepartamentosService.create({
        nombre
      });

      const departamentosDB =
        await DepartamentosService.getAll();

      setDepartamentos(departamentosDB);

    } catch (error) {

      console.error(error);

      alert('Error al guardar departamento');

    }
  };
  
  console.log('ADMIN PUESTOS:', puestos);
  console.log('ADMIN DEPARTAMENTOS:', departamentos);

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-12 animate-fade-in">
      
      {/* ENCABEZADO */}
      <div className="border-b-2 border-[#a4ab9a] pb-4">
        <h1 className="text-4xl font-bold text-[#a4ab9a] tracking-wide">Panel de Administración</h1>
        <p className="text-gray-500 mt-2">Todas las funciones operativas centralizadas en una sola pantalla.</p>
      </div>

      {/* 1. GESTIONAR USUARIOS */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🔐</span>
            <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
          </div>
          <span className="text-xs bg-gray-600 px-3 py-1 rounded-full">Ver todos los Usuarios</span>
        </div>
        <div className="p-6 bg-white">
          <UsuariosModulo />
        </div>
      </section>

      {/* 2. GESTIONAR EMPLEADOS */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#a4ab9a] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👥</span>
            <h2 className="text-xl font-bold">Gestión de Empleados</h2>
          </div>
          <span className="text-xs bg-[#8e9485] px-3 py-1 rounded-full">Ver todos los Empleados</span>
        </div>
        <div className="p-6">
          <EmpleadosList
          />
        </div>
      </section>

      {/* GESTIÓN DE DOCUMENTOS */}

<section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

  <div className="bg-[#a4ab9a] text-white px-6 py-4 flex items-center justify-between">

    <div className="flex items-center">

      <span className="text-2xl mr-3">
        📁
      </span>

      <h2 className="text-xl font-bold">
        Gestión de Documentos
      </h2>

    </div>

    <span className="text-xs bg-[#8e9485] px-3 py-1 rounded-full">
      Expedientes Digitales
    </span>

  </div>

  <div className="p-6 bg-white">

    <Documentos />

  </div>

</section>

      {/* 3. DEPARTAMENTOS Y PUESTOS (Funcional extraído de la BD) */}
      <div className="grid grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="bg-blue-500 text-white px-6 py-4 flex items-center">
            <span className="text-2xl mr-3">🏢</span>

            <h2 className="text-xl font-bold">
              Departamentos Activos
            </h2>
          </div>

          {/* TEXTO + BOTÓN */}
          <div className="px-6 pt-4 flex items-center justify-between">

            <p className="text-gray-500 text-sm">
              Departamentos activos registrados en el sistema.
            </p>

            <button
              onClick={() => setShowDepartamentoModal(true)}
              className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition font-medium"
            >
              + Nuevo Departamento
            </button>

          </div>

          {/* LISTA */}
          <div className="p-6 bg-white max-h-48 overflow-y-auto">

            <ul className="divide-y">

              {departamentos.map((d: any) => (
                <li key={d.id}>
                  {d.nombre}
                </li>
              ))}

              {departamentos.length === 0 && (
                <p className="text-gray-400 text-sm">
                  No hay departamentos asignados.
                </p>
              )}

            </ul>

          </div>

          {/* MODAL */}
          {showDepartamentoModal && (
            <ModalDepartamento
              onClose={() => setShowDepartamentoModal(false)}
              onSave={handleGuardarDepartamento}
            />
          )}

        </section>

        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="bg-indigo-500 text-white px-6 py-4 flex items-center">
            <span className="text-2xl mr-3">💼</span>

            <h2 className="text-xl font-bold">
              Puestos Registrados
            </h2>
          </div>

          {/* TEXTO + BOTÓN */}
          <div className="px-6 pt-4 flex items-center justify-between">

            <p className="text-gray-500 text-sm">
              Puestos laborales registrados en el sistema.
            </p>

            <button
              onClick={() => setShowPuestoModal(true)}
              className="text-xs bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-full transition font-medium"
            >
              + Nuevo Puesto
            </button>

          </div>

          {/* LISTA */}
          <div className="p-6 bg-white max-h-48 overflow-y-auto">

            <ul className="divide-y text-sm">

              {puestos.map((p: any) => (
                <li
                  key={p.id}
                  className="py-2 text-gray-700 font-medium"
                >
                  {p.nombre}
                </li>
              ))}

              {puestos.length === 0 && (
                <p className="text-gray-400">
                  No hay puestos asignados.
                </p>
              )}

            </ul>

          </div>

          {/* MODAL */}
          {showPuestoModal && (
            <ModalPuesto
              onClose={() => setShowPuestoModal(false)}
              onSave={handleGuardarPuesto}
            />
          )}

        </section>
      </div>

      {/* 4. GESTIONAR NÓMINA (Funcional) */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#fbeae0] text-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💰</span>
            <h2 className="text-xl font-bold">Gestión de Nómina</h2>
          </div>
          <span className="text-xs bg-[#e8d5cb] px-3 py-1 rounded-full">Descuentos, Bonos, Planillas</span>
        </div>
        <div className="p-6 bg-white">
          <ModuloNomina />
        </div>
      </section>

      {/* 5. REPORTES Y ESTADÍSTICAS (Auditoría Funcional) */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-orange-400 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📊</span>
            <h2 className="text-xl font-bold">Auditoría del Sistema</h2>
          </div>
          <span className="text-xs bg-orange-500 px-3 py-1 rounded-full">Logs y Movimientos</span>
        </div>
        <div className="p-6 bg-gray-50">
           <ModuloAuditoria />
        </div>
      </section>

      {/* 6. CONFIGURACIÓN DEL SISTEMA */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-300 text-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚙️</span>
            <h2 className="text-xl font-bold">Configuración Global</h2>
          </div>
        </div>
        <div className="p-6 bg-white flex justify-around">
          <button className="bg-gray-100 border p-4 rounded-lg hover:bg-gray-200 w-1/3 mr-2 font-bold text-gray-700">Respaldar Base de Datos</button>
          <button className="bg-gray-100 border p-4 rounded-lg hover:bg-gray-200 w-1/3 ml-2 font-bold text-gray-700">Políticas de Contraseña</button>
        </div>
      </section>

    </div>
  );
};