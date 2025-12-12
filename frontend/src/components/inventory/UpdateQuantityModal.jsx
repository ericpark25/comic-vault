import { useState, useEffect } from 'react';
import { Modal, NumberInput, Button, Group } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory';
import { showSuccess, showError } from '../../utils/notifications';

function UpdateQuantityModal({ item, vaultId, onClose }) {
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(0);
    const [error, setError] = useState('');

    // prefill quantity; when item changes, modal preload st he current comic's quantity in inventory
    useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
            setError('');
        }
    }, [item]);

    // called by handleSubmit
    // mutation for updating an inventory record's quantity
    // invalidate dependent queries on success
    const updateMutation = useMutation({
        mutationFn: (data) =>
            inventoryApi.updateQuantity(vaultId, item.comic.id, data),
        onSuccess: () => {
            showSuccess('Quantity updated');
            queryClient.invalidateQueries({ queryKey: ['inventory', vaultId] });
            queryClient.invalidateQueries({ queryKey: ['vaults'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            onClose();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to update quantity');
        },
    });

    // triggers update mutation, runs on form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (quantity < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        setError('');
        updateMutation.mutate({ quantity });
    };

    if (!item) return null;

    return (
        <Modal
            opened={!!item}
            onClose={onClose}
            title={`Update Quantity: ${item.comic.name}`}
        >
            <form onSubmit={handleSubmit}>
                <NumberInput
                    label='Quantity'
                    placeholder='0'
                    min={0}
                    value={quantity}
                    onChange={setQuantity}
                    error={error}
                    mb='md'
                    required
                />

                <Group justify='flex-end'>
                    <Button
                        variant='subtle'
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' loading={updateMutation.isPending}>
                        Update
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}

export default UpdateQuantityModal;
