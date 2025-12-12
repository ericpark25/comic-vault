import { useState, useEffect } from 'react';
import { Modal, Select, NumberInput, Button, Group } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comicApi } from '../../api/comics';
import { inventoryApi } from '../../api/inventory';
import { showSuccess, showError } from '../../utils/notifications';
import { calculateTotalQuantity } from '../../utils/inventory';

function AddComicModal({ opened, onClose, vaultId, vault }) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        comicId: '',
        quantity: 1,
    });

    const [errors, setErrors] = useState({});

    // Clear form and errors when modal closes
    useEffect(() => {
        if (!opened) {
            setFormData({ comicId: '', quantity: 1 });
            setErrors({});
        }
    }, [opened]);

    // fetch comics and cache under 'comics' key
    const { data: comics } = useQuery({
        queryKey: ['comics'],
        queryFn: comicApi.getAll,
    });

    // fetch vault's inventory and cache under ['inventory', vaultId] key
    const { data: inventory } = useQuery({
        queryKey: ['inventory', vaultId],
        queryFn: () => inventoryApi.getByVault(vaultId),
    });

    // called by handleSubmit
    // mutation for adding a comic to a vault's inventory on the backend
    const addMutation = useMutation({
        mutationFn: (data) => inventoryApi.addComic(vaultId, data),
        onSuccess: () => {
            showSuccess('Comic added to vault');
            queryClient.invalidateQueries({ queryKey: ['inventory', vaultId] });
            queryClient.invalidateQueries({ queryKey: ['vaults'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            setFormData({ comicId: '', quantity: 1 });
            onClose();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to add comic');
        },
    });

    // possible comics to add to vault's inventory
    const comicOptions =
        comics?.map((comic) => ({
            value: comic.id.toString(),
            label: `${comic.name} (${comic.sku})`,
        })) || [];

    // client side validation of fields
    const validate = () => {
        const newErrors = {};

        if (!formData.comicId) {
            newErrors.comicId = 'Please select a comic';
        }

        if (!formData.quantity || formData.quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1';
        }

        // Calculate current capacity
        const currentCount = calculateTotalQuantity(inventory);
        const remainingCapacity = vault.maxCapacity - currentCount;

        // prevent adding more than fits
        if (formData.quantity > remainingCapacity) {
            newErrors.quantity = `Only ${remainingCapacity} spots remaining in this vault`;
        }

        return newErrors;
    };

    // runs on form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        addMutation.mutate({
            comicId: parseInt(formData.comicId),
            quantity: formData.quantity,
        });
    };

    // Calculate remaining capacity for display
    const currentCount = calculateTotalQuantity(inventory);
    const remainingCapacity = vault.maxCapacity - currentCount;

    return (
        <Modal opened={opened} onClose={onClose} title='Add Comic to Vault'>
            <form onSubmit={handleSubmit}>
                <Select
                    label='Comic'
                    placeholder='Select a comic'
                    data={comicOptions}
                    searchable
                    value={formData.comicId}
                    onChange={(value) => {
                        setFormData({ ...formData, comicId: value });
                        setErrors({ ...errors, comicId: '' });
                    }}
                    error={errors.comicId}
                    mb='sm'
                    required
                />

                <NumberInput
                    label='Quantity'
                    placeholder='1'
                    min={1}
                    value={formData.quantity}
                    onChange={(value) => {
                        setFormData({ ...formData, quantity: value });
                        setErrors({ ...errors, quantity: '' });
                    }}
                    error={errors.quantity}
                    description={`Remaining capacity: ${remainingCapacity}`}
                    mb='md'
                    required
                />

                <Group justify='flex-end'>
                    <Button
                        variant='subtle'
                        onClick={onClose}
                        disabled={addMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' loading={addMutation.isPending}>
                        Add
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}

export default AddComicModal;
