export const ModalDocumentosEmpleado = ({ onClose }: any) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">
                    Documentos del Empleado
                </h2>

                <p>Aquí irán los documentos PDF.</p>

                <button
                    onClick={onClose}
                    className="mt-4 bg-[#a4ab9a] text-white px-4 py-2 rounded"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};