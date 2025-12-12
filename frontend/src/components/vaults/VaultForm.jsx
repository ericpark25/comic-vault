import { useState, useEffect } from 'react';
import { Modal, TextInput, NumberInput, Button, Group } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { vaultApi } from '../../api/vaults';
import { showSuccess, showError } from '../../utils/notifications';

function VaultForm({ opened, vault, onClose, onSuccess }) {
    // Determines if form is for editing or creating a vault
    const isEditing = !!vault;

    // Pre-populate form data if it's an edit form; default values if create form
    // Controlled form
    const [formData, setFormData] = useState({
        name: vault?.name || '',
        location: vault?.location || '',
        maxCapacity: vault?.maxCapacity || 100,
    });

    const [errors, setErrors] = useState({});

    // Reset form when modal opens/closes or vault changes
    useEffect(() => {
        if (opened) {
            setFormData({
                name: vault?.name || '',
                location: vault?.location || '',
                maxCapacity: vault?.maxCapacity || 100,
            });
            setErrors({});
        }
    }, [opened, vault]);

    // Mutation to create a new vault
    const createMutation = useMutation({
        mutationFn: vaultApi.create,
        onSuccess: () => {
            showSuccess('Vault created successfully');
            onSuccess();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to create vault');
        },
    });

    // Mutation to update an existing vault
    const updateMutation = useMutation({
        mutationFn: (data) => vaultApi.update(vault.id, data),
        onSuccess: () => {
            showSuccess('Vault updated successfully');
            onSuccess();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to update vault');
        },
    });

    // Form validation
    const validate = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Vault name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name cannot exceed 100 characters';
        }

        if (!formData.location || formData.location.trim() === '') {
            newErrors.location = 'Location is required';
        } else if (formData.location.length > 255) {
            newErrors.location = 'Location cannot exceed 255 characters';
        }

        if (!formData.maxCapacity || formData.maxCapacity < 1) {
            newErrors.maxCapacity = 'Max capacity must be at least 1';
        }

        return newErrors;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        // Different mutations based on whether the form is for editing or deleting
        if (isEditing) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEditing ? 'Edit Vault' : 'Create Vault'}
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    label='Name'
                    placeholder='My Vault'
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                    mb='sm'
                    required
                />

                <TextInput
                    label='Location'
                    placeholder='Location'
                    value={formData.location}
                    onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                    }
                    error={errors.location}
                    mb='sm'
                    required
                />

                <NumberInput
                    label='Max Capacity'
                    placeholder='100'
                    value={formData.maxCapacity}
                    onChange={(value) =>
                        setFormData({ ...formData, maxCapacity: value })
                    }
                    error={errors.maxCapacity}
                    mb='md'
                    min={1}
                    required
                />

                <Group justify='flex-end' mt='md'>
                    <Button
                        variant='subtle'
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' loading={isSubmitting}>
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
export default VaultForm;
