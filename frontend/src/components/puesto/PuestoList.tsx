import {
    useEffect,
    useState
} from 'react';

import { ModalPuesto } from '../puesto/ModalPuesto';
import { PuestosService } from '../../service/puestos.service';

export const PuestosList = () => {

    const [showModal, setShowModal] =
        useState(false);

    const [puestoEditar, setPuestoEditar] =
        useState<any>(null);

    const [puestos, setPuestos] =
        useState<any[]>([]);

    useEffect(() => {

        cargarPuestos();

    }, []);

    const cargarPuestos = async () => {

        try {

            const data =
                await PuestosService.getAll();

            setPuestos(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleGuardarPuesto =
        async (nombre: string) => {

            try {

                if (puestoEditar) {

                    await PuestosService.update(
                        puestoEditar.id,
                        { nombre }
                    );

                } else {

                    await PuestosService.create({
                        nombre
                    });

                }

                await cargarPuestos();

                setShowModal(false);

                setPuestoEditar(null);

            } catch (error: any) {

                alert(
                    error.response?.data?.message ||
                    'Error al guardar puesto'
                );

            }

        };

    const handleEliminarPuesto =
        async (id: number) => {

            const confirmar =
                confirm(
                    '¿Desea eliminar este puesto?'
                );

            if (!confirmar) return;

            try {

                await PuestosService.delete(id);

                await cargarPuestos();

            } catch (error: any) {

                alert(
                    error.response?.data?.message ||
                    'Error al eliminar puesto'
                );

            }

        };

    const handleEditarPuesto = (
        puesto: any
    ) => {

        setPuestoEditar(puesto);

        setShowModal(true);

    };

    return (

        <>

            {showModal && (

                <ModalPuesto
                    onClose={() => {
                        setShowModal(false);
                        setPuestoEditar(null);
                    }}
                    onSave={handleGuardarPuesto}
                    puestoInicial={
                        puestoEditar?.nombre
                    }
                />

            )}

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                {/* HEADER */}
                <div className="px-8 py-6 border-b border-gray-100">

                    <h2 className="text-3xl font-black text-indigo-600 text-center">
                        Módulo de Puestos
                    </h2>

                    <p className="text-center text-gray-500 mt-3">
                        Aquí podrás gestionar los puestos laborales registrados en la empresa.
                    </p>

                </div>

                {/* CONTENIDO */}
                <div className="p-8">

                    {/* BOTÓN */}
                    <div className="flex justify-end mb-6">

                        <button
                            onClick={() => setShowModal(true)}
                            className="
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                px-5
                                py-2
                                rounded-xl
                                font-semibold
                                transition
                            "
                        >
                            + Nuevo Puesto
                        </button>

                    </div>

                    {/* TABLA */}
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50 border-b border-gray-200">

                                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-600">
                                        Puesto
                                    </th>

                                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-600">
                                        Fecha Creación
                                    </th>

                                    <th className="text-center px-5 py-4 text-sm font-bold text-gray-600">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {puestos.map((p: any) => (

                                    <tr
                                        key={p.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >

                                        <td className="px-5 py-4 text-gray-800 font-semibold">
                                            {p.nombre}
                                        </td>

                                        <td className="px-5 py-4 text-gray-500">
                                            {new Date(p.creado_en).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-3">

                                                {/* EDITAR */}
                                                <button
                                                    onClick={() =>
                                                        handleEditarPuesto(p)
                                                    }
                                                    className="
                                                        bg-yellow-100
                                                        hover:bg-yellow-200
                                                        text-yellow-700
                                                        px-4
                                                        py-2
                                                        rounded-xl
                                                        text-sm
                                                        font-semibold
                                                        transition
                                                    "
                                                >
                                                    Editar
                                                </button>

                                                {/* ELIMINAR */}
                                                <button
                                                    onClick={() =>
                                                        handleEliminarPuesto(p.id)
                                                    }
                                                    className="
                                                        bg-red-100
                                                        hover:bg-red-200
                                                        text-red-700
                                                        px-4
                                                        py-2
                                                        rounded-xl
                                                        text-sm
                                                        font-semibold
                                                        transition
                                                    "
                                                >
                                                    Eliminar
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                {puestos.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={3}
                                            className="text-center py-10 text-gray-400"
                                        >
                                            No hay puestos registrados.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </>

    );
};