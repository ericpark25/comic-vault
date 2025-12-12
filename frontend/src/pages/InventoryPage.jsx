import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Title,
    Button,
    Group,
    Stack,
    Breadcrumbs,
    Anchor,
    Text,
} from '@mantine/core';
import {
    IconPlus,
    IconArrowLeft,
    IconArrowsExchange,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { vaultApi } from '../api/vaults';
import { inventoryApi } from '../api/inventory';
import InventoryTable from '../components/inventory/InventoryTable';
import AddComicModal from '../components/inventory/AddComicModal';
import TransferModal from '../components/inventory/TransferModal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';
import { calculateTotalQuantity } from '../utils/inventory';

function InventoryPage() {
    const { vaultId } = useParams();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    // Fetch all vaults and cache result
    // Shares key with the useQuery in VaultsPage
    const {
        data: vault,
        isLoading: vaultLoading,
        error: vaultError,
    } = useQuery({
        queryKey: ['vaults', vaultId],
        queryFn: () => vaultApi.getById(vaultId),
    });

    // Fetch all inventory and cache result
    const {
        data: inventory,
        isLoading: inventoryLoading,
        error: inventoryError,
    } = useQuery({
        queryKey: ['inventory', vaultId],
        queryFn: () => inventoryApi.getByVault(vaultId),
    });

    // if loading / error
    if (vaultLoading || inventoryLoading) return <LoadingSpinner />;
    if (vaultError) return <ErrorAlert message={vaultError.message} />;
    if (inventoryError) return <ErrorAlert message={inventoryError.message} />;

    // Calculate current quantity
    const currentCount = calculateTotalQuantity(inventory);

    return (
        <Container size='xl'>
            <Stack gap='md'>
                <Breadcrumbs>
                    <Anchor component={Link} to='/vaults'>
                        Vaults
                    </Anchor>
                    <span>{vault.name}</span>
                </Breadcrumbs>

                <Group justify='space-between'>
                    <div>
                        <Title order={2}>{vault.name} Inventory</Title>
                        <Text c='dimmed'>
                            {currentCount} / {vault.maxCapacity} comics
                        </Text>
                    </div>
                    <Group>
                        <Button
                            variant='subtle'
                            leftSection={<IconArrowLeft size={16} />}
                            component={Link}
                            to='/vaults'
                        >
                            Back to Vaults
                        </Button>
                        <Button
                            variant='light'
                            leftSection={<IconArrowsExchange size={16} />}
                            onClick={() => setIsTransferModalOpen(true)}
                        >
                            Transfer
                        </Button>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Comic
                        </Button>
                    </Group>
                </Group>

                <InventoryTable inventory={inventory} vaultId={vaultId} />

                <AddComicModal
                    opened={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    vaultId={vaultId}
                    vault={vault}
                />

                <TransferModal
                    opened={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    sourceVaultId={vaultId}
                />
            </Stack>
        </Container>
    );
}

export default InventoryPage;
