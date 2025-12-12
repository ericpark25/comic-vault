import { Card, Text, Group, Button, Badge } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vaultApi } from '../../api/vaults';
import { showSuccess, showError } from '../../utils/notifications';

function VaultCard({ vault, onEdit }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // called by handleDelete
    // useMutation to delete vault on the backend
    const deleteMutation = useMutation({
        mutationFn: () => vaultApi.delete(vault.id),
        // invalidate queries on success
        onSuccess: () => {
            showSuccess('Vault deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['vaults'] });
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to delete vault');
        },
    });

    // open mantine modal when delete is clicked
    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Vault',
            children: (
                <Text size='sm'>
                    Are you sure you want to delete{' '}
                    <strong>{vault.name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteMutation.mutate(),
        });
    };

    return (
        <Card shadow='sm' padding='lg' withBorder>
            <Group justify='space-between' mb='xs'>
                <Text fw={500}>{vault.name}</Text>
                <Badge color='blue' variant='light'>
                    Capacity: {vault.maxCapacity}
                </Badge>
            </Group>

            <Text size='sm' c='dimmed' mb='md'>
                {vault.location}
            </Text>

            <Group justify='space-between'>
                <Button
                    size='xs'
                    variant='light'
                    leftSection={<IconPackage size={14} />}
                    onClick={() => navigate(`/inventory/${vault.id}`)}
                >
                    Inventory
                </Button>
                <Group gap='xs'>
                    <Button
                        size='xs'
                        variant='subtle'
                        leftSection={<IconEdit size={14} />}
                        onClick={() => onEdit(vault)}
                    >
                        Edit
                    </Button>
                    <Button
                        size='xs'
                        variant='subtle'
                        color='red'
                        leftSection={<IconTrash size={14} />}
                        onClick={handleDelete}
                        loading={deleteMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Group>
        </Card>
    );
}
export default VaultCard;
