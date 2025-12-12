import { SimpleGrid } from '@mantine/core';
import VaultCard from './VaultCard';

function VaultList({ vaults, onEdit }) {
    if (!vaults || vaults.length === 0) {
        return (
            <p className='text-gray-500'>
                No vaults yet. Create one to get started!
            </p>
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
