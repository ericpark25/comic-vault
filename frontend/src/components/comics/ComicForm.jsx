import { useState, useEffect } from 'react';
import {
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Button,
    Group,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { comicApi } from '../../api/comics';
import { showSuccess, showError } from '../../utils/notifications';

function ComicForm({ opened, comic, onClose, onSuccess }) {
    // Determines if form is for editing or creating a vault
    const isEditing = !!comic;

    // Pre-populate form data if it's an edit form; default values if create form
    // Controlled form
    const [formData, setFormData] = useState({
        sku: comic?.sku || '',
        name: comic?.name || '',
        description: comic?.description || '',
        price: comic?.price || 0,
    });

    const [errors, setErrors] = useState({});

    // Reset form when modal opens/closes or comic changes
    useEffect(() => {
        if (opened) {
            setFormData({
                sku: comic?.sku || '',
                name: comic?.name || '',
                description: comic?.description || '',
                price: comic?.price || 0,
            });
            setErrors({});
        }
    }, [opened, comic]);

    // Mutation to create a new comic
    const createMutation = useMutation({
        mutationFn: comicApi.create,
        onSuccess: () => {
            showSuccess('Comic created successfully');
            onSuccess();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to create comic');
        },
    });

    // Mutation to update an existing comic
    const updateMutation = useMutation({
        mutationFn: (data) => comicApi.update(comic.id, data),
        onSuccess: () => {
            showSuccess('Comic updated successfully');
            onSuccess();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to update comic');
        },
    });

    // Form validation
    const validate = () => {
        const newErrors = {};

        if (!formData.sku || formData.sku.trim() === '') {
            newErrors.sku = 'SKU is required';
        } else if (formData.sku.length > 50) {
            newErrors.sku = 'SKU cannot exceed 50 characters';
        }

        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Comic name is required';
        } else if (formData.name.length > 150) {
            newErrors.name = 'Name cannot exceed 150 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        if (
            formData.price !== null &&
            formData.price !== undefined &&
            formData.price < 0
        ) {
            newErrors.price = 'Price must be non-negative';
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
            title={isEditing ? 'Edit Comic' : 'Create Comic'}
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    label='SKU'
                    placeholder='CMC-001'
                    value={formData.sku}
                    onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                    }
                    error={errors.sku}
                    mb='sm'
                    required
                />

                <TextInput
                    label='Name'
                    placeholder='Amazing Spider-Man #1'
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                    mb='sm'
                    required
                />

                <Textarea
                    label='Description'
                    placeholder='First appearance of...'
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    error={errors.description}
                    mb='sm'
                    rows={4}
                />

                <NumberInput
                    label='Price'
                    placeholder='0.00'
                    value={formData.price}
                    onChange={(value) =>
                        setFormData({ ...formData, price: value })
                    }
                    error={errors.price}
                    mb='md'
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    prefix='$'
                    allowNegative={false}
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

export default ComicForm;
