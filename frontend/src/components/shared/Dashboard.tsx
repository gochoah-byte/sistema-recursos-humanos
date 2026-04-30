import React, { useEffect, useState } from 'react';
import { EmpleadosService } from '../../service/empleados.service';
import { NominaService } from '../../service/nomina.service';
import { UsuariosService } from '../../service/usuarios.service';
import { AuditoriaService } from '../../service/auditoria.service';

export const Dashboard: React.FC = () => {
  // Estados para almacenar los datos reales
  const [metrics, setMetrics] = useState({
    total: 0,
    incompletos: 0,
    nominas: 0,
    usuarios: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamadas paralelas a los endpoints definidos en la documentación
        const [emp, inc, nom, usu, aud] = await Promise.all([
          EmpleadosService.getAll(),
          EmpleadosService.getIncompletos(),
          NominaService.getPeriodos(),
          UsuariosService.getAll(),
          AuditoriaService.getAll()
        ]);

        setMetrics({
          total: emp.length,
          incompletos: inc.length,
          nominas: nom.filter((p: any) => p.estado === 'ABIERTO').length,
          usuarios: usu.length
        });

        // Tomamos los últimos 6 eventos de la bitácora de auditoría
        setLogs(aud.slice(0, 6));
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-[#a4ab9a]">Cargando datos del sistema...</div>;

  return (
    <div className="max-w-5xl">
      <h1 className="text-5xl font-bold text-[#a4ab9a] mb-2 tracking-wide">Resumen</h1>
      <h2 className="text-3xl font-medium text-gray-800 mb-8">Panel de Control</h2>

      {/* Carpetas con Datos Reales */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {/* Carpeta: Total Empleados */}
        <div className="flex flex-col drop-shadow-xl transform transition hover:-translate-y-1">
          <div className="w-[45%] h-8 bg-[#a4ab9a] rounded-t-xl flex items-center justify-center text-[10px] text-white font-bold">TOTAL</div>
          <div className="w-full h-36 bg-[#a4ab9a] rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4">
            <span className="text-white text-5xl font-bold">{metrics.total}</span>
            <span className="text-white text-xs mt-2 font-medium uppercase text-center">Empleados Registrados</span>
          </div>
        </div>

        {/* Carpeta: Expedientes Incompletos */}
        <div className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1">
          <div className="w-[45%] h-8 bg-[#fbeae0] rounded-t-xl flex items-center justify-center text-[10px] text-[#a4ab9a] font-bold">ALERTA</div>
          <div className="w-full h-36 bg-[#fbeae0] rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4">
            <span className="text-[#a4ab9a] text-5xl font-bold">{metrics.incompletos}</span>
            <span className="text-[#a4ab9a] text-xs mt-2 font-medium uppercase text-center">Docs. Faltantes</span>
          </div>
        </div>

        {/* Carpeta: Nóminas Abiertas */}
        <div className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1">
          <div className="w-[45%] h-8 bg-[#fbeae0] rounded-t-xl flex items-center justify-center text-[10px] text-[#a4ab9a] font-bold">NÓMINA</div>
          <div className="w-full h-36 bg-[#fbeae0] rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4">
            <span className="text-[#a4ab9a] text-5xl font-bold">{metrics.nominas}</span>
            <span className="text-[#a4ab9a] text-xs mt-2 font-medium uppercase text-center">Períodos Abiertos</span>
          </div>
        </div>

        {/* Carpeta: Usuarios del Sistema */}
        <div className="flex flex-col drop-shadow-lg transform transition hover:-translate-y-1">
          <div className="w-[45%] h-8 bg-[#fbeae0] rounded-t-xl flex items-center justify-center text-[10px] text-[#a4ab9a] font-bold">ACCESO</div>
          <div className="w-full h-36 bg-[#fbeae0] rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center p-4">
            <span className="text-[#a4ab9a] text-5xl font-bold">{metrics.usuarios}</span>
            <span className="text-[#a4ab9a] text-xs mt-2 font-medium uppercase text-center">Usuarios Activos</span>
          </div>
        </div>
      </div>

      {/* Lista de Auditoría */}
      <div>
        <h3 className="text-2xl font-medium text-gray-800 mb-6">Actividad Reciente</h3>
        
        <div className="w-full">
          <div className="grid grid-cols-4 px-6 pb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <div>Usuario</div>
            <div className="text-center">Acción</div>
            <div>Entidad</div>
            <div className="text-right">Fecha</div>
          </div>

          <div className="border-t-[3px] border-gray-800">
            {logs.map((log: any, index) => (
              <div 
                key={log.id} 
                className={`grid grid-cols-4 px-6 py-4 border-b-2 border-gray-800 transition-colors items-center
                  ${index === 4 ? 'bg-[#fbeae0]' : 'hover:bg-gray-50'}`}
              >
                <div className="font-medium text-gray-700 truncate">{log.usuario?.correo || 'Sistema'}</div>
                <div className="flex justify-center items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${log.accion === 'DELETE' ? 'bg-red-400' : 'bg-[#d7bda8]'}`}></div>
                  <span className="text-xs font-bold text-gray-600">{log.accion}</span>
                </div>
                <div className="font-medium text-gray-700 italic">{log.entidad}</div>
                <div className="text-right text-gray-500 text-sm">
                  {new Date(log.creado_en).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};