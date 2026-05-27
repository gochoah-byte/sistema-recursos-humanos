import { useState, useEffect } from 'react';

export const ModalEditarEmpleado = ({
    isOpen,
    onClose,
    empleado,
    onSave,
    puestos = [],
    departamentos = []
}: any) => { 

    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {

        if (empleado) {

            setFormData({
                ...empleado,

                fecha_nacimiento:
                    empleado.fecha_nacimiento
                        ? empleado.fecha_nacimiento.split('T')[0]
                        : '',

                salario_base: Number(empleado.salario_base),

                puesto_id: empleado.puesto_id || '',

                departamento_id: empleado.departamento_id || ''
            });
        }

    }, [empleado]);

    if (!isOpen || !formData) return null;

    // Si el empleado tiene un ID, significa que estamos editando. Si no, es nuevo.
    const esEdicion = !!formData?.id;

    console.log('MODAL PUESTOS:', puestos);
    console.log('MODAL DEPARTAMENTOS:', departamentos);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

                {/* Encabezado Elegante */}
                <div className="bg-[#a4ab9a] p-6 text-white relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                                {esEdicion ? 'Editar Expediente' : 'Nuevo Empleado'}
                            </h2>
                            <p className="text-xl font-bold">{formData.nombres || 'Formulario de Registro'} {esEdicion ? formData.apellidos : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 hover:bg-white/20 p-2 rounded-full transition-all text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Cuerpo del Formulario */}
                <div className="p-8 bg-[#fdfcfb]">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                        {/* Sección: Datos Personales */}
                        <div className="col-span-2 flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                            <span className="text-[#a4ab9a] font-bold text-sm italic">Datos Personales</span>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Nombres</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.nombres}
                                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Apellidos</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.apellidos}
                                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">
                                Número de DPI *
                            </label>

                            <input
                                type="text"
                                value={formData.dpi}
                                onChange={(e) => setFormData({ ...formData, dpi: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                placeholder="Ej: 1234567890101"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Ingrese el DPI completo del empleado.
                            </p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Teléfono de Contacto</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">
                                Fecha de Nacimiento
                            </label>

                            <input
                                required
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                value={formData.fecha_nacimiento || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fecha_nacimiento: e.target.value
                                    })
                                }
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Seleccione la fecha de nacimiento del empleado.
                            </p>
                        </div>

                        {/* DIRECCIÓN */}
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">
                                Dirección
                            </label>

                            <input
                                required
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.direccion || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        direccion: e.target.value
                                    })
                                }
                                placeholder="Ingrese la dirección del empleado"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Dirección de residencia del empleado.
                            </p>
                        </div>

                       

                        {/* Sección: Datos Laborales */}
                        <div className="col-span-2 flex items-center gap-2 border-b border-gray-100 pb-2 mt-4 mb-2">
                            <span className="text-[#a4ab9a] font-bold text-sm italic">Información Laboral</span>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Puesto</label>
                            <select
                                value={formData.puesto_id || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        puesto_id: Number(e.target.value)
                                    })
                                }
                                className="w-full border p-2 rounded outline-none focus:border-gray-500"
                            >

                                <option value="">
                                    Seleccione un puesto
                                </option>

                                {puestos?.map((p: any) => (
                                    <option
                                        key={p.id}
                                        value={p.id}
                                    >
                                        {p.nombre}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/* AQUÍ ESTÁ EL CAMPO QUE FALTABA: Departamento */}
                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Departamento</label>
                            <select
                                value={formData.departamento_id || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        departamento_id: Number(e.target.value)
                                    })
                                }
                                className="w-full border p-2 rounded outline-none focus:border-gray-500"
                            >

                                <option value="">
                                    Seleccione un departamento
                                </option>

                                {departamentos?.map((d: any) => (
                                    <option
                                        key={d.id}
                                        value={d.id}
                                    >
                                        {d.nombre}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Estado en Planilla</label>
                            <select
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm cursor-pointer"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="SUSPENDIDO">SUSPENDIDO</option>
                                <option value="RETIRADO">RETIRADO</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Salario Base Mensual (Q)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Q</span>
                                <input
                                    type="number"
                                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#a4ab9a] font-bold text-lg focus:ring-2 focus:ring-[#a4ab9a] outline-none transition-all shadow-sm"
                                    value={formData.salario_base}
                                    onChange={(e) => setFormData({ ...formData, salario_base: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors"
                        >
                            Descartar
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="bg-[#a4ab9a] hover:bg-[#8c967a] text-white px-10 py-3 rounded-2xl font-bold shadow-[0_10px_20px_rgba(164,171,154,0.3)] transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>{esEdicion ? 'Actualizar Expediente' : 'Crear Empleado'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};