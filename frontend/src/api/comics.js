import { apiClient } from './client';

export const comicApi = {
    // GET /api/comics - List all comics
    getAll: () => apiClient.get('comics').json(),

    // GET /api/comics/{id} - Get single comic
    getById: (id) => apiClient.get(`comics/${id}`).json(),

    // POST /api/comics - Create comic
    create: (data) => apiClient.post('comics', { json: data }).json(),

    // PUT /api/comics/{id} - Update comic
    update: (id, data) => apiClient.put(`comics/${id}`, { json: data }).json(),

    // DELETE /api/comics/{id} - Delete comic
    delete: (id) => apiClient.delete(`comics/${id}`),
};
