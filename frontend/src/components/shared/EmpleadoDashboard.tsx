import React, { useEffect, useState } from 'react';
import { EmpleadosService } from '../../service/empleados.service';
import { NominaService } from '../../service/nomina.service';

export const EmpleadoDashboard: React.FC = () => {
  const [perfil, setPerfil] = useState<any>(null);
  const [historialNominas, setHistorialNominas] = useState<any[]>([]);
  const [ultimaNomina, setUltimaNomina] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ telefono: '', direccion: '' });
  
  const [isPermisoModalOpen, setIsPermisoModalOpen] = useState(false);
  const [permisoForm, setPermisoForm] = useState({ tipo: 'VACACIONES', fecha_inicio: '', fecha_fin: '', motivo: '' });

  const empleadoId = localStorage.getItem('empleadoId'); 

  const fetchEmpleadoData = async () => {
    // SI NO HAY ID, DETENEMOS LA CARGA Y AVISAMOS
    if (!empleadoId || empleadoId === 'null') {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Obtener Perfil
      const empleadoData = await EmpleadosService.getById(empleadoId);
      setPerfil(empleadoData);
      setEditFormData({ telefono: empleadoData.telefono || '', direccion: empleadoData.direccion || '' });

      // 2. Obtener TODAS las nóminas (Historial de Pagos y Boletas)
      const nominas = await NominaService.getDetallesByEmpleado(empleadoId);
      setHistorialNominas(nominas);
      if (nominas.length > 0) {
        setUltimaNomina(nominas[0]);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleadoData();
  }, [empleadoId]);

  // Funciones de Acción
  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!empleadoId) {
        alert("Error: No se encontró tu ID de empleado.");
        return;
      }

      // 1. Limpiamos las fechas y los datos para que Prisma no se queje
      const fechaFormat = perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).toISOString().split('T')[0] : null;

      // 2. Creamos un objeto EXCLUSIVO con los campos de la tabla empleados
      const empleadoLimpio = {
        dpi: perfil.dpi,
        nombres: perfil.nombres,
        apellidos: perfil.apellidos,
        fecha_nacimiento: fechaFormat,
        direccion: editFormData.direccion, // Aquí inyectamos la nueva dirección
        telefono: editFormData.telefono,   // Aquí inyectamos el nuevo teléfono
        puesto: perfil.puesto,
        departamento: perfil.departamento,
        estado: perfil.estado,
        salario_base: Number(perfil.salario_base)
      };

      // 3. Enviamos el objeto limpio al backend
      await EmpleadosService.update(Number(empleadoId), empleadoLimpio);
      
      alert("¡Información actualizada correctamente!");
      setIsEditModalOpen(false);
      fetchEmpleadoData(); // Recargar datos para que se vean en pantalla
      
    } catch (error: any) {
      // Si falla, ahora nos dirá EXACTAMENTE por qué falló
      console.error("Error completo:", error);
      const mensaje = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || "Error al conectar con el servidor";
        
      alert("No se pudo actualizar: " + mensaje);
    }
  };

  const handleSolicitarPermiso = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría el POST a PermisosService cuando crees la tabla en la BD
    console.log("Enviando solicitud:", permisoForm);
    alert(`Tu solicitud de ${permisoForm.tipo} ha sido enviada a RRHH para su aprobación.`);
    setIsPermisoModalOpen(false);
    setPermisoForm({ tipo: 'VACACIONES', fecha_inicio: '', fecha_fin: '', motivo: '' });
  };

  if (loading) return <div className="p-10 text-[#a4ab9a] font-bold">Cargando tu portal...</div>;
  
  // NUEVO MENSAJE DE ERROR SI NO HAY ID DE EMPLEADO
  if (!empleadoId || empleadoId === 'null') return (
    <div className="p-10 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-red-600">Error de Vinculación</h2>
      <p className="text-gray-600 mt-2">Tu usuario no tiene un empleado asociado en la base de datos.</p>
      <p className="text-gray-500 mt-1">Pídele al administrador que asigne tu usuario a tu expediente desde Gestión de Usuarios.</p>
    </div>
  );

  if (!perfil) return <div className="p-10 text-red-500">No se encontró tu perfil de empleado.</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-12 animate-fade-in relative">
      
      {/* ENCABEZADO Y RESUMEN RÁPIDO */}
      <div className="border-b-2 border-[#a4ab9a] pb-6">
        <h1 className="text-4xl font-bold text-[#a4ab9a] tracking-wide mb-2">Mi Portal de Empleado</h1>
        <p className="text-gray-500 mb-6">Bienvenido de nuevo, <span className="font-bold">{perfil.nombres} {perfil.apellidos}</span></p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#a4ab9a] flex items-center">
            <div className="text-4xl mr-4">💼</div>
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">Puesto Actual</p>
              <p className="text-xl font-bold text-gray-800">{perfil.puesto}</p>
              <p className="text-sm text-gray-500">{perfil.departamento}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
            <div className="flex items-center">
               <div className="text-4xl mr-4">💵</div>
               <div>
                 <p className="text-sm text-gray-500 uppercase font-bold">Último Pago Neto</p>
                 <p className="text-2xl font-black text-green-600">
                   {ultimaNomina ? `Q ${Number(ultimaNomina.salario_neto).toFixed(2)}` : 'Pendiente'}
                 </p>
               </div>
            </div>
            {ultimaNomina && (
              <button onClick={() => alert("Función para descargar PDF de boleta en construcción.")} className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition font-bold">
                Descargar Boleta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. MI PERFIL E HISTORIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👤</span>
              <h2 className="text-xl font-bold">Mi Perfil</h2>
            </div>
            {/* BOTÓN PARA EDITAR PERFIL */}
            <button onClick={() => setIsEditModalOpen(true)} className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full transition font-bold">
              Editar Info Básica
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div><p className="text-gray-500 text-sm">DPI</p><p className="font-bold text-gray-800">{perfil.dpi}</p></div>
            <div><p className="text-gray-500 text-sm">Salario Base</p><p className="font-bold text-gray-800">Q {Number(perfil.salario_base).toFixed(2)}</p></div>
            <div><p className="text-gray-500 text-sm">Teléfono</p><p className="font-bold text-gray-800">{perfil.telefono || 'No registrado'}</p></div>
            <div><p className="text-gray-500 text-sm">Dirección</p><p className="font-bold text-gray-800">{perfil.direccion || 'No registrada'}</p></div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-indigo-500 text-white px-6 py-4 flex items-center">
            <span className="text-2xl mr-3">📜</span>
            <h2 className="text-xl font-bold">Historial Laboral</h2>
          </div>
          <div className="p-6 bg-gray-50 h-full">
            <p className="text-sm font-bold text-gray-700">Contratado el:</p>
            <p className="text-gray-500 mb-4">{new Date(perfil.creado_en).toLocaleDateString()}</p>
            <p className="text-sm font-bold text-gray-700">Estado Actual:</p>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{perfil.estado}</span>
          </div>
        </section>
      </div>

      {/* 2. CONTROL DE TIEMPO */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#a4ab9a] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏰</span>
            <h2 className="text-xl font-bold">Tiempo y Asistencia</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          

          <div className="p-6 bg-gray-50 hover:bg-white transition text-center flex flex-col items-center justify-center h-48 relative">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="font-bold text-gray-700">Permisos</h3>
            <p className="text-xs text-gray-500 mt-2">Ausencias por salud o personales</p>
            <button onClick={() => { setPermisoForm({...permisoForm, tipo: 'PERMISO'}); setIsPermisoModalOpen(true); }} className="mt-4 text-xs border-2 border-[#a4ab9a] text-[#a4ab9a] px-4 py-2 rounded-lg hover:bg-gray-100 font-bold">Solicitar</button>
          </div>

        </div>
      </section>

      {/* 3. MIS PAGOS Y BOLETAS (FUNCIONAL) */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#fbeae0] text-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🧾</span>
            <h2 className="text-xl font-bold">Mis Pagos y Boletas</h2>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50">
          
          {/* LISTA DE BOLETAS REALES */}
          <div className="border border-gray-200 bg-white rounded-xl overflow-hidden h-64 flex flex-col">
            <h3 className="font-bold text-gray-700 p-4 border-b bg-gray-50">Historial de Pagos</h3>
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {historialNominas.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center mt-10">Aún no tienes registros de nómina.</p>
              ) : (
                historialNominas.map((nomina) => (
                  <div key={nomina.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-sm text-gray-800">Planilla #{nomina.periodo_nomina_id}</p>
                      <p className="text-xs text-gray-500">Neto: Q {Number(nomina.salario_neto).toFixed(2)}</p>
                    </div>
                    <button className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">PDF</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎁</span>
                <div>
                  <h4 className="font-bold text-gray-700">Aguinaldo</h4>
                  <p className="text-xs text-gray-500">Proyección actual: Q {(Number(perfil.salario_base) / 12 * 6).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎊</span>
                <div>
                  <h4 className="font-bold text-gray-700">Bono 14</h4>
                  <p className="text-xs text-gray-500">Proyección actual: Q {(Number(perfil.salario_base) / 12 * 6).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MODALES OCULTOS (Aparecen al hacer clic)
      ========================================================================= */}

      {/* MODAL: EDITAR INFORMACIÓN BÁSICA */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Actualizar Mis Datos</h3>
            <form onSubmit={handleUpdatePerfil} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">Teléfono de Contacto</label>
                <input required type="text" value={editFormData.telefono} onChange={e => setEditFormData({...editFormData, telefono: e.target.value})} className="w-full border p-2 rounded outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">Dirección de Domicilio</label>
                <textarea required value={editFormData.direccion} onChange={e => setEditFormData({...editFormData, direccion: e.target.value})} className="w-full border p-2 rounded outline-none focus:border-gray-500" rows={3}></textarea>
              </div>
              <p className="text-xs text-gray-400 italic">Nota: Para actualizar DPI, Nombres o Salario debes contactar a RRHH.</p>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-bold">Cancelar</button>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-gray-700">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOLICITAR PERMISO / VACACIONES */}
      {isPermisoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h3 className="text-xl font-bold text-[#a4ab9a] mb-4">Nueva Solicitud</h3>
            <form onSubmit={handleSolicitarPermiso} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">Tipo de Solicitud</label>
                <select value={permisoForm.tipo} onChange={e => setPermisoForm({...permisoForm, tipo: e.target.value})} className="w-full border p-2 rounded outline-none bg-white">
                  <option value="VACACIONES">Vacaciones</option>
                  <option value="PERMISO">Permiso / Licencia</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-bold mb-1">Desde</label>
                  <input required type="date" value={permisoForm.fecha_inicio} onChange={e => setPermisoForm({...permisoForm, fecha_inicio: e.target.value})} className="w-full border p-2 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-bold mb-1">Hasta</label>
                  <input required type="date" value={permisoForm.fecha_fin} onChange={e => setPermisoForm({...permisoForm, fecha_fin: e.target.value})} className="w-full border p-2 rounded outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">Motivo / Observaciones</label>
                <textarea required value={permisoForm.motivo} onChange={e => setPermisoForm({...permisoForm, motivo: e.target.value})} className="w-full border p-2 rounded outline-none" rows={3}></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setIsPermisoModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-bold">Cancelar</button>
                <button type="submit" className="bg-[#a4ab9a] text-white px-4 py-2 rounded font-bold hover:bg-[#8e9485]">Enviar Solicitud</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};