import api from '../../services/api';

const appendIfValid = (queryParams, key, value) => {
  if (value !== undefined && value !== null && value !== '' && value !== 'all') {
    queryParams.append(key, String(value));
  }
};

export const notesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();

    appendIfValid(queryParams, 'search', params.search);
    appendIfValid(queryParams, 'category', params.category);
    appendIfValid(queryParams, 'status', params.status);
    appendIfValid(queryParams, 'isPinned', params.isPinned);
    appendIfValid(queryParams, 'sortBy', params.sortBy);
    appendIfValid(queryParams, 'sortOrder', params.sortOrder);
    appendIfValid(queryParams, 'page', params.page);
    appendIfValid(queryParams, 'limit', params.limit);

    const queryString = queryParams.toString();
    const response = await api.get(`/notes${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  update: async (id, noteData) => {
    const response = await api.patch(`/notes/${id}`, noteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  togglePin: async (id) => {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },

  archive: async (id) => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },
};
