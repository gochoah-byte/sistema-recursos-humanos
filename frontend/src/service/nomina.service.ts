import { api } from './api';

export const NominaService = {
  getPeriodos: async () => {
    const response = await api.get('/periodos-nomina');
    return response.data;
  },
  
  cerrarPeriodo: async (id: number) => {
  const response =
    await api.patch(`/periodos-nomina/${id}/cerrar`);

  return response.data;
},

  createPeriodo: async (data: any) => {
    const response = await api.post('/periodos-nomina', data);
    return response.data;
  },

  getDetalles: async () => {
  const response = await api.get('/detalles-nomina');
  return response.data;
},

  getDetallesByEmpleado: async (empleadoId: number | string) => {
    const response = await api.get(`/detalles-nomina?empleadoId=${empleadoId}`);
    return response.data;
  }
};