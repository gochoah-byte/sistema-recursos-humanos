import { api } from './api';

export const getTiposDocumento = () => api.get('/tipos-documento');

export const getDocumentosPorEmpleado = (id: number) =>
  api.get(`/documentos/empleado/${id}`);

export const subirDocumento = (formData: FormData) =>
  api.post('/documentos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const DocumentosService = {
  getAll: async () => {
    const response = await api.get('/documentos');
    return response.data;
  }
};