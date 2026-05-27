import React, { useState } from 'react';

interface Props {
    onClose: () => void;
    onSave: (departamento: string) => void;

    departamentoInicial?: string;
}

export const ModalDepartamento: React.FC<Props> = ({
    onClose,
    onSave,
    departamentoInicial
}) => {

    const [departamento, setDepartamento] =
        useState(departamentoInicial || '');

    const handleGuardar = async () => {

        if (!departamento.trim()) {
            alert('Ingrese un departamento');
            return;
        }

        await onSave(departamento);

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* HEADER */}
                <div className="bg-blue-500 text-white px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center">
                        <span className="text-2xl mr-3">🏢</span>

                        <h2 className="text-xl font-bold">
                            Nuevo Departamento
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl hover:scale-110 transition"
                    >
                        ×
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6">

                    <label className="block text-sm font-bold text-gray-600 mb-2">
                        Nombre del Departamento
                    </label>

                    <input
                        type="text"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        placeholder="Ej: Recursos Humanos"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <div className="flex justify-end gap-4 mt-6">

                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleGuardar}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow"
                        >
                            Guardar
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};