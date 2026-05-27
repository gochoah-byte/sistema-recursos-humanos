import { api } from './api';

export const NominaService = {
  getPeriodos: async () => {
    const response = await api.get('/nomina/periodos');
    return response.data;
  },

  generarNomina: async (datos: { fecha_inicio: string; fecha_fin: string }) => {
    const response = await api.post('/nomina/generar', datos);
    return response.data;
  },

  getDetalles: async (periodoId: number) => {
    const response = await api.get(`/nomina/detalles/${periodoId}`);
    return response.data;
  },
};