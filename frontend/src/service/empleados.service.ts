import { api } from './api';

export const EmpleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },

  // Tu función original para el Dashboard se mantiene intacta
  getIncompletos: async () => {
    const response = await api.get('/empleados/reportes/expedientes-incompletos');
    return response.data;
  },

  // Agregamos la función para crear el nuevo empleado
  create: async (data: any) => {
    const response = await api.post('/empleados', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/empleados/${id}`, data);
    return response.data;
  },

  // Agregamos la función para eliminar un empleado
  delete: async (id: number) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  }
};