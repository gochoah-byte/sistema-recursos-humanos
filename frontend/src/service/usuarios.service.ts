import { api } from './api';

export const UsuariosService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};