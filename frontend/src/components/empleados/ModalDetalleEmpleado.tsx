import React from 'react';

interface Props {
    empleado: any;
    onClose: () => void;
}

export const ModalDetalleEmpleado: React.FC<Props> = ({
    empleado,
    onClose
}) => {

    if (!empleado) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl shadow-2xl w-[750px] max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="bg-[#a4ab9a] text-white px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Información del Empleado
                        </h2>

                        <p className="text-sm opacity-80 mt-1">
                            Datos completos del colaborador
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl hover:text-red-200 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="p-8">

                    {/* FOTO / PERFIL */}
                    <div className="flex items-center gap-5 mb-8">

                        <div className="w-24 h-24 rounded-full bg-[#a4ab9a] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {empleado.nombres?.charAt(0)}
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {empleado.nombres} {empleado.apellidos}
                            </h3>

                            

                            <span className={`
                inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold
                ${empleado.estado === 'ACTIVO'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'}
              `}>
                                {empleado.estado}
                            </span>
                        </div>

                    </div>

                    {/* INFORMACIÓN */}
                    <div className="grid grid-cols-2 gap-6">

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                DPI
                            </p>

                            <p className="font-bold text-gray-800">
                                {empleado.dpi}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                Fecha de Nacimiento
                            </p>

                            <p className="font-bold text-gray-800">
                                {
                                    empleado.fecha_nacimiento
                                        ? (() => {

                                            const fecha = empleado.fecha_nacimiento
                                                .split('T')[0];

                                            const [anio, mes, dia] =
                                                fecha.split('-');

                                            return `${dia} de ${new Date(
                                                Number(anio),
                                                Number(mes) - 1,
                                                Number(dia)
                                            ).toLocaleString('es-GT', {
                                                month: 'long'
                                            })} de ${anio}`;

                                        })()
                                        : 'No registrada'
                                }
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                Teléfono
                            </p>

                            <p className="font-bold text-gray-800">
                                {empleado.telefono}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                Departamento
                            </p>

                            <p className="font-bold text-gray-800">
                                {empleado.departamentos?.nombre || 'Sin departamento'}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                Puesto
                            </p>

                            <p className="font-bold text-gray-800">
                                {empleado.puesto}

                                <p className="text-gray-500">
                                {empleado.puestos?.nombre || 'Sin puesto'}
                            </p>
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                                Salario Base
                            </p>

                            <p className="font-bold text-green-700 text-lg">
                                Q{Number(empleado.salario_base).toLocaleString('es-GT', {
                                    minimumFractionDigits: 2
                                })}
                            </p>
                        </div>

                    </div>

                    {/* DIRECCIÓN */}
                    <div className="mt-6 bg-gray-50 rounded-2xl p-4">

                        <p className="text-xs text-gray-500 uppercase mb-1">
                            Dirección
                        </p>

                        <p className="font-bold text-gray-800">
                            {empleado.direccion}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};