import { api } from './api';

export const NominaService = {
  getPeriodos: async () => {
    const response = await api.get('/periodos-nomina');
    return response.data;
  }
};