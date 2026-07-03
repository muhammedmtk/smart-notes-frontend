import api from '../../services/api';

export const authAPI = {
  register: async (formData) => {
    const response = await api.post('/auth/register', formData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/auth/profile', formData);
    return response.data;
  },
};
