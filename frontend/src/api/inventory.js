import { apiClient } from './client';

export const inventoryApi = {
    // GET /api/vaults/{vaultId}/inventory - Get all inventories for a vault
    getByVault: (vaultId) =>
        apiClient.get(`vaults/${vaultId}/inventory`).json(),

    // POST /api/vaults/{vaultId}/inventory - Add comic to vault
    addComic: (vaultId, data) =>
        apiClient.post(`vaults/${vaultId}/inventory`, { json: data }).json(),

    // PUT /api/vaults/{vaultId}/inventory/{comicId} - Update quantity
    updateQuantity: (vaultId, comicId, data) =>
        apiClient
            .put(`vaults/${vaultId}/inventory/${comicId}`, { json: data })
            .json(),

    // DELETE /api/vaults/{vaultId}/inventory/{comicId} - Remove from vault
    removeComic: (vaultId, comicId) =>
        apiClient.delete(`vaults/${vaultId}/inventory/${comicId}`),

    // POST /api/inventory/transfer - Transfer between vaults
    transfer: (data) =>
        apiClient.post('inventory/transfer', { json: data }).json(),
};
