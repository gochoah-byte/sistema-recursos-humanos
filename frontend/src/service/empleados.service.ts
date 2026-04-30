import { api } from './api';

export const EmpleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },
  getIncompletos: async () => {
    const response = await api.get('/empleados/reportes/expedientes-incompletos');
    return response.data;
  }
};