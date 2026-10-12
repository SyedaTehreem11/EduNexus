import api from './axios';

// GET all documents
export const listDocuments = async () => {
  const response = await api.get('/api/documents/');
  return response.data;
};

// GET document by ID
export const getDocument = async (id) => {
  const response = await api.get(`/api/documents/${id}/`);
  return response.data;
};

// POST create document
// fields: application (int), doc_type (string), file_path (string), verification_status (string)
// TODO: real file upload in later phase
export const createDocument = async (data) => {
  const response = await api.post('/api/documents/', data);
  return response.data;
};

// PUT / PATCH update document
export const updateDocument = async (id, data) => {
  const response = await api.put(`/api/documents/${id}/`, data);
  return response.data;
};

// DELETE document
export const deleteDocument = async (id) => {
  const response = await api.delete(`/api/documents/${id}/`);
  return response.data;
};
