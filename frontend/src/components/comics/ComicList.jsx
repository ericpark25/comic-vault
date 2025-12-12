import { SimpleGrid } from '@mantine/core';
import ComicCard from './ComicCard';

function ComicList({ comics, onEdit }) {
    if (!comics || comics.length === 0) {
        return <p className='text-gray-500'>No comics found.</p>;
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
            {comics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} onEdit={onEdit} />
            ))}
        </SimpleGrid>
    );
}

export default ComicList;
