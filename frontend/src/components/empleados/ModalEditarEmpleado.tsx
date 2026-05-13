import { useState, useEffect } from 'react';
import lockIcon from '../../assets/lock.png';

export const ModalEditarEmpleado = ({ isOpen, onClose, empleado, onSave }: any) => {
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (empleado) {
            setFormData({
                ...empleado,
                salario_base: Number(empleado.salario_base)
            });
        }
    }, [empleado]);

    if (!isOpen || !formData) return null;

    // Si el empleado tiene un ID, significa que estamos editando. Si no, es nuevo.
    const esEdicion = !!formData?.id;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

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
                                Número de DPI {esEdicion ? '(No editable)' : '*'}
                            </label>
                            {esEdicion ? (
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-400">
                                    <img src={lockIcon} alt="Candado" className="w-5 h-5 object-contain opacity-70" />
                                    <span className="font-mono">{formData.dpi}</span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    required
                                    value={formData.dpi}
                                    onChange={(e) => setFormData({...formData, dpi: e.target.value})}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                    placeholder="Ej: 12345678-9"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Teléfono de Contacto</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>

                        {/* Sección: Datos Laborales */}
                        <div className="col-span-2 flex items-center gap-2 border-b border-gray-100 pb-2 mt-4 mb-2">
                            <span className="text-[#a4ab9a] font-bold text-sm italic">Información Laboral</span>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Puesto</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.puesto}
                                onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                            />
                        </div>

                        {/* AQUÍ ESTÁ EL CAMPO QUE FALTABA: Departamento */}
                        <div>
                            <label className="block text-[10px] font-black text-[#a4ab9a] uppercase mb-2 tracking-wider">Departamento</label>
                            <input
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#a4ab9a] focus:border-transparent outline-none transition-all shadow-sm"
                                value={formData.departamento}
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                            />
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