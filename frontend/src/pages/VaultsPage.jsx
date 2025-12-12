import { useState } from 'react';
import {
    Container,
    Title,
    Button,
    Group,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vaultApi } from '../api/vaults';
import { inventoryApi } from '../api/inventory';
import VaultList from '../components/vaults/VaultList';
import VaultForm from '../components/vaults/VaultForm';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';

function VaultsPage() {
    const [formVault, setFormVault] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const queryClient = useQueryClient();

    // Fetch all vaults and cache result
    const {
        data: vaults,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['vaults'],
        queryFn: vaultApi.getAll,
    });

    const handleClose = () => {
        setFormVault(null);
    };

    // Invalidate query to refetch vaults
    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['vaults'] });
        handleClose();
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error.message} />;

    // Filter vaults by search query
    const filteredVaults =
        vaults?.filter(
            (vault) =>
                vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vault.location.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

    return (
        <Container size='xl'>
            <Stack gap='md'>
                <Group justify='space-between'>
                    <Title order={2}>Vaults</Title>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setFormVault({})}
                    >
                        New Vault
                    </Button>
                </Group>

                <TextInput
                    placeholder='Search vaults by name or location...'
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <VaultList
                    vaults={filteredVaults}
                    onEdit={(vault) => setFormVault(vault)}
                />

                <VaultForm
                    opened={formVault !== null}
                    vault={formVault?.id ? formVault : null}
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                />
            </Stack>
        </Container>
    );
}
export default VaultsPage;
