import api from './axios';

// GET all applications
export const listApplications = async () => {
  const response = await api.get('/api/applications/');
  return response.data;
};

// GET application by ID
export const getApplication = async (id) => {
  const response = await api.get(`/api/applications/${id}/`);
  return response.data;
};

// POST create application
// fields: user (int), dob (YYYY-MM-DD), cnic (string), status (string, default "Pending")
export const createApplication = async (data) => {
  const response = await api.post('/api/applications/', data);
  return response.data;
};

// PUT / PATCH update application
export const updateApplication = async (id, data) => {
  const response = await api.put(`/api/applications/${id}/`, data);
  return response.data;
};

// DELETE application
export const deleteApplication = async (id) => {
  const response = await api.delete(`/api/applications/${id}/`);
  return response.data;
};
