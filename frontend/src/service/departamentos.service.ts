import { api } from './api';

export const DepartamentosService = {

    // OBTENER TODOS
    async getAll() {

        const response = await api.get('/departamentos');

        return response.data;

    },

    // CREAR
    async create(data: { nombre: string }) {

        const response = await api.post('/departamentos', data);

        return response.data;

    },

    // ACTUALIZAR
    async update(id: number, data: { nombre: string }) {

        const response = await api.patch(`/departamentos/${id}`, data);

        return response.data;

    },

    // ELIMINAR
    async delete(id: number) {

        const response = await api.delete(`/departamentos/${id}`);

        return response.data;

    }

};