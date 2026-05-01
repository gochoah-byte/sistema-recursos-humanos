import React, { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';
import { EmpleadosService } from '../../service/empleados.service';

export const EmpleadosList: React.FC = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO' | 'LICENCIA'>('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await EmpleadosService.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos para los números de las carpetas
  const conteos = {
    total: empleados.length,
    activos: empleados.filter(e => e.estado === 'ACTIVO').length,
    inactivos: empleados.filter(e => e.estado === 'INACTIVO').length,
    licencia: empleados.filter(e => e.estado === 'LICENCIA').length,
  };

  // Filtrar la tabla según la carpeta seleccionada
  const empleadosFiltrados = filtro === 'TODOS' 
    ? empleados 
    : empleados.filter(e => e.estado === filtro);

  if (loading) return <div className="p-10 text-[#a4ab9a]">Cargando directorio de empleados...</div>;

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
        {/* Carpeta: TODOS */}
        <div 
          onClick={() => setFiltro('TODOS')}
          className="flex flex-col drop-shadow-xl transform transition hover:-translate-y-1 cursor-pointer"
        >
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'TODOS' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>TOTAL</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'TODOS' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.total}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Todos</span>
          </div>
        </div>

        {/* Carpeta: ACTIVOS */}
        <div 
          onClick={() => setFiltro('ACTIVO')}
          className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer"
        >
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'ACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'ACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.activos}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Activos</span>
          </div>
        </div>

        {/* Carpeta: INACTIVOS */}
        <div 
          onClick={() => setFiltro('INACTIVO')}
          className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer"
        >
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'INACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'INACTIVO' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.inactivos}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">Inactivos</span>
          </div>
        </div>

        {/* Carpeta: LICENCIA */}
        <div 
          onClick={() => setFiltro('LICENCIA')}
          className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1 cursor-pointer"
        >
          <div className={`w-[45%] h-8 rounded-t-xl flex items-center justify-center text-[10px] font-bold ${filtro === 'LICENCIA' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>ESTADO</div>
          <div className={`w-full h-32 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4 transition-colors ${filtro === 'LICENCIA' ? 'bg-[#a4ab9a] text-white' : 'bg-[#fbeae0] text-[#a4ab9a]'}`}>
            <span className="text-5xl font-bold">{conteos.licencia}</span>
            <span className="text-xs mt-2 font-medium uppercase text-center">En Licencia</span>
          </div>
        </div>
      </div>

      {/* Tabla Central */}
      <div>
        <h3 className="text-2xl font-medium text-gray-800 mb-6">
          Mostrando: <span className="text-[#a4ab9a]">{filtro === 'TODOS' ? 'Todos los empleados' : `Estado ${filtro}`}</span>
        </h3>
        
        <div className="w-full bg-white rounded-lg">
          {/* Encabezados de Tabla */}
          <div className="grid grid-cols-6 px-6 pb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">DPI</div>
            <div className="col-span-2">Nombre Completo</div>
            <div className="col-span-1">Puesto / Dept.</div>
            <div className="col-span-1 text-right">Salario Base</div>
            <div className="col-span-1 text-center">Acciones</div>
          </div>

          {/* Filas de la Tabla */}
          <div className="border-t-[3px] border-gray-800">
            {empleadosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay empleados en este estado.</div>
            ) : (
              empleadosFiltrados.map((emp: any, index) => (
                <div 
                  key={emp.id} 
                  className={`grid grid-cols-6 px-6 py-4 border-b-2 border-gray-800 transition-colors items-center
                    ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#fbeae0]/50`}
                >
                  <div className="col-span-1 font-medium text-gray-600">{emp.dpi}</div>
                  
                  <div className="col-span-2 flex items-center">
                    {/* Puntito de estado visual */}
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      emp.estado === 'ACTIVO' ? 'bg-[#94a187]' : 
                      emp.estado === 'LICENCIA' ? 'bg-[#eec8a3]' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-bold text-gray-700">{emp.nombres} {emp.apellidos}</span>
                  </div>
                  
                  <div className="col-span-1 flex flex-col">
                    <span className="text-gray-700 font-medium">{emp.puesto || 'N/A'}</span>
                    <span className="text-xs text-gray-500">{emp.departamento || 'Sin Depto.'}</span>
                  </div>
                  
                  <div className="col-span-1 text-right font-bold text-[#a4ab9a]">
                    Q{Number(emp.salario_base).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                  
                  {/* Íconos de Acción */}
                  <div className="col-span-1 flex justify-center gap-4 text-xl">
                    <button title="Ver Detalle" className="text-gray-400 hover:text-[#a4ab9a] transition">👁️</button>
                    <button title="Editar" className="text-gray-400 hover:text-[#d7bda8] transition">✏️</button>
                    <button title="Gestionar Documentos" className="text-gray-400 hover:text-[#a4ab9a] transition">📄</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};