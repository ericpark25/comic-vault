import { apiClient } from './client';

export const vaultApi = {
    // GET /api/vaults - List all vaults
    getAll: () => apiClient.get('vaults').json(),

    // GET /api/vaults/{id} - Get single vault
    getById: (id) => apiClient.get(`vaults/${id}`).json(),

    // POST /api/vaults - Create vault
    create: (data) => apiClient.post('vaults', { json: data }).json(),

    // PUT /api/vaults/{id} - Update vault
    update: (id, data) => apiClient.put(`vaults/${id}`, { json: data }).json(),

    // DELETE /api/vaults/{id} - Delete vault
    delete: (id) => apiClient.delete(`vaults/${id}`),
};
