import {
    Container,
    Title,
    SimpleGrid,
    Paper,
    Text,
    Group,
    Progress,
    Alert,
    Stack,
    Anchor,
} from '@mantine/core';
import { IconBox, IconBook, IconAlertTriangle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { vaultApi } from '../api/vaults';
import { comicApi } from '../api/comics';
import { inventoryApi } from '../api/inventory';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';
import {
    calculateTotalQuantity,
    calculateCapacityPercentage,
} from '../utils/inventory';

function Dashboard() {
    const navigate = useNavigate();

    // Fetch all vaults and cache result
    // Shares key with the useQuery in VaultsPage
    const {
        data: vaults,
        isLoading: vaultsLoading,
        error: vaultsError,
    } = useQuery({
        queryKey: ['vaults'],
        queryFn: vaultApi.getAll,
    });

    // Fetch all comics and cache result
    // Shares key with the useQuery in ComicsPage
    const {
        data: comics,
        isLoading: comicsLoading,
        error: comicsError,
    } = useQuery({
        queryKey: ['comics'],
        queryFn: comicApi.getAll,
    });

    // Fetch inventory for all vaults to calculate capacity
    const { data: vaultInventories } = useQuery({
        queryKey: ['dashboard', vaults?.length],
        queryFn: async () => {
            if (!vaults) return [];
            const inventories = await Promise.all(
                vaults.map(async (vault) => {
                    try {
                        const inventory = await inventoryApi.getByVault(
                            vault.id
                        );
                        const currentCount = calculateTotalQuantity(inventory);
                        const percentage = calculateCapacityPercentage(
                            currentCount,
                            vault.maxCapacity
                        );
                        return {
                            vault,
                            currentCount,
                            percentage,
                        };
                    } catch {
                        return {
                            vault,
                            currentCount: 0,
                            percentage: 0,
                        };
                    }
                })
            );
            return inventories;
        },
        enabled: !!vaults?.length,
    });

    // if loading / error
    if (vaultsLoading || comicsLoading) return <LoadingSpinner />;
    if (vaultsError) return <ErrorAlert message={vaultsError.message} />;
    if (comicsError) return <ErrorAlert message={comicsError.message} />;

    // to set the color for the capacity bar
    const getCapacityColor = (percentage) => {
        if (percentage >= 90) return 'red';
        if (percentage >= 80) return 'yellow';
        if (percentage >= 60) return 'blue';
        return 'green';
    };

    // filtering for capacity alerts in the warning banner
    // only when capacity is at 80% or higher
    const vaultsWithCapacity = vaultInventories || [];
    const alertVaults = vaultsWithCapacity.filter(
        ({ percentage }) => percentage >= 80
    );

    return (
        <Container size='xl'>
            <Title order={2} mb='lg'>
                Dashboard
            </Title>

            {/* conditional rendering for capacity warning banner */}
            {alertVaults.length > 0 && (
                <Alert
                    icon={<IconAlertTriangle size={20} />}
                    title='Capacity Warning'
                    color='yellow'
                    mb='md'
                >
                    {alertVaults.length === 1 ? (
                        <Text size='sm'>
                            <strong>{alertVaults[0].vault.name}</strong> is at{' '}
                            {alertVaults[0].percentage.toFixed(0)}% capacity
                        </Text>
                    ) : (
                        <Text size='sm'>
                            {alertVaults.length} vaults are at or above 80%
                            capacity
                        </Text>
                    )}
                </Alert>
            )}

            {/* total vaults and comics cards */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' mb='xl'>
                <Paper shadow='sm' p='xl' withBorder>
                    <Group>
                        <Anchor
                            onClick={() => navigate('/vaults')}
                            style={{ textDecoration: 'none' }}
                        >
                            <IconBox size={48} color='blue' />
                        </Anchor>
                        <div>
                            <Text size='xl' fw={700}>
                                {vaults?.length || 0}
                            </Text>
                            <Text size='sm' c='dimmed'>
                                Total Vaults
                            </Text>
                        </div>
                    </Group>
                </Paper>

                <Paper shadow='sm' p='xl' withBorder>
                    <Group>
                        <Anchor
                            onClick={() => navigate('/comics')}
                            style={{ textDecoration: 'none' }}
                        >
                            <IconBook size={48} color='green' />
                        </Anchor>
                        <div>
                            <Text size='xl' fw={700}>
                                {comics?.length || 0}
                            </Text>
                            <Text size='sm' c='dimmed'>
                                Total Comics
                            </Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>

            {/* capacity bars for vaults */}
            {vaultsWithCapacity.length > 0 && (
                <>
                    <Title order={3} mb='md'>
                        Vault Capacity
                    </Title>
                    <Stack gap='md'>
                        {vaultsWithCapacity.map(
                            ({ vault, currentCount, percentage }) => (
                                <Paper
                                    key={vault.id}
                                    shadow='sm'
                                    p='md'
                                    withBorder
                                >
                                    <Group justify='space-between' mb='xs'>
                                        <Anchor
                                            size='sm'
                                            fw={500}
                                            onClick={() =>
                                                navigate(
                                                    `/inventory/${vault.id}`
                                                )
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {vault.name}
                                        </Anchor>
                                        <Text size='sm' c='dimmed'>
                                            {currentCount} / {vault.maxCapacity}{' '}
                                            ({percentage.toFixed(1)}%)
                                        </Text>
                                    </Group>
                                    <Progress
                                        value={percentage}
                                        color={getCapacityColor(percentage)}
                                        size='lg'
                                        radius='md'
                                    />
                                </Paper>
                            )
                        )}
                    </Stack>
                </>
            )}
        </Container>
    );
}

export default Dashboard;
