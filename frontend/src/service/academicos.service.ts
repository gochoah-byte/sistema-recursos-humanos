import { api } from './api';

export const AcademicosService = {
  getAll: async () => {
    const response = await api.get('/registros-academicos');
    return response.data;
  }
};
