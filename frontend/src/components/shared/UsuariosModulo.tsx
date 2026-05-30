import React, { useState, useEffect } from 'react';
import { UsuariosService } from '../../service/usuarios.service';
// IMPORTAMOS EL SERVICIO DE EMPLEADOS PARA OBTENER LOS NOMBRES
import { EmpleadosService } from '../../service/empleados.service';

export const UsuariosModulo: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]); // Nuevo estado para la lista de empleados
  const [loading, setLoading] = useState(true);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [cambiarPassword, setCambiarPassword] = useState(false);
  
  // Estados para el Formulario (Modal)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, correo: '', contrasena: '', rol: 'EMPLEADO', empleado_id: '' as number | string });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargamos usuarios y empleados al mismo tiempo
      const [dataUsuarios, dataEmpleados] = await Promise.all([
        UsuariosService.getAll(),
        EmpleadosService.getAll()
      ]);
      setUsuarios(dataUsuarios);
      setEmpleados(dataEmpleados);
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aseguramos que el empleado_id se mande como nulo si está vacío
      const dataToSave: any = {
        ...formData,

        empleado_id:
          formData.empleado_id === ''
            ? null
            : Number(formData.empleado_id)
      };

      /* SI ESTÁ EDITANDO Y NO QUIERE CAMBIAR PASSWORD */
      /* NO ENVIAR CONTRASEÑA */
      if (formData.id && !cambiarPassword) {
        delete dataToSave.contrasena;
      }

      if (formData.id) {
        await UsuariosService.update(formData.id, dataToSave);
      } else {
        await UsuariosService.create(dataToSave);
      }

      /* LIMPIAR FORMULARIO */
      setFormData({
        id: null,
        correo: '',
        contrasena: '',
        rol: '',
        empleado_id: ''
      });

      /* LIMPIAR BUSCADOR */
      setBusquedaEmpleado('');

      setShowForm(false);

      cargarDatos();
    } catch (error: any) {

      console.error("Error completo:", error);

      const mensajes = error.response?.data?.message;

      // VALIDACIÓN PERSONALIZADA
      if (
        Array.isArray(mensajes) &&
        mensajes.includes('Debe seleccionar un empleado')
      ) {
        alert('Debe seleccionar un empleado');
        return;
      }

      // OTROS ERRORES
      const mensajeError =
        Array.isArray(mensajes)
          ? mensajes.join(', ')
          : error.response?.data?.error
          || error.message
          || "Error desconocido al guardar";

      alert("No se pudo guardar: " + mensajeError);
    }
  };


  const handleEdit = (u: any) => {

    const empleadoEncontrado = empleados.find(
      emp => emp.id === u.empleado_id
    );


    setFormData({
      id: u.id,
      correo: u.correo,
      contrasena: '', 
      rol: u.rol,
      empleado_id: u.empleado_id
    });

    setBusquedaEmpleado(
      empleadoEncontrado
        ? `${empleadoEncontrado.nombres} ${empleadoEncontrado.apellidos}`
        : ''
    );

    setMostrarResultados(false);
    setCambiarPassword(false);


    setShowForm(true);
  };
 

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await UsuariosService.delete(id);
      cargarDatos();
    }
  };

  // Función auxiliar para buscar el nombre del empleado por su ID para mostrarlo en la tabla
  const obtenerNombreEmpleado = (id: number) => {
    const empleado = empleados.find(emp => emp.id === id);
    return empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'N/A';
  };

  return (
    <div className="w-full">
      {/* Botón Superior */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">Lista de usuarios registrados en el sistema.</p>
        <button 
          onClick={() => {

            /* MODO CREAR */
            setFormData({
              id: null,
              correo: '',
              contrasena: '',
              rol: 'EMPLEADO',
              empleado_id: ''
            });

            /* AL CREAR SIEMPRE SE PUEDE ESCRIBIR PASSWORD */
            setCambiarPassword(true);

            setShowForm(true);
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-bold"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla Funcional */}
      {loading ? <p>Cargando datos...</p> : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 rounded-tl-lg">ID</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Empleado Asignado</th>
              <th className="p-3 rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold">{u.id}</td>
                <td className="p-3">{u.correo}</td>
                <td className="p-3"><span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">{u.rol}</span></td>
                {/* AHORA MOSTRAMOS EL NOMBRE DEL EMPLEADO EN LUGAR DEL ID */}
                <td className="p-3 text-sm">{u.empleado_id ? obtenerNombreEmpleado(u.empleado_id) : <span className="text-gray-400 italic">Sin asignar</span>}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(u)} className="text-blue-500 hover:underline text-sm font-bold">Editar</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline text-sm font-bold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h3 className="text-xl font-bold mb-4">{formData.id ? 'Editar Usuario' : 'Crear Usuario'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">
                  Correo Electrónico
                </label>

                <input
                  required
                  type="email"
                  value={formData.correo}
                  onChange={e => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full border p-2 rounded outline-none focus:border-gray-500"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Ingrese un correo válido.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">
                  {formData.id ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                </label>

                {/* SOLO MOSTRAR CHECKBOX EN EDITAR */}
                {formData.id && (
                  <div className="flex items-center gap-2 mb-2">

                    <input
                      type="checkbox"
                      checked={cambiarPassword}
                      onChange={(e) => setCambiarPassword(e.target.checked)}
                    />

                    <label className="text-sm text-gray-600">
                      Cambiar contraseña
                    </label>

                  </div>
                )}

                <input
                  required={!formData.id}
                  disabled={!!formData.id && !cambiarPassword}
                  type="password"
                  value={formData.contrasena}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      contrasena: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded outline-none focus:border-gray-500 disabled:bg-gray-100"
                />

                <p className="text-xs text-gray-400 mt-1">
                  La contraseña debe contener al menos 8 caracteres.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-bold mb-1">
                  Rol en el Sistema
                </label>

                <select
                  value={formData.rol}
                  onChange={e => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full border p-2 rounded bg-white outline-none focus:border-gray-500"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="RRHH">Recursos Humanos</option>
                  <option value="EMPLEADO">Empleado</option>
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  Seleccione el nivel de permisos que tendrá el usuario.
                </p>
              </div>
              
              {/* NUEVO SELECTOR DE EMPLEADOS POR NOMBRE */}
              <div>
                <label className="block text-sm text-gray-600 font-bold mb-2">
                  Asignar Empleado
                </label>

                {/* BUSCADOR */}
                {formData.id ? (

                  <div className="w-full border rounded bg-gray-100 px-4 py-2 text-gray-600">
                    {busquedaEmpleado}
                  </div>

                ) : (

                  <input
                    type="text"
                    placeholder="Buscar por nombre o DPI..."
                    value={busquedaEmpleado}
                    onChange={(e) => setBusquedaEmpleado(e.target.value)}
                    onFocus={() => setMostrarResultados(true)}
                    className="w-full border p-2 rounded outline-none focus:border-gray-500 mb-2"
                  />

                )}

                {/* RESULTADOS */}
                {mostrarResultados && busquedaEmpleado.trim() !== '' && (

                  <div className="border rounded max-h-40 overflow-y-auto bg-white">

                    {empleados
                      .filter(emp =>
                        `${emp.nombres} ${emp.apellidos} ${emp.dpi}`
                          .toLowerCase()
                          .includes(busquedaEmpleado.toLowerCase())
                      )
                      .map(emp => (

                        <div
                          key={emp.id}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              empleado_id: emp.id
                            });

                            setBusquedaEmpleado(
                              `${emp.nombres} ${emp.apellidos}`
                            );
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b text-sm"
                        >
                          <p className="font-semibold">
                            {emp.nombres} {emp.apellidos}
                          </p>

                          <p className="text-xs text-gray-500">
                            DPI: {emp.dpi}
                          </p>
                        </div>

                      ))}

                  </div>

                )}

                <p className="text-xs text-gray-400 mt-1">
                  Busque y seleccione un empleado registrado.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => {

                  setFormData({
                    id: null,
                    correo: '',
                    contrasena: '',
                    rol: '',
                    empleado_id: ''
                  });

                  setBusquedaEmpleado('');

                  setShowForm(false);

                }} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-bold">Cancelar</button>
                <button type="submit" className="bg-[#a4ab9a] text-white px-4 py-2 rounded font-bold hover:bg-[#8e9485]">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};