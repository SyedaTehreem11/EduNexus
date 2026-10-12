import api from './axios';

// GET all FAQs
export const listFAQs = async () => {
  try {
    const response = await api.get('/api/faqs/');

    // Check if the response was flagged as unauthorized
    if (response?.unauthorized || response?.status === 401) {
      const unauthorizedResult = [];
      unauthorizedResult.unauthorized = true;
      unauthorizedResult.data = [];
      return unauthorizedResult;
    }

    const list = Array.isArray(response.data)
      ? response.data
      : (response.data?.results || []);

    list.unauthorized = false;
    list.data = list;
    return list;
  } catch (err) {
    if (err.response?.status === 401 || err.status === 401) {
      const unauthorizedResult = [];
      unauthorizedResult.unauthorized = true;
      unauthorizedResult.data = [];
      return unauthorizedResult;
    }

    const fallbackResult = [];
    fallbackResult.unauthorized = false;
    fallbackResult.data = [];
    fallbackResult.error = err.message;
    return fallbackResult;
  }
};

// GET FAQ by ID
export const getFAQ = async (id) => {
  const response = await api.get(`/api/faqs/${id}/`);
  return response.data;
};

// POST create FAQ
export const createFAQ = async (data) => {
  const response = await api.post('/api/faqs/', data);
  return response.data;
};

// PUT update FAQ
export const updateFAQ = async (id, data) => {
  const response = await api.put(`/api/faqs/${id}/`, data);
  return response.data;
};

// DELETE FAQ
export const deleteFAQ = async (id) => {
  const response = await api.delete(`/api/faqs/${id}/`);
  return response.data;
};
