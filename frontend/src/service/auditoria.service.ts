import { api } from './api';

export const AuditoriaService = {
  getAll: async () => {
    const response = await api.get('/auditoria');
    return response.data;
  }
};