import { Card, Text, Group, Button, Badge } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comicApi } from '../../api/comics';
import { showSuccess, showError } from '../../utils/notifications';

function ComicCard({ comic, onEdit }) {
    const queryClient = useQueryClient();

    // called by handleDelete
    // useMutation to delete comic on the backend
    const deleteMutation = useMutation({
        mutationFn: () => comicApi.delete(comic.id),
        // invalidate queries on success
        onSuccess: () => {
            showSuccess('Comic deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to delete comic');
        },
    });

    // Opens confirmation modal to delete a comic
    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Comic',
            children: (
                <Text size='sm'>
                    Are you sure you want to delete{' '}
                    <strong>{comic.name}</strong>? This action cannot be undone.
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
                <Text fw={500}>{comic.name}</Text>
                <Badge color='blue' variant='light'>
                    {comic.sku}
                </Badge>
            </Group>

            <Text size='sm' c='dimmed' mb='md' lineClamp={2}>
                {comic.description || 'No description'}
            </Text>

            <Group justify='space-between'>
                {comic.price !== null && comic.price !== undefined ? (
                    <Text size='sm' fw={500} c='blue'>
                        ${Number(comic.price).toFixed(2)}
                    </Text>
                ) : (
                    <div />
                )}
                <Group gap='xs'>
                    <Button
                        size='xs'
                        variant='subtle'
                        leftSection={<IconEdit size={14} />}
                        onClick={() => onEdit(comic)}
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

export default ComicCard;
