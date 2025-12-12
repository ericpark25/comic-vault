import { useState } from 'react';
import { Table, Button, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory';
import UpdateQuantityModal from './UpdateQuantityModal';
import { showSuccess, showError } from '../../utils/notifications';

function InventoryTable({ inventory, vaultId, vault }) {
    const [editingItem, setEditingItem] = useState(null);
    const queryClient = useQueryClient();

    // Called by handleRemove
    // Mutation to delete a record of an inventory item on the backend
    const removeMutation = useMutation({
        mutationFn: ({ comicId, comicName }) =>
            inventoryApi.removeComic(vaultId, comicId),
        onSuccess: () => {
            showSuccess('Comic removed from vault');
            queryClient.invalidateQueries({ queryKey: ['inventory', vaultId] });
            queryClient.invalidateQueries({ queryKey: ['vaults'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to remove comic');
        },
    });

    // open confirmation modal to delete a comic
    const handleRemove = (item) => {
        modals.openConfirmModal({
            title: 'Remove Comic',
            children: (
                <p>
                    Are you sure you want to remove{' '}
                    <strong>{item.comic.name}</strong> from this vault?
                </p>
            ),
            labels: { confirm: 'Remove', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () =>
                removeMutation.mutate({
                    comicId: item.comic.id,
                    comicName: item.comic.name,
                }),
        });
    };

    if (!inventory || inventory.length === 0) {
        return <Text c='dimmed'>No comics in this vault yet.</Text>;
    }

    return (
        <>
            <Table
                striped
                highlightOnHover
                style={{ tableLayout: 'fixed', width: '100%' }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>SKU</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {inventory.map((item) => (
                        <Table.Tr key={item.id}>
                            <Table.Td>{item.comic.sku}</Table.Td>
                            <Table.Td>{item.comic.name}</Table.Td>
                            <Table.Td>
                                {item.comic.price !== null &&
                                item.comic.price !== undefined
                                    ? `$${Number(item.comic.price).toFixed(2)}`
                                    : '-'}
                            </Table.Td>
                            <Table.Td>{item.quantity}</Table.Td>
                            <Table.Td>
                                <Group gap='xs'>
                                    <Button
                                        size='xs'
                                        variant='subtle'
                                        leftSection={<IconEdit size={14} />}
                                        onClick={() => setEditingItem(item)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        size='xs'
                                        variant='subtle'
                                        color='red'
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() => handleRemove(item)}
                                        loading={removeMutation.isPending}
                                    >
                                        Remove
                                    </Button>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <UpdateQuantityModal
                item={editingItem}
                vaultId={vaultId}
                vault={vault}
                currentInventory={inventory}
                onClose={() => setEditingItem(null)}
            />
        </>
    );
}

export default InventoryTable;
