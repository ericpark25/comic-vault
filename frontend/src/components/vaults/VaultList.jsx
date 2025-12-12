import { SimpleGrid, Text } from '@mantine/core';
import VaultCard from './VaultCard';

function VaultList({ vaults, onEdit }) {
    if (!vaults || vaults.length === 0) {
        return (
            <Text c='dimmed'>
                No vaults yet. Create one to get started!
            </Text>
        );
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
            {vaults.map((vault) => (
                <VaultCard key={vault.id} vault={vault} onEdit={onEdit} />
            ))}
        </SimpleGrid>
    );
}

export default VaultList;
