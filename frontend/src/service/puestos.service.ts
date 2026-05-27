import { api } from './api';

export const PuestosService = {

    // OBTENER TODOS
    async getAll() {

        const response = await api.get('/puestos');

        return response.data;

    },

    // CREAR
    async create(data: { nombre: string }) {

        const response = await api.post('/puestos', data);

        return response.data;

    },

    // ACTUALIZAR
    async update(id: number, data: { nombre: string }) {

        const response = await api.patch(`/puestos/${id}`, data);

        return response.data;

    },

    // ELIMINAR
    async delete(id: number) {

        const response = await api.delete(`/puestos/${id}`);

        return response.data;

    }

};