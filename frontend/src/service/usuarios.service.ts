import { api } from './api';

export const UsuariosService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  }
};