import React, { useState, useEffect } from 'react';
import { UsuariosService } from '../../service/usuarios.service';
import { EmpleadosService } from '../../service/empleados.service';

export const UsuariosModulo: React.FC = () => {

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState('TODOS');
const [filtroRol, setFiltroRol] = useState('TODOS');
const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);

  const [formData, setFormData] = useState({
    id: null as number | null,
    correo: '',
    contrasena: '',
    rol: 'EMPLEADO',
    activo: true,
    empleado_id: '' as number | string
  });

  const cargarDatos = async () => {

    setLoading(true);

    try {

      const [dataUsuarios, dataEmpleados] = await Promise.all([
        UsuariosService.getAll(),
        EmpleadosService.getAll()
      ]);

      setUsuarios(
        Array.isArray(dataUsuarios)
          ? dataUsuarios
          : dataUsuarios.data || []
      );

      setEmpleados(dataEmpleados);

    } catch (error) {

      console.error('Error cargando datos', error);

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

      const dataToSave = {
        ...formData,
        empleado_id:
          formData.empleado_id === ''
            ? null
            : Number(formData.empleado_id)
      };

      if (formData.id) {

        await UsuariosService.update(formData.id, dataToSave);

      } else {

        await UsuariosService.create(dataToSave);

      }

      setShowForm(false);

      cargarDatos();

    } catch (error: any) {

      console.error('Error completo:', error);

      const mensajeError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error desconocido';

      alert('No se pudo guardar: ' + mensajeError);
    }
  };

  const handleEdit = (user: any) => {

    setFormData({
      id: user.id,
      correo: user.correo,
      contrasena: '',
      rol: user.rol,
      activo: user.activo,
      empleado_id: user.empleado_id || ''
    });

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {

    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este usuario?'
    );

    if (!confirmar) return;

    try {

      await UsuariosService.delete(id);

      cargarDatos();

    } catch (error) {

      console.error('Error eliminando usuario', error);

      alert('No se pudo eliminar el usuario');
    }
  };
  const handleView = (usuario: any) => {

  setUsuarioSeleccionado(usuario);

  setShowView(true);
};

  const obtenerNombreEmpleado = (id: number) => {

    const empleado = empleados.find(emp => emp.id === id);

    return empleado
      ? `${empleado.nombres} ${empleado.apellidos}`
      : 'N/A';
  };

  return (

    <div className="w-full">

      <div className="flex justify-between items-center mb-4">

        <p className="text-gray-500">
          Lista de usuarios registrados en el sistema.
        </p>

        <button
          onClick={() => {

            setFormData({
              id: null,
              correo: '',
              contrasena: '',
              rol: 'EMPLEADO',
              activo: true,
              empleado_id: ''
            });

            setShowForm(true);
          }}
          className="bg-[#8e9485] hover:bg-[#787f70] text-white px-4 py-2 rounded-lg font-bold transition"
        >
          + Nuevo Usuario
        </button>

      </div>

      <div className="flex justify-end gap-3 mb-4">

  {/* FILTRO ESTADO */}
  <select
    value={filtroEstado}
    onChange={(e) => setFiltroEstado(e.target.value)}
    className="border p-2 rounded-lg bg-white"
  >
    <option value="TODOS">Todos los estados</option>
    <option value="ACTIVOS">Activos</option>
    <option value="INACTIVOS">Inactivos</option>
  </select>

{/* FILTRO ROL */}
<select
  value={filtroRol}
  onChange={(e) => setFiltroRol(e.target.value)}
  className="border p-2 rounded-lg bg-white"
>
  <option value="TODOS">Todos los roles</option>
  <option value="ADMIN">ADMIN</option>
  <option value="RRHH">RRHH</option>
  <option value="EMPLEADO">EMPLEADO</option>
</select>

</div>

<div className="mb-4">

  <input
    type="text"
    placeholder="Buscar por correo, rol o empleado..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="w-full border p-3 rounded-lg outline-none focus:border-[#8e9485]"
  />

</div>

{loading ? (

  <p>Cargando datos...</p>

      ) : (

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="bg-gray-100 text-gray-600">

              <th className="p-3 rounded-tl-lg">ID</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Empleado Asignado</th>
              <th className="p-3">Estado</th>
              <th className="p-3 rounded-tr-lg">Acciones</th>

            </tr>

          </thead>

          <tbody>

            {usuarios

              .filter((u) => {

  if (filtroEstado === 'ACTIVOS') {
    return u.activo === true;
  }

  if (filtroEstado === 'INACTIVOS') {
    return u.activo === false;
  }

  if (
    filtroRol !== 'TODOS' &&
    u.rol !== filtroRol
  ) {
    return false;
  }

  const texto = busqueda.toLowerCase();

  const nombreEmpleado = u.empleado_id
    ? obtenerNombreEmpleado(u.empleado_id).toLowerCase()
    : '';

  if (
    !u.correo.toLowerCase().includes(texto) &&
    !u.rol.toLowerCase().includes(texto) &&
    !nombreEmpleado.includes(texto)
  ) {
    return false;
  }

  return true;
})
              .map((u) => (

                <tr
                  key={u.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3 font-bold">
                    {u.id}
                  </td>

                  <td className="p-3">
                    {u.correo}
                  </td>

                  <td className="p-3">

                    <span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">
                      {u.rol}
                    </span>

                  </td>

                  <td className="p-3 text-sm">

                    {u.empleado_id
                      ? obtenerNombreEmpleado(u.empleado_id)
                      : (
                        <span className="text-gray-400 italic">
                          Sin asignar
                        </span>
                      )}

                  </td>

                  <td className="p-3">

                    {u.activo ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        Activo
                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        Inactivo
                      </span>

                    )}

                  </td>

                  <td className="p-3 space-x-2">
                    <button
  onClick={() => handleView(u)}
  className="text-gray-600 hover:underline text-sm font-bold"
>
  Ver
</button>

                    <button
                      onClick={() => handleEdit(u)}
                      className="text-[#8e9485] hover:underline text-sm font-bold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:underline text-sm font-bold"
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      )}

      {showForm && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

            <h3 className="text-xl font-bold mb-4">

              {formData.id
                ? 'Editar Usuario'
                : 'Crear Usuario'}

            </h3>

            <form
              onSubmit={handleSave}
              className="space-y-4"
            >

              <div>

                <label className="block text-sm text-gray-600 font-bold mb-1">
                  Correo Electrónico
                </label>

                <input
                  required
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correo: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded outline-none focus:border-gray-500"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-600 font-bold mb-1">

                  {formData.id
                    ? 'Nueva Contraseña (Opcional)'
                    : 'Contraseña'}

                </label>

                <input
                  required={!formData.id}
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contrasena: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded outline-none focus:border-gray-500"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-600 font-bold mb-1">
                  Rol en el Sistema
                </label>

                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rol: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded bg-white outline-none focus:border-gray-500"
                >
                  <option value="ADMIN">
                    Administrador
                  </option>

                  <option value="RRHH">
                    Recursos Humanos
                  </option>

                  <option value="EMPLEADO">
                    Empleado
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm text-gray-600 font-bold mb-1">
                  Estado del Usuario
                </label>

                <select
                  value={formData.activo ? 'ACTIVO' : 'INACTIVO'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activo: e.target.value === 'ACTIVO'
                    })
                  }
                  className="w-full border p-2 rounded bg-white outline-none focus:border-gray-500"
                >

                  <option value="ACTIVO">
                    Activo
                  </option>

                  <option value="INACTIVO">
                    Inactivo
                  </option>

                </select>

              </div>

              <div>

  <label className="block text-sm text-gray-600 font-bold mb-1">
    Asignar a Empleado (Opcional)
  </label>

  <select
    value={formData.empleado_id}
    onChange={(e) =>
      setFormData({
        ...formData,
        empleado_id: e.target.value
      })
    }
    className="w-full border p-2 rounded bg-white outline-none focus:border-gray-500"
  >

    <option value="">
      -- Sin asignar --
    </option>

    {empleados.map((emp) => (

      <option
        key={emp.id}
        value={emp.id}
      >
        {emp.nombres} {emp.apellidos} - DPI: {emp.dpi}
      </option>

    ))}

  </select>

</div>

<div className="flex justify-end space-x-2 pt-4">

  <button
    type="button"
    onClick={() => setShowForm(false)}
    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-bold"
  >
    Cancelar
  </button>

  <button
    type="submit"
    className="bg-[#a4ab9a] text-white px-4 py-2 rounded font-bold hover:bg-[#8e9485]"
  >
    Guardar
  </button>

</div>

</form>

</div>

</div>

)}

{showView && usuarioSeleccionado && (

  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

      <h3 className="text-2xl font-bold mb-6 text-[#8e9485]">
        Información del Usuario
      </h3>

      <div className="space-y-4">

        <div>
          <p className="text-gray-500 text-sm">
            Correo
          </p>

          <p className="font-bold">
            {usuarioSeleccionado.correo}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Rol
          </p>

          <p className="font-bold">
            {usuarioSeleccionado.rol}
          </p>
        </div>

        <div>

          <p className="text-gray-500 text-sm">
            Estado
          </p>

          {usuarioSeleccionado.activo ? (

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              Activo
            </span>

          ) : (

            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
              Inactivo
            </span>

          )}

        </div>

        <div>

          <p className="text-gray-500 text-sm">
            Empleado Asignado
          </p>

          <p className="font-bold">

            {usuarioSeleccionado.empleado_id
              ? obtenerNombreEmpleado(usuarioSeleccionado.empleado_id)
              : 'Sin asignar'}

          </p>

        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setShowView(false)}
          className="bg-[#8e9485] hover:bg-[#787f70] text-white px-4 py-2 rounded-lg font-bold"
        >
          Cerrar
        </button>

      </div>

    </div>

  </div>

)}

</div>
);
};