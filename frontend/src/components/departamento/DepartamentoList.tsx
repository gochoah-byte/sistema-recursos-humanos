import {
    useEffect,
    useState
} from 'react';

import { ModalDepartamento }from '../departamento/ModalDepartamento';
import { DepartamentosService }from '../../service/departamentos.service';



export const DepartamentosList = () => {

    const [showModal, setShowModal] =
        useState(false);

    const [departamentoEditar, setDepartamentoEditar] =
        useState<any>(null);

    const [departamentos, setDepartamentos] =
        useState<any[]>([]);


    useEffect(() => {

        cargarDepartamentos();

    }, []);

    const cargarDepartamentos = async () => {

        try {

            const data =
                await DepartamentosService.getAll();

            setDepartamentos(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleGuardarDepartamento =
        async (nombre: string) => {

            try {

                if (departamentoEditar) {

                    await DepartamentosService.update(
                        departamentoEditar.id,
                        { nombre }
                    );

                } else {

                    await DepartamentosService.create({
                        nombre
                    });

                }

                await cargarDepartamentos();

                setShowModal(false);

                setDepartamentoEditar(null);

            } catch (error: any) {

                alert(
                    error.response?.data?.message ||
                    'Error al guardar departamento'
                );

            }

        };

    const handleEliminarDepartamento =
        async (id: number) => {

            const confirmar =
                confirm(
                    '¿Desea eliminar este departamento?'
                );

            if (!confirmar) return;

            try {

                await DepartamentosService.delete(id);

                await cargarDepartamentos();

            } catch (error: any) {

                alert(
                    error.response?.data?.message ||
                    'Error al eliminar departamento'
                );

            }

        };

    const handleEditarDepartamento = (
        departamento: any
    ) => {

        setDepartamentoEditar(departamento);

        setShowModal(true);

    };



    return (

         <>

            {showModal && (

                <ModalDepartamento
                    onClose={() => {
                        setShowModal(false);
                        setDepartamentoEditar(null);
                    }}
                    onSave={handleGuardarDepartamento}
                    departamentoInicial={
                        departamentoEditar?.nombre
                    }
                />

            )}


        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            {/* HEADER */}
            <div className="px-8 py-6 border-b border-gray-100">

                <h2 className="text-3xl font-black text-blue-600 text-center">
                    Módulo de Departamentos
                </h2>

                <p className="text-center text-gray-500 mt-3">
                    Aquí podrás gestionar los departamentos de la empresa y asignar empleados a cada uno.
                </p>

            </div>

            {/* CONTENIDO */}
            <div className="p-8">

                {/* BOTÓN */}
                <div className="flex justify-end mb-6">

                    <button
                        onClick={() => setShowModal(true)}
                        className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-5
    py-2
    rounded-xl
    font-semibold
  "
                    >
                        + Nuevo Departamento
                    </button>

                </div>

                {/* TABLA */}
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-gray-50 border-b border-gray-200">


                                <th className="text-left px-5 py-4 text-sm font-bold text-gray-600">
                                    Departamento
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

                            {departamentos.map((dep: any) => (

                                <tr
                                    key={dep.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >

                                   

                                    <td className="px-5 py-4 text-gray-800 font-semibold">
                                        {dep.nombre}
                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {new Date(dep.creado_en).toLocaleDateString()}
                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* EDITAR */}
                                            <button
                                                onClick={() =>
                                                    handleEditarDepartamento(dep)
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
                                                    handleEliminarDepartamento(dep.id)
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

                            {departamentos.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No hay departamentos registrados.
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
