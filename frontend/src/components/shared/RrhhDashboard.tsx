import React, { useEffect, useState } from 'react';
import { EmpleadosService } from '../../service/empleados.service';
import { DocumentosService } from '../../service/documentos.service';

// IMPORTAMOS EL COMPONENTE DE EMPLEADOS QUE YA FUNCIONA
import { EmpleadosList } from '../empleados/EmpleadosList';
import { DepartamentosList } from '../departamento/DepartamentoList';
import { PuestosList } from '../puesto/PuestoList';


export const RrhhDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('DASHBOARD');
  
  const [metrics, setMetrics] = useState({ activos: 0, documentos: 0 });
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {

    const fetchRrhhData = async () => {

      try {

        const [emp, docs] = await Promise.all([
          EmpleadosService.getAll(),
          DocumentosService.getAll()
        ]);

        setMetrics({
          activos: emp.filter(
            (e: any) => e.estado === 'ACTIVO'
          ).length,

          documentos: docs.length || 0
        });

      } catch (error) {

        console.error(
          "Error cargando panel de RRHH:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchRrhhData();

  }, []);

  // Definición exacta del Menú que solicitaste
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
    { id: 'EMPLEADOS', label: 'Empleados', icon: '👥' },
    { id: 'DEPARTAMENTOS', label: 'Departamentos', icon: '🏢' },
    { id: 'PUESTOS', label: 'Puestos', icon: '💼' },
    { id: 'VACACIONES', label: 'Vacaciones', icon: '🌴' },
    { id: 'PERMISOS', label: 'Permisos', icon: '📝' },
    { id: 'NOMINA', label: 'Nómina', icon: '💰' },
    { id: 'PLANILLA', label: 'Planilla', icon: '📑' },
    { id: 'REPORTES', label: 'Reportes', icon: '📈' },
    { id: 'DOCUMENTOS', label: 'Documentos', icon: '🗂️' }
  ];

  if (loading) return <div className="p-10 text-[#a4ab9a] font-bold animate-pulse">Cargando gestión de personal...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in flex flex-col h-full">
      
      {/* ==========================================
          BARRA DE NAVEGACIÓN SUPERIOR (SUB-MENÚ RRHH)
      ================================================ */}
      {/* CORRECCIÓN: Agregamos shrink-0 para que la lista de componentes no aplaste el menú */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6 flex overflow-x-auto gap-2 scrollbar-hide shrink-0">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeMenu === item.id 
                ? 'bg-[#a4ab9a] text-white shadow-md' 
                : 'text-gray-500 hover:bg-[#fbeae0] hover:text-[#a4ab9a]'
            }`}
          >
            <span className="mr-2 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          ÁREA DE CONTENIDO DINÁMICO
      ================================================ */}
      <div className="flex-1">
        
        {/* VISTA 1: DASHBOARD PRINCIPAL */}
        {activeMenu === 'DASHBOARD' && (
          <div className="space-y-8">
            <div className="border-b-2 border-[#a4ab9a] pb-6">
              <h1 className="text-4xl font-bold text-[#a4ab9a] tracking-wide mb-2">Recursos Humanos</h1>
              <p className="text-gray-500 mb-6">Gestión integral de personal, asistencia y planillas.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div onClick={() => setActiveMenu('EMPLEADOS')} className="cursor-pointer bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-bold">Personal Activo</p>
                    <p className="text-3xl font-black text-green-500">{metrics.activos}</p>
                  </div>
                  <div className="text-4xl">👨‍💼</div>
                </div>
                <div onClick={() => setActiveMenu('DOCUMENTOS')} className="cursor-pointer bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#a4ab9a] flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-bold">Documentos Subidos</p>
                    <p className="text-3xl font-black text-[#a4ab9a]">{metrics.documentos}</p>
                  </div>
                  <div className="text-4xl">🗂️</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setActiveMenu('NOMINA')} className="bg-[#fbeae0] p-6 rounded-xl flex flex-col items-center justify-center hover:bg-[#f3dec9] transition shadow-sm border border-[#e8d5cb]">
                <span className="text-4xl mb-2">💰</span>
                <span className="font-bold text-gray-700">Gestionar Salarios y Bonos</span>
              </button>
              <button onClick={() => setActiveMenu('DEPARTAMENTOS')} className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center hover:bg-blue-100 transition shadow-sm border border-blue-200">
                <span className="text-4xl mb-2">🏢</span>
                <span className="font-bold text-blue-800">Gestionar Departamentos</span>
              </button>
              <button onClick={() => setActiveMenu('PLANILLA')} className="bg-gray-800 p-6 rounded-xl flex flex-col items-center justify-center hover:bg-gray-700 transition shadow-sm">
                <span className="text-4xl mb-2">📑</span>
                <span className="font-bold text-white">Generar Planilla Actual</span>
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: EMPLEADOS (CORREGIDA) */}
        {activeMenu === 'EMPLEADOS' && (

          <div className="w-full">

            <EmpleadosList
            />

          </div>

        )}

        {/* VISTA 3: DEPARTAMENTOS */}
        {activeMenu === 'DEPARTAMENTOS' && (
          <DepartamentosList />
        )}

        {activeMenu === 'PUESTOS' && (
          <PuestosList />
        )}


        {/* VISTA 4: VACACIONES Y PERMISOS */}
        {(activeMenu === 'VACACIONES' || activeMenu === 'PERMISOS') && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Gestión de Ausencias</h2>
            <p className="text-gray-500">Bandeja de entrada para aprobar o rechazar solicitudes de {activeMenu.toLowerCase()} enviadas por los empleados.</p>
          </div>
        )}

        {/* VISTA 5: NÓMINA (Sueldos, Bonos, Descuentos) */}
        {activeMenu === 'NOMINA' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Configuración de Nómina</h2>
            <p className="text-gray-500">En este módulo registrarás bonificaciones, incentivos y aplicarás descuentos antes de generar la planilla final.</p>
          </div>
        )}

        {/* VISTA 6: PLANILLA Y BOLETAS */}
        {activeMenu === 'PLANILLA' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generación de Planilla</h2>
            <p className="text-gray-500">Genera la planilla quincenal o mensual y emite automáticamente las boletas de pago (PDF) para cada empleado.</p>
          </div>
        )}

        {/* VISTA 7: DOCUMENTOS */}
        {activeMenu === 'DOCUMENTOS' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-[#a4ab9a] mb-4">Expedientes Digitales</h2>
            <p className="text-gray-500">Aquí subirás y gestionarás el DPI, contratos escaneados y antecedentes de todo el personal.</p>
          </div>
        )}

        {/* OTRAS VISTAS (Reportes, Contratos) */}
        {(activeMenu === 'REPORTES' || activeMenu === 'CONTRATOS') && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Módulo de {activeMenu}</h2>
            <p className="text-gray-500">Módulo en construcción para la gestión y exportación de datos.</p>
          </div>
        )}

      </div>
    </div>
  );
};