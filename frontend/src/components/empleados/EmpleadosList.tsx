import React, { useEffect, useState } from 'react';
import { EmpleadosService } from '../../service/empleados.service';
import { ModalEditarEmpleado } from './ModalEditarEmpleado';

export const EmpleadosList: React.FC = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'TODOS' | 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO'>('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any>(null);


  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setLoading(true); 
    setError(null);
    try {
      const data = await EmpleadosService.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      setError('No se pudo establecer conexión con el servidor.'); 
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmpleado = async (datosActualizados: any) => {
    try {
      const empleadoLimpio = {
        id: datosActualizados.id, 
        dpi: datosActualizados.dpi,
        nombres: datosActualizados.nombres,
        apellidos: datosActualizados.apellidos,
        fecha_nacimiento: datosActualizados.fecha_nacimiento,
        direccion: datosActualizados.direccion,
        telefono: datosActualizados.telefono,
        puesto: datosActualizados.puesto,
        departamento: datosActualizados.departamento,
        estado: datosActualizados.estado,
        salario_base: Number(datosActualizados.salario_base) 
      };

      await EmpleadosService.update(empleadoLimpio.id, empleadoLimpio);

      alert("¡Empleado actualizado correctamente!");
      setIsModalOpen(false);
      cargarEmpleados();
    } catch (err: any) {
      const mensaje = Array.isArray(err.response?.data?.message)
        ? err.response?.data?.message[0]
        : err.response?.data?.message;

      alert(mensaje || "Error al actualizar");
    }
  };

  const conteos = {
    total: empleados.length,
    activos: empleados.filter(e => e.estado === 'ACTIVO').length,
    suspendidos: empleados.filter(e => e.estado === 'SUSPENDIDO').length,
    retirados: empleados.filter(e => e.estado === 'RETIRADO').length,
  };

  const empleadosFiltrados = filtro === 'TODOS'
    ? empleados
    : empleados.filter(e => e.estado === filtro);


  return (
    <div className="max-w-5xl relative">

      {/* Títulos y Botón Nuevo */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-bold text-[#a4ab9a] mb-2 tracking-wide">Directorio</h1>
          <h2 className="text-3xl font-medium text-gray-800">Gestión de Empleados</h2>
        </div>
        <button className="bg-[#a4ab9a] hover:bg-[#8c967a] text-white px-6 py-3 rounded-full font-bold shadow-md transition-all">
          + Nuevo Empleado
        </button>
      </div>

      {/* Carpetas Superiores (Filtros Interactivos) */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div onClick={() => setFiltro('TODOS')} className="flex flex-col drop-shadow-xl transform transition hover:-translate-y-1 cursor-pointer">
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'TODOS' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>TOTAL</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'TODOS' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.total}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Todos</span>
          </div>
        </div>

        <div onClick={() => setFiltro('ACTIVO')} className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer">
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'ACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'ACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.activos}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Activos</span>
          </div>
        </div>

        <div onClick={() => setFiltro('SUSPENDIDO')} className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer">
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'SUSPENDIDO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'SUSPENDIDO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.suspendidos}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Suspendidos</span>
          </div>
        </div>

        <div onClick={() => setFiltro('RETIRADO')} className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer">
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'RETIRADO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'RETIRADO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.retirados}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Retirados</span>
          </div>
        </div>
      </div>

      {/* Contenido Dinámico (Cargando, Error o Tabla) */}
      <div>
        <h3 className="text-2xl font-medium text-gray-800 mb-6">
          Mostrando: <span className="text-[#a4ab9a]">{filtro === 'TODOS' ? 'Todos los empleados' : `Estado ${filtro}`}</span>
        </h3>

        {loading ? (
          /* ESTADO CARGANDO */
          <div className="w-full bg-white rounded-lg p-20 flex flex-col items-center justify-center border-2 border-dashed border-[#a4ab9a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a4ab9a] mb-4"></div>
            <p className="text-[#a4ab9a] font-medium animate-pulse">Cargando directorio de empleados...</p>
          </div>
        ) : error ? (
          /* ESTADO ERROR */
          <div className="w-full bg-red-50 rounded-lg p-10 flex flex-col items-center justify-center border-2 border-red-200">
            <span className="text-4xl mb-4">⚠️</span>
            <p className="text-red-600 font-bold">{error}</p>
            <button onClick={cargarEmpleados} className="mt-4 text-red-500 underline font-medium">Reintentar conexión</button>
          </div>
        ) : (
          /* TABLA CENTRAL */
          <div className="w-full bg-white rounded-lg">
            <div className="grid grid-cols-6 px-6 pb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">DPI</div>
              <div className="col-span-2">Nombre Completo</div>
              <div className="col-span-1">Puesto / Dept.</div>
              <div className="col-span-1 text-right">Salario Base</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>

            <div className="border-t-[3px] border-gray-800">
              {empleadosFiltrados.length === 0 ? (
                /* LISTA VACÍA DENTRO DE LA TABLA */
                <div className="p-16 text-center">
                  <div className="text-6xl mb-4 opacity-20">📂</div>
                  <p className="text-gray-500 text-xl font-medium">No se encontraron empleados en este estado.</p>
                </div>
              ) : (
                empleadosFiltrados.map((emp: any, index) => (
                  <div
                    key={emp.id}
                    className={`grid grid-cols-6 px-6 py-4 border-b-2 border-gray-800 transition-colors items-center
                      ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#fbeae0]/50`}
                  >
                    <div className="col-span-1 font-medium text-gray-600">{emp.dpi}</div>
                    <div className="col-span-2 flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                          emp.estado === 'ACTIVO' ? 'bg-[#22c55e] shadow-[#22c55e]/50' :
                          emp.estado === 'SUSPENDIDO' ? 'bg-[#eab308] shadow-[#eab308]/50' :
                          emp.estado === 'RETIRADO' ? 'bg-[#ef4444] shadow-[#ef4444]/50' : 'bg-gray-400'
                      }`}
                      ></div>
                      <span className="font-bold text-gray-700">{emp.nombres} {emp.apellidos}</span>
                    </div>
                    <div className="col-span-1 flex flex-col">
                      <span className="text-gray-700 font-medium">{emp.puesto || 'N/A'}</span>
                      <span className="text-xs text-gray-500">{emp.departamento || 'Sin Depto.'}</span>
                    </div>
                    <div className="col-span-1 text-right font-bold text-[#a4ab9a]">
                      Q{Number(emp.salario_base).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="col-span-1 flex justify-center gap-4 text-xl">
                      <button title="Ver Detalle" className="text-gray-400 hover:text-[#a4ab9a] transition">👁️</button>
                      <button title="Editar" onClick={() => { setEmpleadoSeleccionado(emp); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#d7bda8] transition"> ✏️</button>
                      <button title="Gestionar Documentos" className="text-gray-400 hover:text-[#a4ab9a] transition">📄</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <ModalEditarEmpleado
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        empleado={empleadoSeleccionado}
        onSave={handleSaveEmpleado}
      />
    </div>
  );
};