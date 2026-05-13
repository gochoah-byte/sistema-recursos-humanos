import { api } from './api';

export const NominaService = {
  getPeriodos: async () => {
    const response = await api.get('/periodos-nomina');
    return response.data;
  },

  getDetallesByEmpleado: async (empleadoId: number | string) => {
    const response = await api.get(`/detalles-nomina?empleadoId=${empleadoId}`);
    return response.data;
  }
};