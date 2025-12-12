import { useState } from 'react';
import {
    Modal,
    Select,
    NumberInput,
    Button,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaultApi } from '../../api/vaults';
import { inventoryApi } from '../../api/inventory';
import { showSuccess, showError } from '../../utils/notifications';

function TransferModal({ opened, onClose, sourceVaultId }) {
    const queryClient = useQueryClient();

    // form control
    const [formData, setFormData] = useState({
        destinationVaultId: '',
        comicId: '',
        quantity: 1,
    });

    // error state used to show error messages under inputs
    const [errors, setErrors] = useState({});

    // query all vaults and caches under ['vaults'] queryKey
    // used to populate the destination dropdown
    const { data: vaults } = useQuery({
        queryKey: ['vaults'],
        queryFn: vaultApi.getAll,
    });

    // query for a vault's inventory and caches under ['inventory', sourceVaultId] key
    // used to see what comics you can transfer and how many are available
    const { data: sourceInventory } = useQuery({
        queryKey: ['inventory', sourceVaultId],
        queryFn: () => inventoryApi.getByVault(sourceVaultId),
    });

    // called in handleSubmit function
    // mutation to transfer comic from one vault to another
    // calls API route
    // invalidate dependent queries on success
    const transferMutation = useMutation({
        mutationFn: (data) => inventoryApi.transfer(data),
        onSuccess: () => {
            showSuccess('Comics transferred successfully');
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['vaults'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            setFormData({ destinationVaultId: '', comicId: '', quantity: 1 });
            onClose();
        },
        onError: (error) => {
            showError(error, 'Error', 'Failed to transfer comics');
        },
    });

    // filter destination vaults (exclude source)
    // ensures you cannot transfer to the same vault
    const destinationVaults =
        vaults?.filter((v) => v.id.toString() !== sourceVaultId) || [];
    const destinationOptions = destinationVaults.map((v) => ({
        value: v.id.toString(),
        label: v.name,
    }));

    // list of comic options from source inventory
    const comicOptions =
        sourceInventory?.map((item) => ({
            value: item.comic.id.toString(),
            label: `${item.comic.name} (Available: ${item.quantity})`,
        })) || [];

    // get max quantity for selected comic
    const selectedInventoryItem = sourceInventory?.find(
        (item) => item.comic.id.toString() === formData.comicId
    );
    const maxQuantity = selectedInventoryItem?.quantity || 0;

    // client side validation of form fields
    const validate = () => {
        const newErrors = {};

        if (!formData.destinationVaultId) {
            newErrors.destinationVaultId = 'Please select a destination vault';
        }

        if (formData.destinationVaultId === sourceVaultId) {
            newErrors.destinationVaultId =
                'Source and destination must be different';
        }

        if (!formData.comicId) {
            newErrors.comicId = 'Please select a comic';
        }

        if (!formData.quantity || formData.quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1';
        }

        if (formData.quantity > maxQuantity) {
            newErrors.quantity = `Only ${maxQuantity} available`;
        }

        return newErrors;
    };

    // runs on form submission
    // triggers transfer mutation
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        transferMutation.mutate({
            sourceVaultId: parseInt(sourceVaultId),
            destinationVaultId: parseInt(formData.destinationVaultId),
            comicId: parseInt(formData.comicId),
            quantity: formData.quantity,
        });
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title='Transfer Comics'
            size='md'
        >
            <form onSubmit={handleSubmit}>
                <Stack gap='sm'>
                    <Text size='sm' c='dimmed'>
                        Transfer comics from this vault to another vault
                    </Text>

                    <Select
                        label='Destination Vault'
                        placeholder='Select destination'
                        data={destinationOptions}
                        value={formData.destinationVaultId}
                        onChange={(value) =>
                            setFormData({
                                ...formData,
                                destinationVaultId: value,
                            })
                        }
                        error={errors.destinationVaultId}
                        required
                    />

                    <Select
                        label='Comic'
                        placeholder='Select a comic'
                        data={comicOptions}
                        searchable
                        value={formData.comicId}
                        onChange={(value) =>
                            setFormData({ ...formData, comicId: value })
                        }
                        error={errors.comicId}
                        required
                    />

                    <NumberInput
                        label='Quantity'
                        placeholder='1'
                        min={1}
                        max={maxQuantity}
                        value={formData.quantity}
                        onChange={(value) =>
                            setFormData({ ...formData, quantity: value })
                        }
                        error={errors.quantity}
                        description={
                            maxQuantity > 0 ? `Available: ${maxQuantity}` : ''
                        }
                        required
                    />

                    <Group justify='flex-end' mt='md'>
                        <Button
                            variant='subtle'
                            onClick={onClose}
                            disabled={transferMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            loading={transferMutation.isPending}
                        >
                            Transfer
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}

export default TransferModal;
