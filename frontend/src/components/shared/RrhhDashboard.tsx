import React, { useEffect, useState } from 'react';
import { EmpleadosService } from '../../service/empleados.service';
import { DocumentosService } from '../../service/documentos.service';
import { jsPDF } from "jspdf";

// IMPORTAMOS EL COMPONENTE DE EMPLEADOS QUE YA FUNCIONA
import { EmpleadosList } from '../empleados/EmpleadosList';
import { DepartamentosList } from '../departamento/DepartamentoList';
import { PuestosList } from '../puesto/PuestoList';
import { NominaService } from '../../service/nomina.service';

export const RrhhDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('DASHBOARD');
  
  const [metrics, setMetrics] = useState({ activos: 0, documentos: 0 });
  const [loading, setLoading] = useState(true);
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<any[]>([]);

  useEffect(() => {

    const fetchRrhhData = async () => {

      try {

       const emp = await EmpleadosService.getAll();

const periodosData =
  await NominaService.getPeriodos();
         console.log("PERIODOS:", periodosData);

        setMetrics({
          activos: emp.filter(
            (e: any) => e.estado === 'ACTIVO'
          ).length,

         documentos: 0
        });
        setPeriodos(periodosData);

        console.log(periodosData);

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

        {/* VISTA 5: NÓMINA (Sueldos, Bonos, Descuentos) */}
        {activeMenu === 'NOMINA' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Configuración de Nómina</h2>
            <p className="text-gray-500">En este módulo registrarás bonificaciones, incentivos y aplicarás descuentos antes de generar la planilla final.</p>
          </div>
        )}

        {/* VISTA 6: PLANILLA Y BOLETAS */}
{activeMenu === 'PLANILLA' && (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

    <h2 className="text-2xl font-bold mb-6">
      Historial de Planillas
    </h2>

    <p className="mb-4">
  Total períodos: {periodos.length}
</p>

    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th>ID</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {periodos.map((p: any) => (
          <tr key={p.id} className="border-b">

            <td>{p.id}</td>

            <td>
              {new Date(p.fecha_inicio).toLocaleDateString()}
            </td>

            <td>
              {new Date(p.fecha_fin).toLocaleDateString()}
            </td>

            <td>
              {p.estado}
            </td>

            
  <td>
  <button
    className="text-blue-600 font-bold hover:underline"
    onClick={async () => {

      const detalles =
        await NominaService.getDetalles();

      const filtrados =
        detalles.filter(
          (d: any) =>
            d.periodo_nomina_id === p.id
        );

      setDetalleSeleccionado(
        filtrados
      );

    }}
  >
    Ver Detalles
  </button>

  <button
    className="text-green-600 font-bold hover:underline ml-3"
    onClick={async () => {

  const detalles =
    await NominaService.getDetalles();

  const filtrados =
    detalles.filter(
      (d: any) =>
        d.periodo_nomina_id === p.id
    );

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(
    "REPORTE GENERAL DE PLANILLA",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Planilla #${p.id}`,
    20,
    35
  );

  doc.text(
    `Estado: ${p.estado}`,
    20,
    45
  );

  let y = 65;

  doc.text(
    "Empleado",
    20,
    y
  );

  doc.text(
    "Salario Neto",
    140,
    y
  );

  y += 10;

  filtrados.forEach((d: any) => {

    doc.text(
      `${d.empleados?.nombres} ${d.empleados?.apellidos}`,
      20,
      y
    );

    doc.text(
      `Q${d.salario_neto}`,
      140,
      y
    );

    y += 10;

  });

  y += 10;

  doc.text(
    `Total Empleados: ${filtrados.length}`,
    20,
    y
  );

  y += 10;

  const totalNomina =
    filtrados.reduce(
      (sum: number, d: any) =>
        sum + Number(d.salario_neto),
      0
    );

  doc.text(
    `Total Nomina: Q${totalNomina.toFixed(2)}`,
    20,
    y
  );

  doc.save(
    `reporte-planilla-${p.id}.pdf`
  );

}}
  >
    Reporte
  </button>



</td>


          </tr>
        ))}
      </tbody>
    </table>

    {detalleSeleccionado.length > 0 && (
  <div className="mt-6 border-t pt-4">

    <h3 className="text-xl font-bold mb-4">
      Detalles de la Planilla
    </h3>

    <div className="max-h-96 overflow-y-auto">

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th>Empleado</th>
            <th>Salario Base</th>
            <th>Deducciones</th>
            <th>Salario Neto</th>
            <th>Voucher PDF</th>
          </tr>
        </thead>

        <tbody>
          {detalleSeleccionado.map((d: any) => (
            <tr key={d.id} className="border-b">

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

              <td>
  <button
    className="text-red-600 font-bold hover:underline"
    onClick={() => {

     const doc = new jsPDF();

doc.setFontSize(18);
doc.text("SISTEMA DE RECURSOS HUMANOS", 20, 20);

doc.setFontSize(16);
doc.text("VOUCHER DE PAGO", 20, 35);

doc.line(20, 40, 190, 40);

doc.setFontSize(12);

doc.text(
  `Empleado: ${d.empleados?.nombres} ${d.empleados?.apellidos}`,
  20,
  55
);

doc.text(
  `Puesto: ${d.empleados?.puesto}`,
  20,
  65
);

doc.text(
  `Departamento: ${d.empleados?.departamento}`,
  20,
  75
);

doc.line(20, 85, 190, 85);

doc.text("INGRESOS", 20, 100);

doc.text(
  `Salario Base: Q${d.salario_base_snapshot}`,
  30,
  110
);

doc.line(20, 120, 190, 120);

doc.text("DEDUCCIONES", 20, 135);

doc.text(
  `IGSS: Q${d.deducciones_total}`,
  30,
  145
);

doc.line(20, 155, 190, 155);

doc.setFontSize(14);

doc.text(
  `SALARIO NETO: Q${d.salario_neto}`,
  20,
  170
);

doc.line(20, 210, 80, 210);
doc.text("Firma Empleado", 20, 220);

doc.line(120, 210, 180, 210);
doc.text("Recursos Humanos", 120, 220);

doc.save(
  `voucher-${d.empleados?.nombres}.pdf`
);

    }}
  >
    Voucher
  </button>
</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>

  </div>
)}


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